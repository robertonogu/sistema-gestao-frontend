import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'employees', data: { breadcrumb: 'Funcionários'}, loadChildren: () => import('./employee/list-employees/list-employees.module').then(m => m.ListEmployeesModule) },
        { path: 'absences', data: { breadcrumb: 'Ausências'}, loadChildren: () => import('./absence/list-absences/list-absences.module').then(m => m.ListAbsencesModule) },
        { path: 'create-absence', loadChildren: () => import('./absence/create-absence/create-absence.module').then(m => m.CreateAbsenceModule) },
        { path: 'create-employee', loadChildren: () => import('./employee/create-employee/create-employee.module').then(m => m.CreateEmployeeModule) },
        { path: 'worklogs', data: { breadcrumb: 'Registos de Trabalho'}, loadChildren: () => import('./worklog/list-worklogs/list-worklogs.module').then(m => m.ListWorkLogsModule) },
        { path: 'create-worklog', loadChildren: () => import('./worklog/create-worklog/create-worklog.module').then(m => m.CreateWorklogModule) },
        { path: 'timemap', loadChildren: () => import('./timemap/timemap/timemap.module').then(m => m.TimeMapModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PeopleRoutingModule { }
