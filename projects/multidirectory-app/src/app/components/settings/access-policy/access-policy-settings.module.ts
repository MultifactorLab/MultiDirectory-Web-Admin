import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { ValidatorsModule } from "../../forms/validators/validators.module";
import { EditorsModule } from "../../ldap-browser/editors/editors.module";
import { AccessPolicyCreateComponent } from "./access-policy-create/access-policy-create.component";
import { AccessPolicySettingsComponent } from "./access-policy-settings.component";
import { AccessPolicyComponent } from "./access-policy/access-policy.component";
import { GroupSelectorModule } from "../../forms/group-selector/group-selector.module";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
    declarations: [ 
        AccessPolicySettingsComponent,
        AccessPolicyComponent,
        AccessPolicyCreateComponent,
    ],
    exports: [
        AccessPolicySettingsComponent,
        AccessPolicyComponent,
        AccessPolicyCreateComponent,
    ],
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule,
        ValidatorsModule,
        EditorsModule,
        GroupSelectorModule,
        DragDropModule
    ]
})
export class AccessPolicyModule {

}