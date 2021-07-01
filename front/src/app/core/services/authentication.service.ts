import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ACCESS_TOKEN, CURRENT_USER } from 'src/app/shared/constants/local-storage.constant';
import { IAccessToken } from 'src/app/shared/interfaces/iaccess-token';
import { ILoginPassword } from 'src/app/shared/interfaces/ilogin-password';
import { IUser } from 'src/app/shared/interfaces/iuser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient) { }

  register(form: ILoginPassword): Observable<IUser> {
    return this.httpClient.post<IUser>(`${environment.apiUrl}/authentication/register`, form);
  }

  login(form: ILoginPassword): Observable<IAccessToken> {
    return this.httpClient.post<IAccessToken>(`${environment.apiUrl}/authentication/login`, form).pipe(
      tap((res: IAccessToken) => {
        this.saveCurrentUser(form.login);
        this.saveToken(res.accessToken);
      }),
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(ACCESS_TOKEN) !== null;
  }

  private saveCurrentUser(login: string): void {
    localStorage.setItem(CURRENT_USER, login);
  }

  getCurrentUser(): string {
    return localStorage.getItem(CURRENT_USER);
  }

  private saveToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  }

  getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN);
  }
}
