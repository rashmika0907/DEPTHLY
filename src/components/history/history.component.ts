import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HistoryService } from '../../services/history.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe, MarkdownPipe],
  encapsulation: ViewEncapsulation.None, // Needed for prose styles to apply to innerHTML
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-8rem)]">
      <div class="flex items-end justify-between mb-10 pb-6 border-b border-stone-800/50">
        <div>
          <h1 class="text-4xl font-bold text-stone-100 mb-2 tracking-tight">{{ 'history.title' | translate }}</h1>
          <p class="text-stone-400">Review your past learning sessions</p>
        </div>
        @if (historyService.history().length > 0) {
          <button (click)="historyService.clearHistory()" class="px-5 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20">
            {{ 'history.clear' | translate }}
          </button>
        }
      </div>

      <div class="grid gap-6">
        @for (item of historyService.history(); track item.id) {
          <div class="glass-card rounded-2xl p-6 transition-all duration-300 hover:bg-stone-800/60 hover:border-stone-700 hover:shadow-xl cursor-pointer group"
               [class.ring-1]="expandedId === item.id"
               [class.ring-primary-500]="expandedId === item.id"
               (click)="expandItem(item.id)">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                   <h3 class="text-xl font-semibold text-stone-200 group-hover:text-primary-300 transition-colors">{{ item.topic }}</h3>
                   <span [class]="getLevelBadgeClass(item.level)" class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border">
                    {{ 'lvl.' + item.level | translate }}
                  </span>
                </div>
                <div class="text-sm text-stone-500 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{{ item.timestamp | date:'mediumDate' }} • {{ item.timestamp | date:'shortTime' }}</span>
                </div>
              </div>
              
              <div class="p-2 rounded-full bg-stone-800/50 text-stone-500 group-hover:bg-primary-500/10 group-hover:text-primary-400 transition-colors">
                 <svg class="w-5 h-5 transform transition-transform duration-300" 
                      [class.rotate-180]="expandedId === item.id"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            @if (expandedId === item.id) {
              <div class="mt-8 pt-8 border-t border-stone-800 animate-slide-down">
                <div class="prose prose-invert prose-stone max-w-none text-stone-300 leading-relaxed"
                     [innerHTML]="item.content | markdown">
                </div>
              </div>
            }
          </div>
        } @empty {
          <div class="flex flex-col items-center justify-center py-32 glass-card rounded-[2rem] border-dashed border-2 border-stone-800 opacity-60">
            <div class="w-20 h-20 rounded-full bg-stone-900 flex items-center justify-center mb-6">
               <svg class="w-10 h-10 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="text-xl font-medium text-stone-300">{{ 'history.empty_title' | translate }}</h3>
            <p class="text-stone-500 mt-2">{{ 'history.empty_desc' | translate }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class HistoryComponent {
  historyService = inject(HistoryService);
  expandedId: string | null = null;

  expandItem(id: string) {
    if (this.expandedId === id) {
      this.expandedId = null;
    } else {
      this.expandedId = id;
    }
  }

  getLevelBadgeClass(level: string): string {
    switch(level) {
      case 'Kids': return 'border-amber-500/20 bg-amber-500/5 text-amber-300';
      case 'Teens': return 'border-teal-500/20 bg-teal-500/5 text-teal-300';
      case 'Novice': return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300';
      case 'College': return 'border-blue-500/20 bg-blue-500/5 text-blue-300';
      case 'Expert': return 'border-rose-500/20 bg-rose-500/5 text-rose-300';
      default: return 'border-stone-500/20 bg-stone-500/5 text-stone-400';
    }
  }
}