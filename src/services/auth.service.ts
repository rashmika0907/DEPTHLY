import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000/api/auth'
      : 'https://depthly-backend.onrender.com/api/auth';

  private readonly TOKEN_KEY = 'depthly_token';
  private readonly USER_KEY = 'depthly_user';

  private currentUserSignal = signal<User | null>(this.loadSession());
  currentUser = computed(() => this.currentUserSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private loadSession(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  isLoggedIn(): boolean {
  return !!this.getToken();
}


  async signup(name: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string; user: User }>(
          `${this.API_URL}/signup`,
          { name, email, password }
        )
      );

      this.setSession(response.token, response.user);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string; user: User }>(
          `${this.API_URL}/login`,
          { email, password }
        )
      );

      this.setSession(response.token, response.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  private setSession(token: string, user: User) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }
}
