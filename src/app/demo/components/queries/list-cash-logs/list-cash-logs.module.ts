import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ListCashAccountLogsRoutingModule } from './list-cash-logs-routing.module';
import { ListCashLogsComponent } from './list-cash-logs.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		ButtonModule,
		DropdownModule,
		ListCashAccountLogsRoutingModule,
		TagModule,
		TooltipModule
  ],
  declarations: [ListCashLogsComponent]
})

export class ListCashLogsModule { }
