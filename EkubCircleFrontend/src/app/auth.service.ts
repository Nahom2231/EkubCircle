import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, VerifyOtpRequest } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly tokenKey = 'ekub_token';
  private readonly userKey = 'ekub_user';

  register(body: RegisterRequest): Observable<RegisterResponse> { return this.http.post<RegisterResponse>('/api/auth/register', body); }
  verifyOtp(body: VerifyOtpRequest): Observable<AuthResponse> { return this.http.post<AuthResponse>('/api/auth/verify-otp', body).pipe(tap(r => this.saveSession(r))); }
  login(body: LoginRequest): Observable<AuthResponse> { return this.http.post<AuthResponse>('/api/auth/login', body).pipe(tap(r => this.saveSession(r))); }

  saveSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response));
  }
  token(): string | null { return localStorage.getItem(this.tokenKey); }
  user(): AuthResponse | null { const raw = localStorage.getItem(this.userKey); return raw ? JSON.parse(raw) as AuthResponse : null; }
  isLoggedIn(): boolean { return !!this.token(); }
  logout(): void { localStorage.removeItem(this.tokenKey); localStorage.removeItem(this.userKey); }
}
