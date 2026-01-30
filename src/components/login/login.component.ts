import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, CommonModule],
  template: `
    <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      
      <!-- Login Card -->
      <div class="w-full max-w-md p-10 glass-card rounded-[2.5rem] shadow-2xl animate-slide-up ring-1 ring-white/5 relative z-10">
        
        <div class="text-center mb-10">
          <div class="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-primary-500/20 mb-6 rotate-3">
            <svg class="w-10 h-10 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
          </div>
          <h2 class="text-3xl font-bold tracking-tight text-stone-100">{{ 'auth.welcome' | translate }}</h2>
          <p class="mt-3 text-stone-400">{{ 'auth.signin_subtitle' | translate }}</p>
        </div>
        
        <form class="space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-5">
            <div>
              <label for="email" class="block text-sm font-semibold text-stone-300 mb-2 ml-1">{{ 'auth.email' | translate }}</label>
              <input id="email" type="email" formControlName="email" 
                     class="block w-full px-5 py-4 bg-stone-900/50 border rounded-2xl text-stone-100 placeholder-stone-600 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-stone-900 transition-all outline-none" 
                     [class.border-red-500]="isFieldInvalid('email')"
                     [class.border-stone-800]="!isFieldInvalid('email')"
                     placeholder="you@example.com">
              @if (isFieldInvalid('email')) {
                <p class="mt-2 ml-1 text-xs text-rose-400 font-medium animate-fade-in">Please enter a valid email address.</p>
              }
            </div>
            <div>
              <label for="password" class="block text-sm font-semibold text-stone-300 mb-2 ml-1">{{ 'auth.password' | translate }}</label>
              <input id="password" type="password" formControlName="password" 
                     class="block w-full px-5 py-4 bg-stone-900/50 border rounded-2xl text-stone-100 placeholder-stone-600 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-stone-900 transition-all outline-none" 
                     [class.border-red-500]="isFieldInvalid('password')"
                     [class.border-stone-800]="!isFieldInvalid('password')"
                     placeholder="••••••••">
              @if (isFieldInvalid('password')) {
                <p class="mt-2 ml-1 text-xs text-rose-400 font-medium animate-fade-in">Password must be at least 6 characters.</p>
              }
            </div>
          </div>

          @if (error()) {
            <div class="text-rose-300 text-sm text-center bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 animate-fade-in flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {{ error() }}
            </div>
          }

          <button type="submit" 
                  [disabled]="isLoading()"
                  class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-primary-600 to-orange-600 hover:from-primary-500 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary-900/20 hover:shadow-primary-500/30 transform hover:-translate-y-0.5 active:translate-y-0">
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            }
            {{ 'auth.signin_btn' | translate }}
          </button>

          <div class="text-center text-sm pt-4">
            <span class="text-stone-500">{{ 'auth.no_account' | translate }}</span>
            <a routerLink="/signup" class="relative z-20 font-bold text-primary-400 hover:text-primary-300 ml-1 transition-colors cursor-pointer underline decoration-transparent hover:decoration-primary-400 decoration-2 underline-offset-4">{{ 'auth.signup_link' | translate }}</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject<FormBuilder>(FormBuilder);
  private auth = inject(AuthService);
  private router = inject<Router>(Router);

  error = signal<string>('');
  isLoading = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    const { email, password } = this.loginForm.value;
    const success = await this.auth.login(email!, password!);

    if (success) {
      this.router.navigate(['/explore']);
    } else {
      this.error.set('Invalid email or password');
    }
    
    this.isLoading.set(false);
  }
}