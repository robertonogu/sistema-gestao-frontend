import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailsConstructionComponent } from './details-construction.component';
import { MaterialDetailsComponent } from './material-details/material-details.component';
import { WorkLogDetailsComponent } from './worklog-details/worklog-details.component';
import { ExternalServiceDetailsComponent } from './external-service-details/external-service-details.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DetailsConstructionComponent },
		{ path: 'materials', data: { breadcrumb: 'Materiais' }, component: MaterialDetailsComponent },
		{ path: 'materials/:budgetItemId', data: { breadcrumb: 'Materiais' }, component: MaterialDetailsComponent },
		{ path: 'externalServices', data: { breadcrumb: 'Serviços Externos' }, component: ExternalServiceDetailsComponent },
		{ path: 'externalServices/:budgetItemId', data: { breadcrumb: 'Serviços Externos' }, component: ExternalServiceDetailsComponent },
		{ path: 'workLogs', data: { breadcrumb: 'Mão-de-obra' }, component: WorkLogDetailsComponent },
		{ path: 'workLogs/:budgetItemId', data: { breadcrumb: 'Mão-de-obra' }, component: WorkLogDetailsComponent }
	])],
	exports: [RouterModule]
})

export class DetailsConstructionRoutingModule { }
