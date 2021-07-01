import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.isLoggedIn()) {
      const jsonReq: HttpRequest<any> = request.clone({
        setHeaders: {
          Authorization : this.getBearerToken(),
        }
      });
      return next.handle(jsonReq);
    }

    return next.handle(request);
  }

  getBearerToken(): string {
    return `Bearer ${this.authService.getToken()}`;
  }
}
