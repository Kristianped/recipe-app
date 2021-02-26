import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Router} from '@angular/router';

import * as AuthActions from './auth.actions';
import {environment} from '../../../environments/environment';
import {User} from '../user.module';
import {AuthService} from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return AuthActions.authenticateSuccess({email, userId, token, expirationDate, redirect: true});
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'An unknown error occured logging in';

  if (!errorResponse.error || !errorResponse.error.error) {
    return of(AuthActions.authenticateFail({errorMessage}));
  }

  switch (errorResponse.error.error.message) {
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid or the user does not have a password.';
      break;
    case 'USER_DISABLED':
      errorMessage = 'The user account has been disabled by an administrator.';
      break;
    case 'EMAIL_EXISTS':
      errorMessage = 'The email address is already in use by another account.';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Password sign-in is disabled for this project.';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
      break;
    default:
      break;
  }

  return of(AuthActions.authenticateFail({errorMessage}));
};

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap(action => {
        return this.http
          .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true
            }
          )
          .pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
              return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }),
            catchError(errorResponse => {
              return handleError(errorResponse);
            })
          );
      })
    )
  );

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap(action => {
        return this.http
          .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true
            }
          )
          .pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
              return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }),
            catchError(errorResponse => {
              return handleError(errorResponse);
            })
          );
      })
    )
  );

  authRedirect = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticateSuccess),
      tap(action => {
        if ((action.redirect)) {
          this.router.navigate(['/']);
        }
      })
    ),
{dispatch: false}
  );

  authLogout = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
    ),
    {dispatch: false}
  );

  authAutoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return {type: 'DUMMY'};
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return AuthActions.authenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });
        }

        return {type: 'DUMMY'};
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}


}
