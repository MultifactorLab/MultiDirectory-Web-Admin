import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, Subject, defaultIfEmpty, iif, of, tap } from "rxjs";
import { WhoamiResponse } from "../models/whoami/whoami-response";
import { MultidirectoryApiService } from "./multidirectory-api.service";
import { LdapEntity } from "../core/ldap/ldap-entity";
import { TranslocoService } from "@ngneat/transloco";

@Injectable({
    providedIn: "root"
})
export class AppSettingsService {
    constructor(private api: MultidirectoryApiService, private translocoService: TranslocoService) {}
    navigationalPanelVisibleRx = new BehaviorSubject<boolean>(true)
    setNavigationalPanelVisiblity(state: boolean) {
        this.navigationalPanelVisibleRx.next(state);
    }
    userEntry?: LdapEntity;
    private _user: WhoamiResponse = new WhoamiResponse({});
    get user(): WhoamiResponse {
        return this._user;
    }
    set user(user: WhoamiResponse) {
        this._user = user;
    } 
    get userRx(): Observable<WhoamiResponse> {
        return iif(
            () => this._user.id == 0, 
            this.api.whoami().pipe(tap(x => { this.user = x })),
            of(this._user));
    }


    private _language: string = localStorage.getItem('locale') ?? 'en-US';
    get language(): string {
        return this._language;
    }
    set language(lang: string) {
        this._language = lang;
        localStorage.setItem('locale', lang);
        this.translocoService.setActiveLang(lang);
    }

    private _languageRx = new Subject<string>();
    get languageRx(): Observable<string> {
        return this._languageRx.asObservable();
    }
}