import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ListSalesComponent } from './list-sales.component';
import { ListSalesRoutingModule } from './list-sales-routing.module';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    ConfirmDialogModule,
    ListSalesRoutingModule,
    TableModule,
    DropdownModule,
    TooltipModule,
    ToastModule,
    CalendarModule
  ],
  declarations: [ListSalesComponent]
})

export class ListSalesModule { }
