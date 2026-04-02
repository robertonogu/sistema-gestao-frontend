import { NgModule } from '@angular/core';
import { CreateEmployeeComponent } from './create-employee.component';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { CreateEmployeeRoutingModule } from './create-employee-routing.module';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [
		CommonModule,
		ButtonModule,
		InputNumberModule,
		InputTextModule,
		CreateEmployeeRoutingModule,
		ToastModule
	],
	declarations: [CreateEmployeeComponent]
})
export class CreateEmployeeModule { }
