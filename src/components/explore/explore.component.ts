import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService, DepthLevel } from '../../services/gemini.service';
import { HistoryService } from '../../services/history.service';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, MarkdownPipe],
  encapsulation: ViewEncapsulation.None, // Needed for prose styles to apply to innerHTML
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-8rem)] flex flex-col gap-12">
      
      <!-- Input Section -->
      <div class="flex flex-col gap-10 animate-slide-up">
        
        <div class="text-center space-y-3 mb-2">
           <h1 class="text-5xl md:text-6xl font-bold tracking-tighter text-stone-100">
             <span class="text-gradient">Understand anything.</span>
           </h1>
           <p class="text-stone-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">
             Select a cognitive depth level below and start learning.
           </p>
        </div>

        <div class="relative group max-w-2xl mx-auto w-full z-20">
          <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 via-orange-500 to-rose-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-500"></div>
          <div class="relative">
            <input 
              type="text" 
              [(ngModel)]="topic"
              (keydown.enter)="generate('Novice')"
              [placeholder]="'explore.placeholder' | translate" 
              [disabled]="isGenerating()"
              class="w-full bg-stone-900 border border-stone-800 text-stone-100 text-xl px-8 py-7 rounded-3xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 outline-none transition-all shadow-2xl placeholder-stone-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
            <div class="absolute right-6 top-1/2 -translate-y-1/2 text-primary-500 pointer-events-none transition-transform duration-500" [class.translate-x-2]="topic && !isGenerating()" [class.opacity-50]="!topic">
               <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
          </div>
        </div>

        <!-- Levels -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto w-full">
          @for (lvl of levels; track lvl) {
            <button 
              (click)="generate(lvl)"
              [disabled]="isGenerating() && currentLevel() !== lvl"
              [class]="getLevelClass(lvl)"
              class="relative group px-2 py-5 rounded-2xl text-sm font-semibold transition-all duration-300 border transform hover:-translate-y-1 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-lg overflow-hidden">
              
              <span class="relative z-10 flex flex-col items-center gap-1.5">
                <span class="text-[10px] uppercase tracking-widest opacity-60 font-bold">Lvl {{ getLevelIndex(lvl) }}</span>
                <span class="text-base tracking-tight">{{ 'lvl.' + lvl | translate }}</span>
              </span>
              
              <!-- Hover Glow -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              @if (isGenerating() && currentLevel() === lvl) {
                 <div class="absolute inset-0 bg-white/5 animate-pulse"></div>
                 <div class="absolute bottom-0 left-0 h-0.5 bg-white/50 animate-[shine_1.5s_infinite] w-full"></div>
              }
            </button>
          }
        </div>
      </div>

      <!-- Stop Button (Sticky/Prominent) -->
      @if (isGenerating()) {
        <div class="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <button (click)="stopGeneration()" class="flex items-center gap-3 px-8 py-4 bg-stone-800 text-rose-400 border border-rose-500/30 rounded-full hover:bg-stone-800 hover:text-rose-300 hover:border-rose-500/60 transition-all shadow-2xl hover:shadow-rose-900/20 active:scale-95 group backdrop-blur-md">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span class="font-bold tracking-wide">{{ 'explore.stop' | translate }}</span>
          </button>
        </div>
      }

      <!-- Output Area -->
      @if (displayText()) {
        <div class="glass-card rounded-[2rem] p-8 sm:p-14 shadow-2xl animate-fade-in ring-1 ring-white/5 relative overflow-hidden mb-20">
          
          <!-- Decorative blurred orb behind text -->
          <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-10 pb-8 border-b border-stone-800 relative z-10 gap-4">
            <div>
              <h2 class="text-3xl sm:text-4xl font-bold text-stone-100 mb-3 capitalize tracking-tight">{{ savedTopic() }}</h2>
              <div class="flex items-center gap-3">
                 <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/10 text-primary-300 border border-primary-500/20">
                  {{ 'lvl.' + currentLevel() | translate }}
                </span>
                <span class="text-xs text-stone-500 font-medium">Gemini 2.5 Flash • {{ currentLangCode() | uppercase }}</span>
              </div>
            </div>
            
            <button (click)="copyToClipboard()" class="self-start sm:self-auto p-3.5 text-stone-500 hover:text-stone-200 transition-colors rounded-2xl hover:bg-stone-800 border border-transparent hover:border-stone-700" [title]="'Copy'">
              @if (copied()) {
                <div class="flex items-center gap-2 text-emerald-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              }
            </button>
          </div>

          <!-- Content Render with Markdown Pipe -->
          <div class="relative z-10 prose prose-invert prose-lg max-w-none text-stone-300 leading-8 font-light"
               [innerHTML]="(displayText() + (isGenerating() ? ' ●' : '')) | markdown">
          </div>
        </div>
      } @else if (!isGenerating() && !topic) {
        <!-- Empty State -->
        <div class="flex flex-col items-center justify-center py-24 animate-fade-in opacity-50">
          <div class="w-24 h-24 mb-8 rounded-3xl bg-stone-900 border border-stone-800 flex items-center justify-center shadow-inner">
             <svg class="w-12 h-12 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          </div>
          <h3 class="text-2xl font-semibold text-stone-300 mb-3">{{ 'explore.empty_title' | translate }}</h3>
          <p class="text-stone-500 max-w-sm text-center">{{ 'explore.empty_desc' | translate }}</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ExploreComponent {
  private gemini = inject(GeminiService);
  private historyService = inject(HistoryService);
  private langService = inject(LanguageService);

  topic = '';
  savedTopic = signal('');
  displayText = signal('');
  currentLevel = signal<DepthLevel | ''>('');
  isGenerating = signal(false);
  copied = signal(false);
  currentLangCode = this.langService.currentLang;
  
  levels: DepthLevel[] = ['Kids', 'Teens', 'Novice', 'College', 'Expert'];
  
  private abortController: AbortController | null = null;

  getLevelIndex(lvl: DepthLevel): number {
    return this.levels.indexOf(lvl) + 1;
  }

  getLevelClass(lvl: DepthLevel): string {
    const base = 'border-stone-800 bg-stone-900/60 text-stone-400 hover:bg-stone-800 hover:border-stone-700 hover:text-stone-200';
    // Earthy/Human tones
    const active = {
      'Kids': 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.1)]',
      'Teens': 'bg-teal-500/10 border-teal-500/40 text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.1)]',
      'Novice': 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.1)]',
      'College': 'bg-blue-500/10 border-blue-500/40 text-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.1)]',
      'Expert': 'bg-rose-500/10 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(251,113,133,0.1)]',
    };

    if (this.currentLevel() === lvl) {
      return active[lvl];
    }
    return base;
  }

  async generate(level: DepthLevel) {
    if (!this.topic.trim()) return;
    
    if (this.isGenerating()) {
      this.stopGeneration();
    }

    this.isGenerating.set(true);
    this.currentLevel.set(level);
    this.savedTopic.set(this.topic);
    this.displayText.set('');
    this.copied.set(false);

    this.abortController = new AbortController();

    try {
      const currentLang = this.langService.currentLang();
      const stream = await this.gemini.generateExplanationStream(this.topic, level, currentLang);
      
      let fullText = '';
      
      for await (const chunk of stream) {
        if (this.abortController?.signal.aborted) {
          break;
        }
        fullText += chunk;
        this.displayText.set(fullText);
      }
      
      if (!this.abortController?.signal.aborted) {
        this.historyService.addEntry(this.topic, level, fullText);
      }

    } catch (err) {
      console.error(err);
      this.displayText.set(this.langService.translate('explore.error'));
    } finally {
      this.isGenerating.set(false);
      this.abortController = null;
    }
  }

  stopGeneration() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isGenerating.set(false);
  }

  copyToClipboard() {
    if (!this.displayText()) return;
    navigator.clipboard.writeText(this.displayText());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}