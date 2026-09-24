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
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';

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
    ToastModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    InputTextModule
  ],
  declarations: [ListExpensesComponent]
})

export class ListExpensesModule { }
