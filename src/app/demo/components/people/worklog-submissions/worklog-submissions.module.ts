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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { TreeSelectModule } from 'primeng/treeselect';
import { WorkLogSubmissionsComponent } from './worklog-submissions.component';

@NgModule({
	declarations: [WorkLogSubmissionsComponent],
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
		InputNumberModule,
		InputTextareaModule,
		CheckboxModule,
		CalendarModule,
		TreeSelectModule,
		RouterModule.forChild([{ path: '', component: WorkLogSubmissionsComponent }])
	]
})
export class WorkLogSubmissionsModule { }
