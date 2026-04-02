import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'vehicles', data: { breadcrumb: 'Viaturas'}, loadChildren: () => import('./vehicle/list-vehicles/list-vehicles.module').then(m => m.ListVehiclesModule) },
        { path: 'articles', data: { breadcrumb: 'Artigos'}, loadChildren: () => import('./article/list-articles/list-articles.module').then(m => m.ListArticlesModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class InventoryRoutingModule { }
