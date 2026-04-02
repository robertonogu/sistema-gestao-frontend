import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimeMapComponent } from './timemap.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TimeMapComponent }
	])],
	exports: [RouterModule]
})

export class TimeMapRoutingModule { }
