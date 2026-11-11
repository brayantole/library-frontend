import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Author } from '../../authors/models/author';
import { Genre } from '../../genres/models/genre';
import { BooksStore } from '../store/books.store';
import { GlassButton } from '../../../components/glass-button/glass-button';

@Component({
  selector: 'app-catalog-filter',
  imports: [GlassButton],
  templateUrl: './catalog-filter.html',
  styleUrl: './catalog-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogFilter {
  readonly authors = input.required<Author[]>();
  readonly genres = input.required<Genre[]>();
  readonly open = input(false);
  readonly closed = output<void>();
  readonly opened = output<void>();
  readonly authorDelete = output<Author>();
  readonly genreDelete = output<Genre>();
  readonly filter = inject(BooksStore);
  readonly pendingAuthorIds = signal<string[]>([]);
  readonly pendingGenreIds = signal<string[]>([]);

  toggle(): void {
    this.pendingAuthorIds.set([...this.filter.selectedAuthorIds()]);
    this.pendingGenreIds.set([...this.filter.selectedGenreIds()]);
  }

  toggleAuthor(id: string): void {
    this.pendingAuthorIds.update((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  }

  toggleGenre(id: string): void {
    this.pendingGenreIds.update((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  }

  clear(): void {
    this.pendingAuthorIds.set([]);
    this.pendingGenreIds.set([]);
    this.filter.clearFilters();
  }

  apply(): void {
    this.filter.setFilters(this.pendingAuthorIds(), this.pendingGenreIds());
    this.closed.emit();
  }
}
