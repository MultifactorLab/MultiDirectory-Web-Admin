import { Component, Input, ViewChild, forwardRef } from "@angular/core";
import { LdapNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";
import { UserCreateRequest } from "projects/multidirectory-app/src/app/models/user-create/user-create.request";
import { UserCreateService } from "projects/multidirectory-app/src/app/services/user-create.service";
import { MdFormComponent } from "projects/multidirectory-ui-kit/src/lib/components/form/form.component";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-user-create-password-settings',
    styleUrls: ['./password-settings.component.scss'],
    templateUrl: './password-settings.component.html',
})
export class UserCreatePasswordSettingsComponent {
    @Input() selectedNode?: LdapNode; 
    private _setupRequest!: UserCreateRequest;
    @Input() set setupRequest(request: UserCreateRequest) {
        this._setupRequest = request;
        this.form?.inputs.forEach(x => x.reset());
    }
    get setupRequest(): UserCreateRequest {
        return this._setupRequest;
    }

    @ViewChild('form') form!: MdFormComponent;

    unsubscribe = new Subject<void>();
    constructor(public setup: UserCreateService) {}
    ngAfterViewInit(): void {
        this.setup.stepValid(this.form.valid)
        this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe(x => {
            this.setup.stepValid(this.form.valid);
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    } 

}