import { AfterViewInit, ContentChildren, Directive, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";
import { BaseComponent } from "../components/base-component/base.component";

@Directive({
    selector: '[appAutofocus]',
    providers: [{
        provide: AutofocusDirective,
        useExisting: forwardRef(() => AutofocusDirective)
    }]
}) export class AutofocusDirective implements AfterViewInit {
    constructor(@Inject(NG_VALUE_ACCESSOR) private accessor: BaseComponent[]) {
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.accessor?.[0]?.focus(), 5);
    }
}