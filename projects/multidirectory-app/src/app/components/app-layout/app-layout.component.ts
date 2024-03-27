import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, switchMap, takeUntil, tap } from "rxjs";
import { AppSettingsService } from "../../services/app-settings.service";
import { LdapEntryLoader } from "../../core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader";
import { SearchQueries } from "../../core/ldap/search";
import { LdapEntryNode } from "../../core/ldap/ldap-entity";
import { EntityInfoResolver } from "../../core/ldap/entity-info-resolver";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { HotkeysCheatsheetComponent } from "angular2-hotkeys";

@Component({
    selector: 'app-layout',
    templateUrl: './app-layout.component.html', 
    styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
    @ViewChild('helpcheatSheet') helpcheatSheet!: HotkeysCheatsheetComponent;

    showLeftPane = true;
    private unsubscribe = new Subject<void>();

    constructor(
        private app: AppSettingsService,
        private api: MultidirectoryApiService,
        private cdr: ChangeDetectorRef) {}
    ngOnInit(): void {
        this.app.navigationalPanelVisibleRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.showLeftPane = x;
        })

        this.app.userRx.pipe(
            takeUntil(this.unsubscribe),
            tap(user => {
                 this.app.user = user;
            }),
            switchMap(user => this.api.search(SearchQueries.findByName(user.display_name, undefined)))
        ).subscribe(userSearch => {
            const searchEntry =  userSearch.search_result[0];
            const displayName = LdapEntryLoader.getSingleAttribute(searchEntry, 'name');
            const objectClass =  searchEntry.partial_attributes.find(x => x.type == 'objectClass');
            const entry = new LdapEntryNode({
                name: displayName,
                type: EntityInfoResolver.getNodeType(objectClass?.vals), 
                selectable: true,
                expandable: EntityInfoResolver.isExpandable(objectClass?.vals),
                entry: searchEntry,
                id: searchEntry.object_name,
            });
            this.app.userEntry = entry;
            this.app.user!.jpegPhoto = userSearch.search_result?.[0]?.partial_attributes?.find(x => x.type == 'photoBase64')?.vals?.[0] ?? undefined;
            this.cdr.detectChanges();
        });
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    closeCheatsheet() {
        this.helpcheatSheet.toggleCheatSheet();
    }
}