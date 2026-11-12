import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DialogService } from '../core/ui/dialog.service';
import { ConfirmService } from '../core/ui/confirm.service';
import { GlassButton } from '../components/glass-button/glass-button';
import { Toast } from '../shared/ui/toast';
import { ConfirmDialog } from '../shared/ui/confirm-dialog';
import { BookDialog } from '../features/books/components/book-dialog';
import { AuthorDialog } from '../features/authors/components/author-dialog';
import { GenreDialog } from '../features/genres/components/genre-dialog';
import { LoanDialog } from '../features/loans/components/loan-dialog';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, GlassButton, Toast, ConfirmDialog, BookDialog, AuthorDialog, GenreDialog, LoanDialog],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
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
