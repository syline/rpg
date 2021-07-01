import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPasswordModule } from '../../components/login-password/login-password.module';
import { CreateAccountDialogComponent } from './create-account-dialog.component';

@NgModule({
  declarations: [CreateAccountDialogComponent],
  exports: [CreateAccountDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginPasswordModule,
  ],
})
export class CreateAccountDialogModule { }
