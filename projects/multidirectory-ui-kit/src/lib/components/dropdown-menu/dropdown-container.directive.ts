import { AfterViewInit, Directive, ElementRef, HostListener, Input } from "@angular/core";
import { DropdownMenuComponent } from "./dropdown-menu.component";

@Directive({
    selector: '[mdDropdownContainer]'
})
export class DropdownContainerDirective {
    @Input() mdDropdownContainer!: DropdownMenuComponent;
    constructor(private el: ElementRef) {
    }
    
    @HostListener('click', ['$event']) onClick($event: Event) {
        $event.stopPropagation();
        var rectObject = this.el.nativeElement.getBoundingClientRect();

        this.mdDropdownContainer.setPosition(
            rectObject.x, 
            rectObject.y + rectObject.height);

        this.mdDropdownContainer.toggle();
    }
}