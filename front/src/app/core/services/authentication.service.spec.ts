import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ACCESS_TOKEN, CURRENT_USER_ID, CURRENT_USER_LOGIN } from 'src/app/shared/constants/local-storage.constant';
import { httpClientMockService } from 'src/app/shared/tests/services/http-client.mock.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

describe('Given AuthenticationService', () => {
  let service: AuthenticationService;
  let httpClient: HttpClient;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthenticationService,
      {
        provide: HttpClient,
        useValue: httpClientMockService,
      }
    ]
  }));

  beforeEach(() => {
    service = TestBed.inject(AuthenticationService);
    httpClient = TestBed.inject(HttpClient);
  });

  describe('When service is called', () => {
    it('Then it should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('When register is called', () => {
    const data = { login: '', password: '' };
    beforeEach(() => {
      service.register(data);
    });

    it('Then a POST is done to /authentication/register', () => {
      expect(httpClient.post).toHaveBeenCalledWith(`${environment.apiUrl}/authentication/register`, data);
    });
  });

  describe('When login is called', () => {
    const token = 'token';
    const id = 1;
    const login = 'login';
    const data = { login, password: '' };

    beforeEach(() => {
      httpClient.post = jasmine.createSpy('post').and.returnValue(of({ id, login, accessToken: token }));
      service.login(data).subscribe();
    });

    it('Then a POST is done to /authentication/login', () => {
      expect(httpClient.post).toHaveBeenCalledWith(`${environment.apiUrl}/authentication/login`, data);
    });

    it('Then localStorage has access token', () => {
      expect(localStorage.getItem(ACCESS_TOKEN)).toEqual(token);
    });

    it('Then localStorage has current user id', () => {
      expect(localStorage.getItem(CURRENT_USER_ID)).toEqual(id.toString());
    });

    it('Then localStorage has current user login', () => {
      expect(localStorage.getItem(CURRENT_USER_LOGIN)).toEqual(login);
    });
  });

  describe('When access token is stored in localStorage', () => {
    let response;

    beforeEach(() => {
      localStorage.setItem(ACCESS_TOKEN, 'token');
      response = service.isLoggedIn();
    });

    it('Then isLoggedIn should return true', () => {
      expect(response).toEqual(true);
    });
  });

  describe('When access token is not stored in localStorage', () => {
    let response;

    beforeEach(() => {
      localStorage.removeItem(ACCESS_TOKEN);
      response = service.isLoggedIn();
    });

    it('Then isLoggedIn should return false', () => {
      expect(response).toEqual(false);
    });
  });

  describe('When current user is Paul', () => {
    const currentUserLogin = 'Paul';
    let response;

    beforeEach(() => {
      localStorage.setItem(CURRENT_USER_LOGIN, currentUserLogin);
      response = service.getCurrentUserLogin();
    });

    it('Then getCurrentUserLogin should retrieve Paul', () => {
      expect(response).toEqual(currentUserLogin);
    });
  });

  describe('When current user id is 1', () => {
    const currentUserId = 1;
    let response;

    beforeEach(() => {
      localStorage.setItem(CURRENT_USER_ID, currentUserId.toString());
      response = service.getCurrentUserId();
    });

    it('Then getCurrentUserId should retrieve 1', () => {
      expect(response).toEqual(currentUserId.toString());
    });
  });

  describe('When token is ABC', () => {
    const token = 'ABC';
    let response;

    beforeEach(() => {
      localStorage.setItem(ACCESS_TOKEN, token);
      response = service.getToken();
    });

    it('Then getToken should retrieve ABC', () => {
      expect(response).toEqual(token);
    });
  });

  describe('When logout is called', () => {
    beforeEach(() => {
      service.logout();
    });

    it('Then getting current user id return null', () => {
      expect(localStorage.getItem(CURRENT_USER_ID)).toBeNull();
    });

    it('Then getting current user login return null', () => {
      expect(localStorage.getItem(CURRENT_USER_LOGIN)).toBeNull();
    });

    it('Then getting access token return null', () => {
      expect(localStorage.getItem(ACCESS_TOKEN)).toBeNull();
    });
  });
});
