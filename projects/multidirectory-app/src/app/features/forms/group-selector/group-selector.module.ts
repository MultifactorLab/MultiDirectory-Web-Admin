import { NgModule } from '@angular/core';
import { GroupSelectorComponent } from './group-selector.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { ValidatorsModule } from '@core/validators/validators.module';
import { CatalogSelectorModule } from '../catalog-selector/catalog-selector.module';
import { EntityTypeSelectorModule } from '../entity-type-selector/entity-type-selector.module';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

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
    TranslocoModule,
  ],
})
export class GroupSelectorModule {}
