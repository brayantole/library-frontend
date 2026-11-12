import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-glass-button',
  templateUrl: './glass-button.html',
  styleUrl: './glass-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlassButton {
  readonly label = input.required<string>();
  readonly width = input('180px');
  readonly height = input('48px');
  readonly radius = input('999vw');
  readonly highlight = input('15%');
  readonly disabled = input(false);
  readonly ariaExpanded = input<boolean | undefined>(undefined);
  readonly hasPopup = input(false);
  readonly clicked = output<void>();
}
