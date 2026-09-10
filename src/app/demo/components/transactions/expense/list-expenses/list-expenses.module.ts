import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ListExpensesRoutingModule } from './list-expenses-routing.module';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ListExpensesComponent } from './list-expenses.component';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListExpensesRoutingModule,
    PaginatorModule,
		TableModule,
		TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule
  ],
  declarations: [ListExpensesComponent]
})

export class ListExpensesModule { }
