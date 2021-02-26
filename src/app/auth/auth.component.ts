import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;

      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }

    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(AuthActions.loginStart({email, password}));
    } else {
      this.store.dispatch(AuthActions.signupStart({email, password}));
    }

    form.reset();
  }

  onHandleError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  private showErrorAlert(message: string): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hosViewContainerRef = this.alertHost.viewContainerRef;
    hosViewContainerRef.clear();

    const componentRef = hosViewContainerRef.createComponent(componentFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hosViewContainerRef.clear();
    });
  }
}
