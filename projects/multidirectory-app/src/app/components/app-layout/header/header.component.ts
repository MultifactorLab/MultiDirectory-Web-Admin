import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import { LdapEntryNode } from "../../../core/ldap/ldap-entity";
import { AppSettingsService } from "../../../services/app-settings.service";
import { ContentViewService } from "../../../services/content-view.service";
import { MenuService } from "../../../services/menu.service";
import { WhoamiResponse } from "../../../models/whoami/whoami-response";
import { AppWindowsService } from "../../../services/app-windows.service";
import { translate } from "@ngneat/transloco";
import { Router } from "@angular/router";
import { ViewMode } from "../../../features/ldap-browser/catalog-content/view-modes";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
    @Output() helpMenuClick = new EventEmitter<MouseEvent>();
    @Output() accountSettingsClicked = new EventEmitter<void>();
    @Output() logoutClick = new EventEmitter<void>();

    @ViewChild('searchBtn', { read: ElementRef }) searchBtn?: ElementRef; 
    unsubscribe = new Subject<boolean>();
    navigationalPanelInvisible = false;

    ViewMode = ViewMode;
    get contentView(): ViewMode {
        return this.contentViewService.contentView;
    }
    set contentView(view: ViewMode) {
        this.contentViewService.contentView = view;
    }

    get user(): WhoamiResponse | undefined {
        return this.app.user;
    }

    // TODO: TOO MUCH SERVICES
    constructor(
        private app: AppSettingsService,
        private contentViewService: ContentViewService,
        private hotkeysService: HotkeysService,
        private ldapWindows: AppWindowsService,
        private menu: MenuService,
        private cdr: ChangeDetectorRef,
        private router: Router) 
    {
        this.hotkeysService.add(new Hotkey('ctrl+h', (event: KeyboardEvent): boolean => {
            this.onChange(!this.navigationalPanelInvisible);
            return false; // Prevent bubbling
        }, undefined, translate('hotkeys.toggle-navbar')));
        this.hotkeysService.add(new Hotkey('esc', (event: KeyboardEvent): boolean => {
            this.router.navigate(['/']);
            return false; // Prevent bubbling
        }, undefined, translate('hotkeys.toggle-small-icon-view')));
        this.hotkeysService.add(new Hotkey('f1', (event: KeyboardEvent): boolean => {
            this.contentView = ViewMode.SmallIcons;
            return false; // Prevent bubbling
        }, undefined, translate('hotkeys.toggle-small-icon-view')));
        this.hotkeysService.add(new Hotkey('f2', (event: KeyboardEvent): boolean => {
            this.contentView = ViewMode.BigIcons;
            return false; // Prevent bubbling
        }, undefined, translate('hotkeys.toggle-big-icon-view')));
        this.hotkeysService.add(new Hotkey('f3', (event: KeyboardEvent): boolean => {
            this.contentView = ViewMode.Table;
            return false; // Prevent bubbling
        }, undefined, translate('hotkeys.toggle-list-view')));
        this.hotkeysService.add(new Hotkey('f4', (event: KeyboardEvent): boolean => {
            this.contentView = ViewMode.Details;
            return false; // Prevent bubbling
        }, undefined, translate('hotkeys.toggle-detail-view'))); 
        this.hotkeysService.add(new Hotkey('ctrl+f', (event: KeyboardEvent): boolean => {
            this.searchBtn?.nativeElement.click();
            return false;
        }, undefined, translate('hotkeys.toggle-search-menu')));
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    onChange(value: boolean) {
        this.navigationalPanelInvisible = value;
        this.app.setNavigationalPanelVisiblity(!this.navigationalPanelInvisible);
        window.dispatchEvent(new Event('resize'));
    }
    showHelp() {
        this.hotkeysService.cheatSheetToggle.next(true);
    }
    closeCatalog() {
        this.router.navigate(['/'])
        this.cdr.detectChanges();
    }
    openAccessControl() {
        this.menu.showAccessControlMenu();
    }
    onAccountSettingsClick() {
        if(!this.app.userEntry) {
            return;
        }
        this.ldapWindows.openEntityProperiesModal(this.app.userEntry);
    }


    onChangePasswordClick() {
        if(!this.app.userEntry) {
            return;
        }
        this.ldapWindows.openChangePasswordModal(this.app.userEntry);
    }

    onLogout() {
        this.logoutClick.next();
    }
}