import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MdModalComponent, StepperComponent } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { EMPTY, Subject, catchError, takeUntil } from "rxjs";
import { SetupRequest } from "../../models/setup/setup-request";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { SetupService } from "../../services/setup.service";
import { translate } from "@ngneat/transloco";

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit, AfterViewInit, OnDestroy {
    setupRequest = new SetupRequest();
    @ViewChild('modal') modal!: MdModalComponent;
    @ViewChild('stepper') stepper!: StepperComponent;

    stepValid = false;
    unsubscribe = new Subject<boolean>();
    constructor(
        private api: MultidirectoryApiService,
        private setup: SetupService,
        private toastr: ToastrService,
        private router: Router,
        private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.setup.onStepValid.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(valid => {
            this.stepValid = valid;
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
    
    ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    onNext(templateRef: any) {
        this.modal.modalRoot!.resizeToContentHeight();
    }

    onSetup() {
        this.modal.showSpinner();
        this.api.setup(this.setupRequest).pipe(
            catchError(err => {
                this.modal.hideSpinner();
                throw err
            })
        ).subscribe(res => {
            this.modal.hideSpinner();
            this.toastr.success(translate('setup.setup-complete'));
            this.router.navigate(['/'])
        });
    }

    resize()  {
        this.cdr.detectChanges();
        this.modal.modalRoot?.resizeToContentHeight();
        this.cdr.detectChanges();
    }


    showNextStep() {
        if(!this.stepValid) {
            this.setup.invalidate();
            this.toastr.error(translate('please-check-errors'));
            return;
        }
        this.stepper.next();
    }
}