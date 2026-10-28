import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { adminGuard, employeeGuard } from './demo/service/auth/auth.guards';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        // Backoffice: só administradores (sem sessão vai para o login)
        path: '', component: AppLayoutComponent, canActivate: [adminGuard],
        children: [
            { path: '', loadChildren: () => import('./demo/components/dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'uikit', data: { breadcrumb: 'UI Kit' }, loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
            { path: 'utilities', data: { breadcrumb: 'Utilities' }, loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
            { path: 'pages', data: { breadcrumb: 'Pages' }, loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
            { path: 'profile', data: { breadcrumb: 'User Management' }, loadChildren: () => import('./demo/components/profile/profile.module').then(m => m.ProfileModule) },
            { path: 'documentation', data: { breadcrumb: 'Documentation' }, loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
            { path: 'blocks', data: { breadcrumb: 'Prime Blocks' }, loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
            { path: 'ecommerce', data: { breadcrumb: 'E-Commerce' }, loadChildren: () => import('./demo/components/ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
            { path: 'transactions', data: { breadcrumb: 'Transações' }, loadChildren: () => import('./demo/components/transactions/transactions.module').then(m => m.TransactionsModule) },
            { path: 'constructions', data: { breadcrumb: 'Obras' }, loadChildren: () => import('./demo/components/construction/construction.module').then(m => m.ConstructionModule) },
            { path: 'queries', data: { breadcrumb: 'Consultas' }, loadChildren: () => import('./demo/components/queries/queries.module').then(m => m.QueriesModule) },
            { path: 'inventory', data: { breadcrumb: 'Inventário' }, loadChildren: () => import('./demo/components/inventory/inventory.module').then(m => m.InventoryModule) },
            { path: 'people', data: { breadcrumb: 'Pessoal' }, loadChildren: () => import('./demo/components/people/people.module').then(m => m.PeopleModule) },
            { path: 'company', data: { breadcrumb: 'Empresa' }, loadChildren: () => import('./demo/components/company/company.module').then(m => m.CompanyModule) },
            { path: 'apps', data: { breadcrumb: 'Apps' }, loadChildren: () => import('./demo/components/apps/apps.module').then(m => m.AppsModule) }
        ]
    },
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
    // Página do telemóvel para fotografar uma fatura (aberta pelo QR da Nova Despesa), fora do layout com menu
    { path: 'capture/:token', loadComponent: () => import('./demo/components/invoice-capture/invoice-capture.component').then(m => m.InvoiceCaptureComponent) },
    // Endereço fixo (para atalho no telemóvel): retoma a sessão das últimas 12h guardada no telemóvel
    { path: 'capture', loadComponent: () => import('./demo/components/invoice-capture/invoice-capture.component').then(m => m.InvoiceCaptureComponent) },
    // App do funcionário (PWA no telemóvel): registos de trabalho, fora do layout com menu
    { path: 'app', canActivate: [employeeGuard], loadComponent: () => import('./demo/components/employee-app/employee-app.component').then(m => m.EmployeeAppComponent) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
