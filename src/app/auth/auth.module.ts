import {NgModule} from '@angular/core';
import {AuthComponent} from './auth.component';
import {AuthRoutingModule} from './auth.routing.module';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [AuthComponent],
  imports: [SharedModule, FormsModule, AuthRoutingModule]
})

export class AuthModule {}
