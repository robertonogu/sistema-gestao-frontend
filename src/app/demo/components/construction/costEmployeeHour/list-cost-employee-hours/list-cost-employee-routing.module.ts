import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCostEmployeeHoursComponent } from './list-cost-employee-hours.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListCostEmployeeHoursComponent },
		{ path: 'create-costEmployeeHour', data: { breadcrumb: 'Novo Custo de Hora'}, loadChildren: () => import('../create-cost-employee-hour/create-cost-employee-hour.module').then(m => m.CreateCostEmployeeHourModule) },
	])],
	exports: [RouterModule]
})

export class ListCostEmployeeHoursRoutingModule { }
