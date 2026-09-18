import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { EditSaleComponent } from './edit-sale.component';
import { EditSaleRoutingModule } from './edit-sale-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { UppercaseDirective } from 'src/app/demo/directives/uppercase.directive';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    EditSaleRoutingModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    ToolbarModule,
    ToastModule,
    TooltipModule,
    UppercaseDirective
  ],
  declarations: [EditSaleComponent]
})

export class EditSaleModule { }
