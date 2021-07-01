import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      auth: [],
    });
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const value = this.form.value;
    this.authService.login(value.auth).pipe(
      tap(() => {
        this.notificationsService.showSuccessMessage('Connecté !');
        this.router.navigate(['characters']);
      }),
    ).subscribe();
  }
}

