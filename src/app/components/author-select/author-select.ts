import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Autor } from '../../models/library';
import { idAsString } from '../../services/api-utils';

@Component({
  selector: 'app-author-select',
  standalone: true,
  template: `
    <label [for]="id()">{{ label() }}</label>
    <select [id]="id()" [value]="value()" (change)="onSelectionChange($event)">
      <option value="">Selecciona un autor</option>
      @for (author of authors(); track author._id) {
        <option [value]="authorId(author)">{{ author.name }}</option>
      }
    </select>
  `,
  styles: [`
    :host { display: grid; gap: 7px; }
    label { color: #475569; font-size: 13px; font-weight: 600; }
    select { box-sizing: border-box; width: 100%; padding: 10px; color: #334155; background: #ffffff9e; border: 1px solid #cbd5e180; border-radius: 8px; font: inherit; }
    select:focus { border-color: #818cf8; outline: 0; box-shadow: 0 0 0 4px #818cf833; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorSelect {
  readonly authors = input.required<Autor[]>();
  readonly value = input('');
  readonly label = input('Autor');
  readonly id = input('author-select');
  readonly selected = output<string>();

  onSelectionChange(event: Event): void {
    this.selected.emit((event.target as HTMLSelectElement).value);
  }

  authorId(author: Autor): string {
    return idAsString(author._id);
  }
}
