import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Libro } from '../../models/library';
import { idAsString } from '../../services/api-utils';
import { GlassButton } from '../glass-button/glass-button';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [GlassButton],
  templateUrl: './book-list.html',
  styles: [`
    .book-list { display: grid; gap: 12px; padding: 0; list-style: none; }
    .book-list li { position: relative; display: grid; gap: 6px; padding: 18px; color: #334155; background: linear-gradient(145deg, #ffffffc9, #ffffff73); border: 1px solid #ffffffc7; border-radius: 15px; box-shadow: inset 1px 1px 1px #fff, inset -1px -1px 1px #cbd5e133, 0 8px 20px #64748b18; backdrop-filter: blur(8px); transition: transform .25s, box-shadow .25s; }
    .book-list li:hover { transform: translateY(-2px); box-shadow: inset 1px 1px 1px #fff, 0 14px 26px #64748b2b; }
    .book-list strong { color: #1e293b; font-size: 17px; }
    .book-list span:not(.availability) { color: #64748b; font-size: 13px; }
    .availability { display: inline-block; width: 9px; height: 9px; margin-right: 8px; background: #22c55e; border-radius: 50%; }
    .availability.unavailable { background: #cbd5e1; }
    .loading { display: flex; align-items: center; gap: 9px; color: #64748b; }
    .empty-state { display: grid; justify-items: center; gap: 6px; padding: 58px 20px; color: #64748b; text-align: center; }
    .empty-state > span { color: #818cf8; font-size: 38px; }
    .empty-state strong { color: #475569; }
    .empty-state p { margin: 0; font-size: 13px; }
    .spinner { width: 16px; height: 16px; border: 2px solid #c7d2fe; border-top-color: #4f46e5; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {
  readonly books = input.required<Libro[]>();
  readonly loading = input(false);
  readonly loaded = input(false);
  readonly deletingId = input<string | null>(null);
  readonly deleteRequested = output<Libro>();

  bookId(book: Libro): string {
    return idAsString(book._id);
  }
}
