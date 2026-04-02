import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', loadChildren: () => import('./construction/list-constructions/list-constructions.module').then(m => m.ListConstructionsModule) },
        { path: 'externalServices', data: { breadcrumb: "Serviços Externos" }, loadChildren: () => import('./externalService/list-external-services/list-external-services.module').then(m => m.ListExternalServicesModule) },
        { path: 'vehicleCosts', data: { breadcrumb: "Deslocações" },loadChildren: () => import('./vehicleCost/list-vehicle-costs/list-vehicle-costs.module').then(m => m.ListVehicleCostsModule) },
        { path: 'costEmployeeHours', data: { breadcrumb: "Custo por Hora" }, loadChildren: () => import('./costEmployeeHour/list-cost-employee-hours/list-cost-employee-hours.module').then(m => m.ListCostEmployeeHoursModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ConstructionRoutingModule { }
