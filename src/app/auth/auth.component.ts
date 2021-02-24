import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html'
})
export class AuthComponent implements OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
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

    this.isLoading = true;

    if (this.isLoginMode) {
      this.authSubscribe(this.authService.login(email, password));
    } else {
      this.authSubscribe(this.authService.signup(email, password));
    }

    form.reset();
  }

  private authSubscribe(authObs: Observable<AuthResponseData>): void {
    authObs.subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
      this.error = null;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.error = errorMessage;
      this.showErrorAlert(errorMessage);
      this.isLoading = false;
    });
  }

  onHandleError(): void {
    this.error = null;
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
