import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface EntityFormValue {
  name: string;
  extra?: string;
}

@Component({
  selector: 'app-entity-form',
  standalone: true,
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
  styles: [`
    form { display: grid; gap: 8px; }
    label { color: #475569; font-size: 13px; font-weight: 600; }
    input, textarea { box-sizing: border-box; width: 100%; padding: 10px; color: #334155; background: #ffffff9e; border: 1px solid #cbd5e180; border-radius: 8px; font: inherit; box-shadow: inset 1px 1px 3px #64748b14; }
    input:focus, textarea:focus { border-color: #818cf8; outline: 0; box-shadow: 0 0 0 4px #818cf833; }
    small, .error { color: #b42318; font-size: 12px; }
    form button { margin-top: 8px; padding: 11px; color: #fff; background: linear-gradient(135deg, #4f46e5, #7c3aed); border: 0; border-radius: 9px; cursor: pointer; }
  `],
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
