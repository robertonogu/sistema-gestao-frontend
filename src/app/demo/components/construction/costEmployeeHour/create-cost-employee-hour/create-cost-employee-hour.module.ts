import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CreateCostEmployeeHourComponent } from './create-cost-employee-hour.component';
import { CreateCostEmployeeHourRoutingModule } from './create-cost-employee-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CreateCostEmployeeHourRoutingModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    TooltipModule
  ],
  declarations: [CreateCostEmployeeHourComponent]
})

export class CreateCostEmployeeHourModule { }
