import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDropDown]'
})

export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event): void {
    this.isOpen = this.elementRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  constructor(private elementRef: ElementRef) {
  }
}
