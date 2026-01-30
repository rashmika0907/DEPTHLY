import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LanguageService, Language } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, TranslatePipe],
  template: `
    @if (auth.isLoggedIn()) {
      <nav class="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            
            <!-- Logo Area -->
            <a routerLink="/explore" class="flex items-center gap-3 group">
              <div class="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-orange-500/10 rounded-xl border border-white/5 group-hover:border-primary-500/20 transition-all duration-300">
                <svg class="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span class="text-2xl font-bold tracking-tight text-gradient">
                Depthly
              </span>
            </a>
            
            <!-- Center Links (Desktop) -->
            <div class="hidden md:flex items-center gap-2 p-1.5 rounded-full border border-white/5 bg-stone-900/40">
              <a routerLink="/explore" 
                 routerLinkActive="bg-stone-800 text-stone-100 shadow-sm" 
                 class="px-6 py-2 rounded-full text-sm font-medium text-stone-400 hover:text-stone-200 transition-all duration-300">
                {{ 'nav.explore' | translate }}
              </a>
              <a routerLink="/history" 
                 routerLinkActive="bg-stone-800 text-stone-100 shadow-sm" 
                 class="px-6 py-2 rounded-full text-sm font-medium text-stone-400 hover:text-stone-200 transition-all duration-300">
                {{ 'nav.history' | translate }}
              </a>
            </div>

            <!-- Right Actions -->
            <div class="flex items-center gap-5">
              
              <!-- Language -->
              <div class="relative group">
                <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-stone-400 hover:bg-white/5 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                  <span class="uppercase tracking-wide text-xs">{{ langService.currentLang() }}</span>
                </button>
                <div class="absolute right-0 mt-4 w-40 glass-card rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right p-1.5 z-50 translate-y-2 group-hover:translate-y-0">
                  @for (option of langService.supportedLanguages; track option.code) {
                    <button (click)="langService.setLanguage(option.code)"
                            class="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-stone-700/50 hover:text-primary-300 transition-colors"
                            [class.text-primary-400]="langService.currentLang() === option.code"
                            [class.font-semibold]="langService.currentLang() === option.code">
                      {{ option.nativeName }}
                    </button>
                  }
                </div>
              </div>

              <!-- User Profile & Logout -->
              <div class="flex items-center gap-4 pl-5 border-l border-white/10">
                <div class="flex items-center gap-3">
                  <div class="flex flex-col items-end hidden lg:flex">
                    <span class="text-sm font-semibold text-stone-200">{{ auth.currentUser()?.name }}</span>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary-500/20 border-2 border-stone-800">
                    {{ getInitials(auth.currentUser()?.name) }}
                  </div>
                </div>

                <button (click)="auth.logout()" 
                        class="p-2.5 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        [title]="'nav.logout' | translate">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </nav>
      <!-- Spacer for fixed navbar -->
      <div class="h-28"></div>
    }
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  langService = inject(LanguageService);

  getInitials(name: string | undefined): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}