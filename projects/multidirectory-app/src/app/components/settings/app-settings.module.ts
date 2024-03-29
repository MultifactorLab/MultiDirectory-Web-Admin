import { NgModule } from "@angular/core";
import { AppSettingsComponent } from "./app-settings.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ValidatorsModule } from "../forms/validators/validators.module";
import { RouterModule } from "@angular/router";
import { AppSettingsNavigationComponent } from "./navigation/app-settings-navigation.component";
import { MultifactorSettingsComponent } from "./mulifactor-settings/multifactor-settings.component";
import { AppSettingsRoutingModule } from "./app-settings-routes.module";
import { AppSettingsHeaderComponent } from "./header/app-settings-header.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MultidirectorySettingsComponent } from "./multidirectory-settings/multidirectory-settings.component";
import { TranslocoRootModule } from "../../transloco-root.module";
import { MfAdminIntegrationComponent } from "./mulifactor-settings/admin-integration/mf-admin-integration.component";
import { MfUserIntegrationComponent } from "./mulifactor-settings/user-integration/mf-user-integration.component";
import { AccessPolicyModule } from "./access-policy/access-policy-settings.module";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ValidatorsModule,
        RouterModule,
        AppSettingsRoutingModule,
        DragDropModule,
        TranslocoRootModule,
        MultidirectoryUiKitModule,
        AccessPolicyModule,
    ],
    declarations: [
        AppSettingsComponent,
        AppSettingsNavigationComponent,
        AppSettingsHeaderComponent,
        MultifactorSettingsComponent,
        MultidirectorySettingsComponent,
        MfAdminIntegrationComponent,
        MfUserIntegrationComponent
    ],
    exports: [
        AppSettingsComponent,
        AppSettingsNavigationComponent,
        MultifactorSettingsComponent,
        AppSettingsRoutingModule,
        AppSettingsHeaderComponent,
        MultidirectorySettingsComponent
    ]
})
export class AppSettingsModule {

}