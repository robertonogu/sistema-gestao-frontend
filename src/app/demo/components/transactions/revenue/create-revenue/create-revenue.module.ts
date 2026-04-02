import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CreateRevenueComponent } from './create-revenue.component';
import { CreateRevenueRoutingModule } from './create-revenue-routing.module';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CreateRevenueRoutingModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    TooltipModule,
    DropdownModule,
    FormsModule,
    ToastModule
  ],
  declarations: [CreateRevenueComponent]
})

export class CreateRevenueModule { }
