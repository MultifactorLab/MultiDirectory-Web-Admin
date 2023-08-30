import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";

@Component({
    selector: 'app-user-properties',
    styleUrls: ['./user-properties.component.scss'],
    templateUrl: 'user-properties.component.html'
})
export class UserPropertiesComponent implements OnInit, OnDestroy {
    unsubscribe = new Subject<boolean>();
    @Output() dataLoad = new EventEmitter();
     
    properties?: any[];
    propColumns = [
        { name: 'Имя', prop: 'name', flexGrow: 1 },
        { name: 'Значение', prop: 'val', flexGrow: 1 },
    ];    

    constructor(
        private api: MultidirectoryApiService,
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    onTabChanged(tab: any) {
        console.log('test');
        this.cdr.detectChanges();
    }

    onDataLoad() {
        this.dataLoad.emit();
    }
   
}