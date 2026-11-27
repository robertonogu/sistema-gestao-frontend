import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { VehicleDashboardComponent } from './vehicle-dashboard.component';

@NgModule({
	declarations: [VehicleDashboardComponent],
	imports: [
		CommonModule,
		TableModule,
		ButtonModule,
		ChartModule,
		TagModule,
		TooltipModule,
		RouterModule.forChild([{ path: '', component: VehicleDashboardComponent }])
	]
})
export class VehicleDashboardModule { }
