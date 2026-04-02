import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CreateVehicleComponent } from './create-vehicle.component';
import { CreateVehicleRoutingModule } from './create-vehicle-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CreateVehicleRoutingModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    TooltipModule
  ],
  declarations: [CreateVehicleComponent]
})

export class CreateVehicleModule { }
