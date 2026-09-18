import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    private el: ElementRef<HTMLInputElement>,
  ) { }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upper = input.value.toUpperCase();

    if (input.value === upper) {
      return;
    }

    const start = input.selectionStart;
    const end = input.selectionEnd;

    input.value = upper;
    this.ngControl?.control?.setValue(upper, { emitEvent: false });

    if (start !== null && end !== null) {
      input.setSelectionRange(start, end);
    }
  }
}
