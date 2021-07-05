import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
  selector: 'app-create-account-dialog',
  templateUrl: './create-account-dialog.component.html'
})
export class CreateAccountDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private dialogRef: MatDialogRef<CreateAccountDialogComponent>,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      register: [],
    });
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const formValues = this.form.value;

    this.authService.register(formValues.register).pipe(
      tap(() => {
        this.notificationsService.showSuccessMessage('Compte créé avec succès !');
        this.dialogRef.close();
      }),
    ).subscribe();
  }

}
