import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  constructor(private snackBar: MatSnackBar) { }

  showInformation(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'OK', config);
  }

  showErrorMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = 'snack-bar-error';

    this.snackBar.open(message, 'OK', config);
  }

  showSuccessMessage(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = 'snack-bar-success';

    this.snackBar.open(message, 'OK', config);
  }
}
