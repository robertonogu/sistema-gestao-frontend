import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateExpenseComponent } from './create-expense.component';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { CreateExpenseRoutingModule } from './create-expense-routing.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateExpenseComponent],
  imports: [
    CommonModule,
    ButtonModule,
		InputNumberModule,
		InputTextModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    DividerModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
		CreateExpenseRoutingModule,
		ToastModule
  ]
})

export class CreateExpenseModule { }
