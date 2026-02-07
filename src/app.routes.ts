import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject<Router>(Router);
  
  if (auth.currentUser()) {
    return true;
  }
  return router.parseUrl('/login');
};

const guestGuard = () => {
  const auth = inject(AuthService);
  const router = inject<Router>(Router);
  
  if (!auth.currentUser()) {
    return true;
  }
  return router.parseUrl('/explore');
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'explore',
    loadComponent: () => import('./components/explore/explore.component').then(m => m.ExploreComponent),
    canActivate: [authGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent),
    canActivate: [authGuard]
  }
];