import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'vehicles', data: { breadcrumb: 'Viaturas'}, loadChildren: () => import('./vehicle/list-vehicles/list-vehicles.module').then(m => m.ListVehiclesModule) },
        { path: 'articles', data: { breadcrumb: 'Artigos'}, loadChildren: () => import('./article/list-articles/list-articles.module').then(m => m.ListArticlesModule) },
        { path: 'tools', data: { breadcrumb: 'Ferramentas'}, loadChildren: () => import('./tool/list-tools/list-tools.module').then(m => m.ListToolsModule) },
        { path: 'equipments', data: { breadcrumb: 'Equipamentos'}, loadChildren: () => import('./equipment/list-equipment/list-equipment.module').then(m => m.ListEquipmentModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class InventoryRoutingModule { }
