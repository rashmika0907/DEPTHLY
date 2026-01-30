import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Impure to react to signal changes in service immediately
})
export class TranslatePipe implements PipeTransform {
  private langService = inject(LanguageService);

  transform(key: string): string {
    return this.langService.translate(key);
  }
}