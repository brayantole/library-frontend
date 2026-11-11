import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogService } from '../core/ui/dialog.service';
import { ConfirmService } from '../core/ui/confirm.service';
import { GlassButton } from '../components/glass-button/glass-button';
import { Toast } from '../shared/ui/toast';
import { ConfirmDialog } from '../shared/ui/confirm-dialog';
import { BookCreateDialog } from '../features/books/components/book-create-dialog';
import { AuthorCreateDialog } from '../features/authors/components/author-create-dialog';
import { GenreCreateDialog } from '../features/genres/components/genre-create-dialog';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, GlassButton, Toast, ConfirmDialog, BookCreateDialog, AuthorCreateDialog, GenreCreateDialog],
  templateUrl: './shell.html',
  styleUrl: '../app.scss',
  host: { '(window:keydown.escape)': 'closeTransientMenus()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  readonly dialog = inject(DialogService);
  readonly confirm = inject(ConfirmService);

  closeTransientMenus(): void {
    this.dialog.close();
    this.confirm.cancel();
  }
}
