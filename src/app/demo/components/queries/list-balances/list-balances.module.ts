import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ListBalancesComponent } from './list-balances.component';

@NgModule({
	declarations: [ListBalancesComponent],
	imports: [
		CommonModule,
		TableModule,
		ButtonModule,
		TooltipModule,
		RouterModule.forChild([{ path: '', component: ListBalancesComponent }])
	]
})
export class ListBalancesModule { }
