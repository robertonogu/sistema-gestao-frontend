import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CreateSaleComponent } from './create-sale.component';
import { CreateSaleRoutingModule } from './create-sale-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CreateSaleRoutingModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ToolbarModule,
    ToastModule,
    TooltipModule
  ],
  declarations: [CreateSaleComponent]
})

export class CreateSaleModule { }
