import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ListAccountLogsComponent } from './list-account-logs.component';
import { ListAccountLogsRoutingModule } from './list-account-logs-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';

@NgModule({
  	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		ButtonModule,
		DropdownModule,
		ListAccountLogsRoutingModule,
		TagModule,
		TooltipModule,
		CalendarModule,
		ToastModule
  ],
  declarations: [ListAccountLogsComponent]
})

export class ListAccountLogsModule { }
