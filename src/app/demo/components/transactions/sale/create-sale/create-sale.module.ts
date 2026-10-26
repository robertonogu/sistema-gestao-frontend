import { NgModule } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CreateSaleComponent } from './create-sale.component';
import { CreateSaleRoutingModule } from './create-sale-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { UppercaseDirective } from 'src/app/demo/directives/uppercase.directive';

@NgModule({
  imports: [
		CheckboxModule,
    ButtonModule,
    CommonModule,
    CreateSaleRoutingModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    ToolbarModule,
    ToastModule,
    TooltipModule,
    UppercaseDirective
  ],
  declarations: [CreateSaleComponent]
})

export class CreateSaleModule { }
