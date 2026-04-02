import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ListSalesComponent } from './list-sales.component';
import { ListSalesRoutingModule } from './list-sales-routing.module';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ConfirmDialogModule,
    ListSalesRoutingModule,
    TableModule,
    TooltipModule,
    TooltipModule,
    ToastModule
  ],
  declarations: [ListSalesComponent]
})

export class ListSalesModule { }
