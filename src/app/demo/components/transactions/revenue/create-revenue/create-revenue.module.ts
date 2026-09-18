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
import { UppercaseDirective } from 'src/app/demo/directives/uppercase.directive';

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
    ToastModule,
    UppercaseDirective
  ],
  declarations: [CreateRevenueComponent]
})

export class CreateRevenueModule { }
