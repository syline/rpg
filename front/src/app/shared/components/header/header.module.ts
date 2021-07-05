import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginPasswordModule } from '../login-password/login-password.module';
import { CreateAccountDialogModule } from './create-account-dialog/create-account-dialog.module';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    LoginPasswordModule,
    ReactiveFormsModule,

    CreateAccountDialogModule,
  ]
})
export class HeaderModule { }
