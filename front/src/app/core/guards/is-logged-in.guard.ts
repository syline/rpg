import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class IsAuthenticatedGuard implements CanLoad {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
  ) {}

  canLoad(): Observable<boolean>|Promise<boolean>|boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/homepage']);
    return false;
  }
}
