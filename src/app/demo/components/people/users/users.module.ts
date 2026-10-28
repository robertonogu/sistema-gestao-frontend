import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UsersComponent } from './users.component';

@NgModule({
	declarations: [UsersComponent],
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		ButtonModule,
		RippleModule,
		DropdownModule,
		ToastModule,
		TooltipModule,
		DialogModule,
		InputTextModule,
		TagModule,
		ConfirmDialogModule,
		RouterModule.forChild([{ path: '', component: UsersComponent }])
	]
})
export class UsersModule { }
