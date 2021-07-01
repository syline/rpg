import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authenticationMockService } from 'src/app/shared/tests/services/authentication.mock.service';
import { routerMockService } from 'src/app/shared/tests/services/router.mock.service';
import { AuthenticationService } from '../services/authentication.service';
import { IsAuthenticatedGuard } from './is-logged-in.guard';

describe('Given IsAuthenticatedGuard', () => {
  let guard: IsAuthenticatedGuard;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      IsAuthenticatedGuard,
      {
        provide: AuthenticationService,
        useValue: authenticationMockService,
      },
      {
        provide: Router,
        useValue: routerMockService,
      }
    ]
  }));

  beforeEach(() => {
    guard = TestBed.inject(IsAuthenticatedGuard);
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  });

  describe('When guard is called', () => {
    it('Then it should be created', () => {
      expect(guard).toBeTruthy();
    });
  });

  describe('When canLoad is called and user is logged in', () => {
    let response;
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(true);
      response = guard.canLoad();
    });

    it('Then it return true', () => {
      expect(response).toEqual(true);
    });
  });

  describe('When canLoad is called and user is not logged in', () => {
    let response;
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
      response = guard.canLoad();
    });

    it('Then user is redirected to homepage is called', () => {
      expect(router.navigate).toHaveBeenCalledWith(['/homepage']);
    });

    it('Then it return false', () => {
      expect(response).toEqual(false);
    });
  });
});
