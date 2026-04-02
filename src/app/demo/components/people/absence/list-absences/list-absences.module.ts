import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ListAbsencesComponent } from './list-absences.component';
import { ListAbsencesRoutingModule } from './list-absences-routing.module';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		InputTextModule,
		ToggleButtonModule,
		RippleModule,
		DropdownModule,
		ToastModule,
		TagModule,
		TooltipModule,
		ConfirmDialogModule,
		ListAbsencesRoutingModule
	],
	declarations: [ListAbsencesComponent]
})
export class ListAbsencesModule { }
