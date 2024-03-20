import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { TextboxComponent } from './components/textbox/textbox.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NumberComponent } from './components/number/number.component';
import { ModalModule } from 'ng-modal-full-resizable';
import { MdModalComponent } from './components/modal/modal.component';
import { TreeviewComponent } from './components/treeview/treeview.component';
import { ModalTestComponent } from './components/modal/modaltest.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { PlaneButtonComponent } from './components/plane-button/plane-button.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatagridComponent, Page } from './components/datagrid/datagrid.component';
import { DropdownContainerDirective } from './components/dropdown-menu/dropdown-container.directive';
import { ShiftCheckboxComponent } from './components/shift-checkbox/shift-checkbox.component';
import { RadiobuttonComponent } from './components/radiobutton/radiobutton.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { StepDirective } from './components/stepper/step.directive';
import { FormTestComponent } from './components/form/formtest.component';
import { MdFormComponent } from './components/form/form.component';
import { ErrorLabelComponent } from './components/base-component/error-label/error-label.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ModalInjectDirective } from './components/modal/modal-inject.directive';
import { RadioGroupComponent } from './components/radiobutton-group/radio-group.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerHostDirective } from './components/spinner/spinner-host.directive';
import { TreeItemComponent } from './components/treeview/tree-item.component';
import { PagerComponent } from './components/pager/pager.component';
import { TabPaneComponent } from './components/tab-pane/tab-pane.component';
import { TabComponent } from './components/tab-pane/tab/tab.component';
import { TabDirective } from './components/tab-pane/tab.directive';
import { TextareaComponent } from './components/textarea/textarea.component';
import { GroupComponent } from './components/group/group.component';
import { MultiselectBadgeComponent } from './components/multiselect/multiselect-badge/multiselect-badge.component';
import { MultiselectComponent } from './components/multiselect/multiselect.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { AlertComponent } from './components/alert/alert.component';
import { AutofocusDirective } from './directives/autofocus.directive';

@NgModule({
  declarations: [
    ButtonComponent,
    TextboxComponent,
    TextareaComponent,
    DropdownComponent,
    NumberComponent,
    MdModalComponent,
    ModalTestComponent,
    TreeviewComponent,
    TreeItemComponent,
    DropdownMenuComponent,
    PlaneButtonComponent,
    DatagridComponent,
    DropdownContainerDirective,
    ShiftCheckboxComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    StepperComponent,
    StepDirective,
    MdFormComponent,
    FormTestComponent,
    ErrorLabelComponent,
    ModalInjectDirective,
    RadioGroupComponent,
    SpinnerComponent,
    SpinnerHostDirective,
    PagerComponent,
    TabPaneComponent,
    TabComponent,
    TabDirective,
    GroupComponent,
    MultiselectBadgeComponent,
    MultiselectComponent,
    TooltipComponent,
    DatepickerComponent,
    AlertComponent,
    AutofocusDirective
  ],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule, 
    NgxDatatableModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    DpDatePickerModule
  ],
  exports: [
    ButtonComponent,
    TextboxComponent,
    TextareaComponent,
    DropdownComponent,
    NumberComponent,
    MdModalComponent,
    ModalInjectDirective,
    TreeviewComponent,
    DropdownMenuComponent,
    PlaneButtonComponent,
    DatagridComponent,
    DropdownContainerDirective,
    ShiftCheckboxComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    RadioGroupComponent,
    StepperComponent,
    StepDirective,
    MdFormComponent,
    SpinnerComponent,
    SpinnerHostDirective,
    PagerComponent,
    TabPaneComponent,
    TabComponent,
    TabDirective,
    GroupComponent,
    MultiselectComponent,
    TooltipComponent,
    DatepickerComponent,
    AlertComponent,
    AutofocusDirective
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class MultidirectoryUiKitModule { }
