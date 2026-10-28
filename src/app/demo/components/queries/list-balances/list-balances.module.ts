import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ListBalancesComponent } from './list-balances.component';

@NgModule({
	declarations: [ListBalancesComponent],
	imports: [
		CommonModule,
		TableModule,
		RouterModule.forChild([{ path: '', component: ListBalancesComponent }])
	]
})
export class ListBalancesModule { }
