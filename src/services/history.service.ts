import { Injectable, signal, inject, effect } from '@angular/core';
import { AuthService } from './auth.service';

export interface HistoryItem {
  id: string;
  topic: string;
  level: string;
  content: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private authService = inject(AuthService);
  
  // Signals
  history = signal<HistoryItem[]>([]);

  constructor() {
    // Reactively load history whenever the current user changes
    effect(
      () => {
        const user = this.authService.currentUser();
        if (user) {
          this.loadHistoryForUser(user.id);
        } else {
          this.history.set([]);
        }
      },
      { allowSignalWrites: true }
    );
  }

  /**
   * Generates a unique storage key for the specific user
   */
  private getStorageKey(userId: string): string {
    return `depthly_history_${userId}`;
  }

  private loadHistoryForUser(userId: string) {
    const key = this.getStorageKey(userId);
    const stored = localStorage.getItem(key);
    this.history.set(stored ? JSON.parse(stored) : []);
  }

  addEntry(topic: string, level: string, content: string) {
    const user = this.authService.currentUser();
    if (!user) return;

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      topic,
      level,
      content,
      timestamp: Date.now()
    };

    const currentHistory = this.history();
    const updatedHistory = [newItem, ...currentHistory];
    
    // Update state
    this.history.set(updatedHistory);
    
    // Persist to user-specific local storage
    localStorage.setItem(this.getStorageKey(user.id), JSON.stringify(updatedHistory));
  }

  clearHistory() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.history.set([]);
    localStorage.removeItem(this.getStorageKey(user.id));
  }

  getEntry(id: string): HistoryItem | undefined {
    return this.history().find(item => item.id === id);
  }
}