import { NgModule } from '@angular/core';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateExpenseComponent } from '../../../transactions/expense/create-expense/create-expense.component';
import { CreateExternalEntityRoutingModule } from './create-external-entity-routing.module';
import { CreateExternalEntityComponent } from './create-external-entity.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
	imports: [
		CommonModule,
		ButtonModule,
		InputNumberModule,
		InputTextModule,
		CreateExternalEntityRoutingModule,
		ToastModule,
		FormsModule,
		TooltipModule
	],
	declarations: [CreateExternalEntityComponent]
})
export class CreateExternalEntityModule { }
