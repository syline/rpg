import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationsService } from '../services/notifications.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationsService: NotificationsService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.notificationsService.showErrorMessage(this.getErrorMessage(err));
        return of(err);
      }),
    );
  }

  private getErrorMessage(err): string {
    if (err.error.statusCode && err.error.message) {
      return err.error.message;
    }

    return 'Une erreur s\'est produite';
  }
}
