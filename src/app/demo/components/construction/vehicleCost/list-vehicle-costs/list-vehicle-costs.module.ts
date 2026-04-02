import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ListVehicleCostsComponent } from './list-vehicle-costs.component';
import { ListVehicleCostsRoutingModule } from './list-vehicle-costs-routing.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		RatingModule,
		TooltipModule,
		ButtonModule,
		SliderModule,
		InputTextModule,
		ToggleButtonModule,
		RippleModule,
		MultiSelectModule,
		DropdownModule,
		ProgressBarModule,
		ToastModule,
		CardModule,
		DividerModule,
		ConfirmDialogModule,
		ListVehicleCostsRoutingModule
	],
	declarations: [ListVehicleCostsComponent]
})
export class ListVehicleCostsModule { }
