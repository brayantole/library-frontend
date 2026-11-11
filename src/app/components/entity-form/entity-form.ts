import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface EntityFormValue {
  name: string;
  extra?: string;
}

@Component({
  selector: 'app-entity-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <label [for]="nameId()">{{ nameLabel() }}</label>
      <input [id]="nameId()" type="text" formControlName="name" />
      @if (form.controls.name.invalid && form.controls.name.touched) {
        <small>{{ nameLabel() }} es obligatorio y debe tener entre 2 y 120 caracteres.</small>
      }
      <label [for]="extraId()">{{ extraLabel() }} (opcional)</label>
      <textarea [id]="extraId()" formControlName="extra" rows="3"></textarea>
      @if (extraRequired() && form.controls.extra.touched && !form.controls.extra.value.trim()) {
        <small>{{ extraLabel() }} es obligatorio.</small>
      }
      @if (errorMessage()) { <p class="error" role="alert">{{ errorMessage() }}</p> }
      <button type="submit" [disabled]="saving()">{{ saving() ? 'Guardando...' : submitLabel() }}</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityForm {
  readonly nameLabel = input.required<string>();
  readonly extraLabel = input.required<string>();
  readonly nameId = input.required<string>();
  readonly extraId = input.required<string>();
  readonly extraRequired = input(false);
  readonly submitLabel = input('Guardar');
  readonly saving = input(false);
  readonly errorMessage = input('');
  readonly submitted = output<EntityFormValue>();

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120)] }),
    extra: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
  });

  submit(): void {
    if (this.form.invalid || (this.extraRequired() && !this.form.controls.extra.value.trim())) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitted.emit({ name: value.name.trim(), extra: value.extra.trim() || undefined });
  }
}
