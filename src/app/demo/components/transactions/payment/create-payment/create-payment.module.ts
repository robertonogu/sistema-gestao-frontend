import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatePaymentComponent } from './create-payment.component';
import { CreatePaymentRoutingModule } from './create-payment-routing.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [CreatePaymentComponent],
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
    CreatePaymentRoutingModule,
    ToastModule,
    MultiSelectModule,
    TooltipModule,
    FormsModule,
    TableModule
  ]
})

export class CreatePaymentModule { }
