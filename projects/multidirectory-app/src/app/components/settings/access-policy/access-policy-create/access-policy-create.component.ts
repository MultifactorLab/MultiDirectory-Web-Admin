import { Component, EventEmitter, Query, ViewChild } from "@angular/core";
import { Observable, take } from "rxjs";
import { MdModalComponent, MdFormComponent, DropdownOption, MultiselectComponent } from "multidirectory-ui-kit";
import { MfaAccessEnum } from "projects/multidirectory-app/src/app/core/access-policy/mfa-access-enum";
import { AttributeListComponent } from "../../../ldap-browser/editors/attributes-list/attributes-list.component";
import { AccessPolicy } from "projects/multidirectory-app/src/app/core/access-policy/access-policy";
import { GroupSelectorComponent } from "../../../forms/group-selector/group-selector.component";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { SearchQueries } from "projects/multidirectory-app/src/app/core/ldap/search";
import { MultiselectModel } from "projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model";
import { Constants } from "projects/multidirectory-app/src/app/core/constants";
import { IpRange } from "projects/multidirectory-app/src/app/core/access-policy/access-policy-ip-address";
import { AccessPolicyIpListComponent } from "../access-policy-ip-list/access-policy-ip-list.component";

@Component({
    selector: 'app-access-policy-create',
    templateUrl: './access-policy-create.component.html',
    styleUrls: ['./access-policy-create.component.scss']
})
export class AccessPolicyCreateComponent {
    @ViewChild('accessControlCreateModal') modal!: MdModalComponent;
    @ViewChild('ipListEditor', { static: true }) ipListEditor: AccessPolicyIpListComponent | null = null;
    @ViewChild('form', { static: true }) form: MdFormComponent | null = null;
    @ViewChild('groupSelector', {static: true}) groupSelector!: MultiselectComponent;
    accessClient = new AccessPolicy();
    ipAddresses = '';
    mfaAccess = MfaAccessEnum.SelectedGroups;
    options: DropdownOption[] = [ 
        { title: 'Всем', value: MfaAccessEnum.Everyone },
        { title: 'Никому', value: MfaAccessEnum.Noone },
        { title: 'Выбранным группам', value: MfaAccessEnum.SelectedGroups }
    ];
    groupQuery = '';
    availableGroups: MultiselectModel[] = [];
    constructor(private api: MultidirectoryApiService) {}
    onSave = new EventEmitter<AccessPolicy | null>();

    open(client: AccessPolicy): Observable<AccessPolicy | null> {
        this.accessClient = client;
        this.modal.open();
        this.ipAddresses = this.accessClient.ipRange.join(', ');
        this.mfaAccess = MfaAccessEnum.Everyone;
        this.availableGroups = this.accessClient.groups.map(x => new MultiselectModel({
            selected: true,
            id: x,
            title: x,
            badge_title: new RegExp(Constants.RegexGetNameFromDn).exec(x)?.[1] ?? x
        }));
        return this.onSave.asObservable();
    }

    close() {
        this.form?.inputs.forEach(x => x.reset());
        this.groupQuery = '';
        this.availableGroups = [];
        this.onSave.emit(null);
        this.modal.close();
    }

    save() {
        this.accessClient.groups = this.groupSelector.selectedData.map(x => x.title);
        this.onSave.emit(this.accessClient);
        this.modal.close();
        this.form?.inputs.forEach(x => x.reset());
    }

    changeIpAdressAttribute( ) {
        const ipAddresses = this.accessClient.ipRange.map(x => x instanceof IpRange ? `${x.start}-${x.end}` : x);
        const closeRx = this.ipListEditor!.open(ipAddresses);
        closeRx.pipe(take(1)).subscribe(result => {
            if(!result) {
                return;
            }
           /* const resultAddress = result.map(x => {
                if(x.includes('-')) {
                    const parts =  x.split('-');
                    return new IpRange({
                        start: parts[0],
                        end: parts[1]
                    });
                }
                return x;
            });
            this.accessClient.ipRange = resultAddress;
            this.ipAddresses = result.join(', ');*/
        });
    }

    onIpChanged() {
        this.accessClient.ipRange = this.ipAddresses.split(',').map(x => {
            if(x.includes('-')) {
                const parts = x.split('-');
                return new IpRange({
                    start: parts[0],
                    end: parts[1]
                });
            }
            return x.trim()
        });
    }

    checkGroups() {
        this.api.search(SearchQueries.findGroup(this.groupQuery, '', [])).subscribe(result => {
            this.availableGroups = result.search_result.map(x => {
                const name = new RegExp(Constants.RegexGetNameFromDn).exec(x.object_name);
                return new MultiselectModel({
                    id: x.object_name,
                    selected: false,
                    title: x.object_name,
                    badge_title: name?.[1] ?? x.object_name
                });
            });
            this.groupSelector.showMenu();
        })
    }
}