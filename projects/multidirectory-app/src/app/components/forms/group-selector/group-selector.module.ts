import { NgModule } from "@angular/core";
import { GroupSelectorComponent } from "./group-selector.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { ValidatorsModule } from "../validators/validators.module";
import { EntityTypeSelectorModule } from "../entity-type-selector/entity-type-selector.module";
import { CatalogSelectorModule } from "../catalog-selector/catalog-selector.module";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
    declarations: [GroupSelectorComponent],
    exports: [GroupSelectorComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MultidirectoryUiKitModule,
        ValidatorsModule,
        EntityTypeSelectorModule,
        CatalogSelectorModule,
        TranslocoModule
    ]
})
export class GroupSelectorModule {}