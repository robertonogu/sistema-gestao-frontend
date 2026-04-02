import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CreateVehicleCostComponent } from './create-vehicle-cost.component';
import { CreateVehicleCostRoutingModule } from './create-vehicle-cost-routing.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CreateVehicleCostRoutingModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    MultiSelectModule,
    CheckboxModule,
    TooltipModule
  ],
  declarations: [CreateVehicleCostComponent]
})

export class CreateVehicleCostModule { }
