import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Autor, Genero } from '../../models/library';
import { idAsString } from '../../services/api-utils';
import { GlassButton } from '../glass-button/glass-button';

@Component({
  selector: 'app-author-filter',
  standalone: true,
  imports: [GlassButton],
  template: `
    <div class="filter-wrap">
      <app-glass-button
        [label]="'Mostrar libros' + (selected().length ? ' · ' + selected().length + ' autores' : '') + (selectedCategories().length ? ' · ' + selectedCategories().length + ' categorías' : '')"
        [ariaExpanded]="open()"
        [hasPopup]="true"
        width="260px"
        (clicked)="toggle.emit()"
      />
      @if (open()) {
        <section class="author-popover" role="dialog" aria-label="Filtrar por autores" (click)="$event.stopPropagation()">
          <div class="popover-heading">
            <div>
              <strong>Filtrar catálogo</strong>
              <span>Combina autores y categorías</span>
            </div>
            <button type="button" class="text-button" (click)="clearAll.emit()">Limpiar todo</button>
          </div>
          <label class="author-option">
            <input type="checkbox" [checked]="selected().length === 0 && selectedCategories().length === 0" [attr.aria-checked]="selected().length === 0 && selectedCategories().length === 0" (change)="clearAll.emit()" />
            <span>Todos</span>
          </label>
          @for (author of authors(); track authorId(author)) {
            <div class="author-option">
              <label>
                <input
                  type="checkbox"
                  [checked]="selected().includes(authorId(author))"
                  [attr.aria-checked]="selected().includes(authorId(author))"
                  (change)="toggleAuthor(authorId(author))"
                />
                <span>{{ author.name }}</span>
              </label>
              <app-glass-button label="Eliminar autor" width="32px" height="28px" (clicked)="deleteAuthorRequested.emit(author)" />
            </div>
          } @empty {
            <p class="muted">No hay autores disponibles.</p>
          }
          <div class="section-divider"></div>
          <div class="section-label">Categorías</div>
          <label class="author-option">
            <input type="checkbox" [checked]="selectedCategories().length === 0" [attr.aria-checked]="selectedCategories().length === 0" (change)="clearCategories.emit()" />
            <span>Todas</span>
          </label>
          @for (category of categories(); track categoryId(category)) {
            <div class="author-option">
              <label>
                <input type="checkbox" [checked]="selectedCategories().includes(categoryId(category))" [attr.aria-checked]="selectedCategories().includes(categoryId(category))" (change)="categorySelected.emit(categoryId(category))" />
                <span>{{ category.name }}</span>
              </label>
              <app-glass-button label="Eliminar categoría" width="32px" height="28px" (clicked)="deleteCategoryRequested.emit(category)" />
            </div>
          }
          <app-glass-button label="Ver libros" width="100%" (clicked)="apply.emit()" />
          <button type="button" class="close-button" (click)="close.emit()">Cerrar</button>
        </section>
      }
    </div>
  `,
  styles: [`
    .filter-wrap { position: relative; }
    .filter-trigger { padding: 11px 15px; color: #3730a3; background: transparent; }
    .author-popover { position: absolute; top: calc(100% + 10px); left: 0; width: 280px; padding: 16px; color: #f8fafc; background: rgba(15, 23, 42, .94); border: 1px solid rgba(255, 255, 255, .1); border-radius: 15px; box-shadow: 0 18px 38px rgba(0, 0, 0, .36); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
    .popover-heading { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
    .popover-heading div { display: grid; gap: 3px; }
    .popover-heading span, .muted { color: #94a3b8; font-size: 12px; }
    .text-button { color: #f8fafc; background: transparent; font-size: 12px; font-weight: 700; text-shadow: 0 1px 2px rgba(0, 0, 0, .4); }
    .close-button { width: 100%; margin-top: 8px; padding: 8px; color: #f8fafc; background: rgba(255, 255, 255, .04); border: 1px solid rgba(255, 255, 255, .18); text-shadow: 0 1px 2px rgba(0, 0, 0, .4); }
    .author-option { display: flex; gap: 9px; align-items: center; justify-content: space-between; padding: 9px 5px; color: #f8fafc; border-radius: 8px; text-shadow: 0 1px 2px rgba(0, 0, 0, .4); }
    .author-option label { display: flex; flex: 1; gap: 9px; align-items: center; cursor: pointer; }
    .author-option:hover { background: rgba(255, 255, 255, .08); }
    .section-divider { height: 1px; margin: 10px 0; background: rgba(255, 255, 255, .1); }
    .section-label { margin: 6px 5px 2px; color: #c4b5fd; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    @media (max-width: 760px) { .author-popover { position: fixed; top: auto; right: 12px; bottom: 12px; left: 12px; width: auto; } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorFilter {
  readonly authors = input.required<Autor[]>();
  readonly categories = input.required<Genero[]>();
  readonly selected = input.required<string[]>();
  readonly selectedCategories = input.required<string[]>();
  readonly open = input(false);
  readonly toggle = output<void>();
  readonly apply = output<void>();
  readonly clear = output<void>();
  readonly clearCategories = output<void>();
  readonly clearAll = output<void>();
  readonly authorSelected = output<string>();
  readonly categorySelected = output<string>();
  readonly close = output<void>();
  readonly deleteAuthorRequested = output<Autor>();
  readonly deleteCategoryRequested = output<Genero>();

  authorId(author: Autor): string {
    return idAsString(author._id);
  }

  categoryId(category: Genero): string {
    return idAsString(category._id);
  }

  toggleAuthor(authorId: string): void {
    this.authorSelected.emit(authorId);
  }
}
