import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ACCESS_TOKEN, CURRENT_USER_ID, CURRENT_USER_LOGIN } from 'src/app/shared/constants/local-storage.constant';
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

  login(form: ILoginPassword): Observable<IUser> {
    return this.httpClient.post<IUser>(`${environment.apiUrl}/authentication/login`, form).pipe(
      tap((res: IUser) => {
        this.saveCurrentUser(res);
        this.saveToken(res.accessToken);
      }),
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(ACCESS_TOKEN) !== null;
  }

  private saveCurrentUser(user: IUser): void {
    localStorage.setItem(CURRENT_USER_LOGIN, user.login);
    localStorage.setItem(CURRENT_USER_ID, user.id.toString());
  }

  getCurrentUserId(): string {
    return localStorage.getItem(CURRENT_USER_ID);
  }

  getCurrentUserLogin(): string {
    return localStorage.getItem(CURRENT_USER_LOGIN);
  }

  private saveToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
  }

  getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  logout(): void {
    localStorage.clear();
  }
}
