import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ListMovementsComponent } from './list-movements.component';
import { ListMovementsRoutingModule } from './list-movements-routing.module';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  imports: [
    ConfirmDialogModule,
    ButtonModule,
    CommonModule,
    ListMovementsRoutingModule,
	  TableModule,
    TagModule,
    DialogModule,
    CalendarModule,
    InputNumberModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    TooltipModule
  ],
  declarations: [ListMovementsComponent]
})

export class ListMovementsModule { }
