import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ListEquipmentComponent } from './list-equipment.component';
import { ListEquipmentRoutingModule } from './list-equipment-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		TooltipModule,
		ButtonModule,
		InputTextModule,
		RippleModule,
		DropdownModule,
		ToastModule,
		ConfirmDialogModule,
		ListEquipmentRoutingModule
	],
	declarations: [ListEquipmentComponent]
})
export class ListEquipmentModule { }
