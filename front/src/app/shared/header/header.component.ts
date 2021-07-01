import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CreateAccountDialogComponent } from 'src/app/shared/header/create-account-dialog/create-account-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  constructor(
    private dialogService: MatDialog,
    private authService: AuthenticationService,
  ) { }

  createAccount(): void {
    this.dialogService.open(CreateAccountDialogComponent);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
