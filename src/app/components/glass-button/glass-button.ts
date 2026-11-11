import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-glass-button',
  template: `
    <div class="button-wrap" [style.--w]="width()" [style.--h]="height()" [style.--r]="radius()" [style.--tr]="highlight()">
      <button type="button" [disabled]="disabled()" [attr.aria-label]="label()" [attr.aria-expanded]="ariaExpanded()" [attr.aria-haspopup]="hasPopup() ? 'dialog' : null" (click)="clicked.emit()">
        <span>{{ label() }}</span>
      </button>
      <div class="button-shadow" aria-hidden="true"></div>
    </div>
  `,
  styles: [`
    @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
    @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
    :host { display: inline-block; }
    .button-wrap { --border-width: 1px; --anim-hover-time: 400ms; --anim-hover-ease: cubic-bezier(.25, 1, .5, 1); position: relative; z-index: 2; border-radius: 999vw; background: transparent; pointer-events: none; transition: all var(--anim-hover-time) var(--anim-hover-ease); }
    .button-shadow { --shadow-cutoff-fix: 2em; position: absolute; width: calc(100% + var(--shadow-cutoff-fix)); height: calc(100% + var(--shadow-cutoff-fix)); top: calc(0% - var(--shadow-cutoff-fix) / 2); left: calc(0% - var(--shadow-cutoff-fix) / 2); filter: blur(clamp(2px, .125em, 12px)); pointer-events: none; }
    .button-shadow::after { content: ""; position: absolute; z-index: 0; inset: 0; border-radius: 999vw; background: linear-gradient(180deg, #0003, #0001); width: calc(100% - var(--shadow-cutoff-fix) - .25em); height: calc(100% - var(--shadow-cutoff-fix) - .25em); top: calc(var(--shadow-cutoff-fix) - .5em); left: calc(var(--shadow-cutoff-fix) - .875em); padding: .125em; box-sizing: border-box; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-hover-time) var(--anim-hover-ease); }
    button { all: unset; box-sizing: border-box; min-width: var(--w); min-height: var(--h); cursor: pointer; position: relative; z-index: 3; pointer-events: auto; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 999vw; background: linear-gradient(-75deg, #ffffff0d, #ffffff33, #ffffff0d); box-shadow: inset 0 .125em .125em #0000000d, inset 0 -.125em .125em #ffffff80, 0 .25em .125em -.125em #0003, 0 0 .1em .25em inset #ffffff33; backdrop-filter: blur(clamp(1px, .125em, 4px)); transition: all var(--anim-hover-time) var(--anim-hover-ease); }
    button:hover { transform: scale(.975); }
    button:active { transform: scale(.94); }
    button:focus-visible { outline: 3px solid #818cf8; outline-offset: 4px; }
    button:disabled { cursor: wait; opacity: .6; }
    button span { position: relative; display: block; padding: .75em 1.35em; user-select: none; color: #ffffff; font: 700 14px Inter, system-ui, sans-serif; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4); }
    button span::after { content: ""; display: block; position: absolute; inset: calc(var(--border-width) / 2); border-radius: 999vw; background: linear-gradient(var(--angle-2), transparent 0%, #ffffff80 40% 50%, transparent 55%); z-index: 3; mix-blend-mode: screen; pointer-events: none; background-size: 200% 200%; transition: background-position calc(var(--anim-hover-time) * 1.25) var(--anim-hover-ease), --angle-2 calc(var(--anim-hover-time) * 1.25) var(--anim-hover-ease); }
    button:hover span::after { background-position: 25% 50%; }
    button:active span::after { background-position: 50% 15%; --angle-2: -15deg; }
    button::after { content: ""; position: absolute; z-index: 1; inset: calc(0% - var(--border-width) / 2); border-radius: 999vw; padding: var(--border-width); box-sizing: border-box; background: conic-gradient(from var(--angle-1) at 50% 50%, #00000080, transparent 5% 40%, #00000080 50%, transparent 60% 95%, #00000080), linear-gradient(180deg, #ffffff80, #ffffff80); mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-hover-time) var(--anim-hover-ease), --angle-1 500ms ease; pointer-events: none; }
    button:hover::after { --angle-1: -125deg; }
    button:active::after { --angle-1: -75deg; }
    .button-wrap:has(button:hover) .button-shadow::after { top: calc(var(--shadow-cutoff-fix) - .875em); opacity: 1; }
    .button-wrap:has(button:active) { transform: rotate3d(1, 0, 0, 25deg); }
    @media (max-width: 760px) { :host { display: block; } button { width: 100%; } }
  `],
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
