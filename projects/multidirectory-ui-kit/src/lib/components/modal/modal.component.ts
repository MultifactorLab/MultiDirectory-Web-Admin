import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild, forwardRef } from "@angular/core";
import { ModalComponent } from "ng-modal-full-resizable";
import { Observable, Subject, takeUntil } from "rxjs";
import { SpinnerHostDirective } from "../spinner/spinner-host.directive";
import { ModalService } from "./modal.service";
import { IdProvider } from "../../utils/id-provider";

@Component({
    selector: 'md-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: ModalService,
        useClass: ModalService,
        multi: false
    }]
})
export class MdModalComponent implements AfterViewInit, OnDestroy {
    __ID = IdProvider.getUniqueId('modal');

    @ViewChild('modalRoot', { static: true }) modalRoot?: ModalComponent;
    @ViewChild(SpinnerHostDirective, { static: true }) spinnerHost?: SpinnerHostDirective;
    @Input() opened = false;
    @Input() backdrop = true;
    @Input() minHeight = 0;
    @Input() width: string = '';
    @Input() zIndex?: number;
    unsubscribe = new Subject<void>();
    
    constructor(
        private cdr: ChangeDetectorRef,
        private renderer: Renderer2,
        private modal: ModalService) {
        this.modal.resizeRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(() => this.resize());
    }

    resize() {
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    open(): Observable<boolean> | null {
        this.modalRoot?.show();
        this.cdr.detectChanges();
        return this.modalRoot?.openModal.asObservable() ?? null;
    }

    onModalOpen() {
        if(this.width) {
            this.renderer.setStyle(this.modalRoot?.modalRoot.nativeElement, 'width', this.width);
        }
        this.modalRoot?.center();
        this.modalRoot?.moveOnTop();
        this.cdr.detectChanges();
    }

    onModalClose() {
        this.cdr.detectChanges();
    }

    center() {
        this.modalRoot?.center();
    }

    close() {   
        this.modalRoot?.hide();
        this.cdr.detectChanges();
    }

    showSpinner() {
        this.spinnerHost?.show();
    }

    hideSpinner() {
        this.spinnerHost?.hide();
    }
    
    ngAfterViewInit(): void {
        if(this.opened) {
            this.open();
            this.modalRoot?.calcBodyHeight();
            this.modalRoot?.center();
            this.renderer.setStyle(this.modalRoot?.modalBody.nativeElement, 'display', 'flex');
            this.cdr.detectChanges();
        }
        this.modalRoot?.closeModal.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.cdr.detectChanges();
        });
    }
}