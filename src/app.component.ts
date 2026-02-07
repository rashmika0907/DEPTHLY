import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-stone-950 text-stone-100 selection:bg-primary-500/30 selection:text-primary-100 overflow-x-hidden relative transition-colors duration-500">
      <!-- Global Background Gradients - Warm/Human Theme -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-rose-900/10 rounded-full blur-[130px] animate-pulse-slow"></div>
        <div class="absolute top-[30%] right-[-10%] w-[40%] h-[60%] bg-orange-900/10 rounded-full blur-[110px] animate-float"></div>
        <div class="absolute bottom-[-10%] left-[10%] w-[60%] h-[40%] bg-stone-800/20 rounded-full blur-[140px]"></div>
      </div>
      
      <div class="relative z-10 flex flex-col min-h-screen">
        <app-navbar />
        <main class="flex-grow">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppComponent {}