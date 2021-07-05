import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { CreateAccountDialogComponent } from 'src/app/shared/components/header/create-account-dialog/create-account-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
    private dialogService: MatDialog,
    private authService: AuthenticationService,
  ) { }

  createAccount(): void {
    this.dialogService.open(CreateAccountDialogComponent);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/homepage']);
    this.notificationsService.showSuccessMessage('Déconnecté !');
  }
}
