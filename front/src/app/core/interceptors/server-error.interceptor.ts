import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationsService } from '../services/notifications.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (this.isUnauthorized(err)) {
          this.redirectToHomepage();
          return of(err);
        }

        this.notificationsService.showErrorMessage(this.getErrorMessage(err));
        return of(err);
      }),
    );
  }

  private isUnauthorized(err): boolean {
    return err.error && err.error.statusCode === 401;
  }

  private redirectToHomepage(): void {
    this.notificationsService.showInformation('Veuillez vous reconnecter');
    this.router.navigate(['/homepage']);
  }

  private getErrorMessage(err): string {
    if (err.error.statusCode && err.error.message) {
      return err.error.message;
    }

    return 'Une erreur s\'est produite';
  }
}
