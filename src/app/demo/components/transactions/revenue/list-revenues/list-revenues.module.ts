import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ListRevenuesRoutingModule } from './list-revenues-routing.module';
import { TableModule } from 'primeng/table';
import { ListRevenuesComponent } from './list-revenues.component';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListRevenuesRoutingModule,
    TableModule,
    TooltipModule,
    TagModule,
    DropdownModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    CalendarModule
  ],
  declarations: [ListRevenuesComponent]
})

export class ListRevenuesModule { }
