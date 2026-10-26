import { NgModule } from '@angular/core';
import { SupplierFormDialogComponent } from 'src/app/demo/components/company/supplier/supplier-form-dialog/supplier-form-dialog.component';
import { CommonModule } from '@angular/common';
import { CreateExpenseComponent } from './create-expense.component';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { CreateExpenseRoutingModule } from './create-expense-routing.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { TreeSelectModule } from 'primeng/treeselect';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UppercaseDirective } from 'src/app/demo/directives/uppercase.directive';

@NgModule({
  declarations: [CreateExpenseComponent],
  imports: [
    CommonModule,
    ButtonModule,
		InputNumberModule,
		InputTextModule,
		AutoCompleteModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    DialogModule,
    TreeSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
    MenuModule,
    TooltipModule,
    TableModule,
    ConfirmDialogModule,
		CreateExpenseRoutingModule,
		ToastModule,
		UppercaseDirective,
		SupplierFormDialogComponent
  ]
})

export class CreateExpenseModule { }
