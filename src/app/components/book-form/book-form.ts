import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Author } from '../../features/authors/models/author';
import { CreateBookDto } from '../../features/books/models/book';
import { Genre } from '../../features/genres/models/genre';

interface BookFormControls {
  title: FormControl<string>;
  isbn: FormControl<string>;
  authorId: FormControl<string>;
  genreIds: FormControl<string[]>;
  year: FormControl<number | null>;
}

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
  styles: [`
    form { display: grid; gap: 8px; }
    input, select { box-sizing: border-box; width: 100%; padding: 10px; color: #334155; background: #ffffff9e; border: 1px solid #cbd5e180; border-radius: 8px; font: inherit; box-shadow: inset 1px 1px 3px #64748b14; }
    select[multiple] { min-height: 92px; }
    input:focus, select:focus { border-color: #818cf8; outline: 0; box-shadow: 0 0 0 4px #818cf833, inset 1px 1px 3px #64748b14; }
    small, .error { color: #b42318; font-size: 12px; }
    form > button { margin-top: 8px; padding: 11px; color: #fff; background: linear-gradient(135deg, #4f46e5, #7c3aed); border: 0; border-radius: 9px; cursor: pointer; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookForm {
  readonly authors = input.required<Author[]>();
  readonly genres = input.required<Genre[]>();
  readonly saving = input(false);
  readonly errorMessage = input('');
  readonly submitted = output<CreateBookDto>();

  readonly form = new FormGroup<BookFormControls>({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    isbn: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    authorId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    genreIds: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
    year: new FormControl<number | null>(null, [Validators.min(0), Validators.max(new Date().getFullYear())]),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitted.emit({
      title: value.title.trim(),
      isbn: value.isbn.trim(),
      authorId: value.authorId,
      genreIds: value.genreIds,
      ...(value.year === null ? {} : { year: value.year }),
    });
  }

  isInvalid(controlName: keyof BookFormControls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && control.touched;
  }

}
