import { NgModule } from '@angular/core';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { CreateWorklogComponent } from './create-worklog.component';
import { CreateWorklogRoutingModule } from './create-worklog-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
	imports: [
		CommonModule,
		ButtonModule,
		InputNumberModule,
		InputTextModule,
		ToastModule,
		DropdownModule,
		CheckboxModule,
		CalendarModule,
		FormsModule,
        CreateWorklogRoutingModule
	],
	declarations: [CreateWorklogComponent]
})
export class CreateWorklogModule { }
