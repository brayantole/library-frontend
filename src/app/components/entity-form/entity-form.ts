import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface EntityFormValue {
  name: string;
  extra?: string;
  birthYear?: number;
}
export interface EntityFormInitialValue extends EntityFormValue {}

@Component({
  selector: 'app-entity-form',
  imports: [ReactiveFormsModule],
  templateUrl: './entity-form.html',
  styleUrl: './entity-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityForm {
  readonly nameLabel = input.required<string>();
  readonly extraLabel = input.required<string>();
  readonly nameId = input.required<string>();
  readonly extraId = input.required<string>();
  readonly extraRequired = input(false);
  readonly showBirthYear = input(false);
  readonly submitLabel = input('Guardar');
  readonly saving = input(false);
  readonly errorMessage = input('');
  readonly submitted = output<EntityFormValue>();
  readonly initialValue = input<EntityFormInitialValue | null>(null);

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)] }),
    extra: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    birthYear: new FormControl<number | null>(null, [Validators.min(1), Validators.max(new Date().getFullYear())]),
  });

  constructor() {
    effect(() => {
      const value = this.initialValue();
      if (value) {
        this.form.patchValue({ name: value.name, extra: value.extra ?? '', birthYear: value.birthYear ?? null });
        if (this.showBirthYear() && value.birthYear !== undefined) {
          this.form.controls.birthYear.addValidators(Validators.required);
          this.form.controls.birthYear.updateValueAndValidity();
        }
      }
    });
  }

  submit(): void {
    if (this.form.invalid || (this.extraRequired() && !this.form.controls.extra.value.trim())) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitted.emit({
      name: value.name.trim(),
      extra: value.extra.trim() || undefined,
      ...(value.birthYear === null ? {} : { birthYear: value.birthYear }),
    });
  }
}
