import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { ListVehicleExpensesComponent } from './list-vehicle-expenses.component';

@NgModule({
	declarations: [ListVehicleExpensesComponent],
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		ButtonModule,
		DropdownModule,
		MultiSelectModule,
		CalendarModule,
		TooltipModule,
		RouterModule.forChild([{ path: '', component: ListVehicleExpensesComponent }])
	]
})
export class ListVehicleExpensesModule { }
