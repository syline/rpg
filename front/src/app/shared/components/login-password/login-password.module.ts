import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { LoginPasswordComponent } from './login-password.component';

@NgModule({
  declarations: [LoginPasswordComponent],
  exports: [LoginPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class LoginPasswordModule { }
