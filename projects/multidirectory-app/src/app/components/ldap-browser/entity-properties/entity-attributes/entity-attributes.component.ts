import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChild, forwardRef } from "@angular/core";
import { translate } from "@ngneat/transloco";
import { ModalInjectDirective, ModalService, Page } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { PropertyTypeResolver } from "projects/multidirectory-app/src/app/core/ldap/property-type-resolver";
import { SearchQueries } from "projects/multidirectory-app/src/app/core/ldap/search";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { LdapPropertiesService } from "projects/multidirectory-app/src/app/services/ldap-properites.service";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { DatagridComponent } from "projects/multidirectory-ui-kit/src/public-api";
import { Subject, filter, map, of, switchMap, take, tap, zip } from "rxjs";


export class EntityAttribute { 
    constructor(public name: string, public val: string, public changed = false) {}
}

export class AttributeFilter {
    constructor(public showWithValuesOnly = true) {}
}

@Component({
    selector: 'app-entity-attributes',
    templateUrl: './entity-attributes.component.html',
    styleUrls: ['./entity-attributes.component.scss']
})
export class EntityAttributesComponent implements OnInit {
    @ViewChild('propGrid', { static: true }) propGrid: DatagridComponent | null = null;
    @ViewChild('propertyEditor', { static: true }) attributeEditor!: ModalInjectDirective;
    unsubscribe = new Subject<boolean>();
    filter = new AttributeFilter(true);
    rows: any[] = [];
    allRows: any[] = [];
    _searchFilter = '';
    set searchFilter(value: string) {
        this._searchFilter = value;
        this.page.pageNumber = 1;
        this.rows = this.filterData(this.allRows);
        this.propGrid?.resetScroll();
    }
    get searchFilter(): string {
        return this._searchFilter;
    }
    propColumns = [
        { name:  translate('entity-attributes.name'), prop: 'name', flexGrow: 1 },
        { name:  translate('entity-attributes.value'), prop: 'val', flexGrow: 2 },
    ];    
    page = new Page({ pageNumber: 1, size: 20, totalElements: 4000 })
    constructor(
        private api: MultidirectoryApiService,
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef,
        private properties: LdapPropertiesService,
        @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
        private toastr: ToastrService) {}

    ngOnInit(): void {
        this.properties.loadData().pipe(take(1)).subscribe(x => {
            this.allRows = this.filterData(x);
            this.onPageChanged(this.page);
        })
    }

    filterData(result: EntityAttribute[]) {
        if(this.filter.showWithValuesOnly) {
            result = result.filter(x => !!x.val);
        }
        if(this._searchFilter){
            const req = this._searchFilter.toLocaleLowerCase();
            result  = result.filter(x => x.name.toLocaleLowerCase().includes(req));
        }
        return result;
    }
    getPage(result: EntityAttribute[]) {
        return result.slice(0, this.page.pageOffset * this.page.size +  2 * this.page.size);
    }
        
    onEditClick(attributeName = '') {
        let attribute: EntityAttribute;
        if(!attributeName) {
            if(!this.propGrid || !this.propGrid.selected?.[0]) {
                this.toastr.error('Выберите аттрибут для редактирования');
                return;
            }
            attribute = this.propGrid.selected[0];
        } else {
            attribute = new EntityAttribute(attributeName, '');
        }
        return this.api.search(
            SearchQueries.getSchema()
        ).subscribe(x => {
            let propertyDescription = PropertyTypeResolver.getDefault();
            let types = x.search_result?.[0]?.partial_attributes.find(x => x.type == "attributeTypes")?.vals
            if(!types) {
                this.toastr.error('Не удалось получить схему');
                return;           

            } 
            const attributeDescription = types.find(y => y.includes("NAME '" + attribute.name));
            if(!attributeDescription) {
                console.log('Не удалось получить схему');
            } else {
                const extractSyntax = /SYNTAX \'([\d+.]+)\'/gi;
                const syntax = extractSyntax.exec(attributeDescription);
                if(!syntax || syntax.length < 2) {
                    this.toastr.error('Не удалось получить схему');
                    return;           
                }
                const propertyDescriptionNullable = PropertyTypeResolver.getPropertyDescription(syntax[1]);
                if(propertyDescriptionNullable) {
                    propertyDescription = propertyDescriptionNullable;
                }
            }
            this.navigation.entityAccessorRx().pipe(take(1)).subscribe(accessor => {
                if(!accessor || !propertyDescription) {
                    return;
                }
                let indx = this.rows.findIndex(x => x.name == attribute.name);
                let addNew = false;
                if(indx == -1) {
                    indx = this.rows.push(attribute) - 1;
                    this.allRows.push(attribute);
                    addNew = true;
                }
                let value: any = attribute.val;
                if(propertyDescription.isArray && !Array.isArray(value)) {
                    value = this.rows.filter(x => x.name === attribute.name).map(x => x.val);
                }
                this.attributeEditor.open({}, { propertyType: propertyDescription?.type, propertyName: attribute.name, propertyValue: value }).pipe(take(1)).subscribe(x => {
                    if(!x) {
                        return;
                    }
                    accessor[attribute.name] = x;
                    attribute.changed = true;
                    if(propertyDescription.isArray && Array.isArray(value)) {
                        this.rows = this.rows.filter(y => y.name !== attribute.name);
                        const newValues = x.map((y: string) => new EntityAttribute(attribute.name, y, true));
                        if(addNew) {
                           this.allRows = this.allRows.concat(...newValues);
                        } 
                        this.rows.splice(indx, 0, ...newValues);
                    } else {
                        if(addNew) {
                            this.allRows.push(attribute);
                        } 
                        this.rows[indx].val = accessor[attribute.name];
                    }
                   
                    this.cdr.detectChanges();
                })
            })
        });
    }

    onFilterChange() {
        this.page.pageNumber = 1;
        this.properties.loadData(this.allRows).pipe(take(1)).subscribe(x => {
            this.allRows = x;
            this.rows = this.filterData(x);
            this.propGrid?.resetScroll();
            this.onPageChanged(this.page)
            
        })
    }
    onPageChanged(event: Page) {
        this.page = event;
        const size = Math.ceil(328 / 24);
        this.page.size = Math.max(size, 0);
        this.page.totalElements = this.allRows.length;
        this.rows = this.getPage(this.filterData(this.allRows));
        this.cdr.detectChanges();
    }
}