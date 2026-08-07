import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditSaleComponent } from './edit-sale.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EditSaleComponent }
	])],
	exports: [RouterModule]
})

export class EditSaleRoutingModule { }
