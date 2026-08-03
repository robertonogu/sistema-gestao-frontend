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
import { ListToolsComponent } from './list-tools.component';
import { ListToolsRoutingModule } from './list-tools-routing.module';
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
		ListToolsRoutingModule
	],
	declarations: [ListToolsComponent]
})
export class ListToolsModule { }
