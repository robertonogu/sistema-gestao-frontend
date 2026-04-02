import { NgModule } from '@angular/core';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateAccountComponent } from './create-account.component';
import { CreateAccountRoutingModule } from './create-account-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
	imports: [
		CommonModule,
		ButtonModule,
		InputNumberModule,
		InputTextModule,
		CreateAccountRoutingModule,
		ToastModule,
		FormsModule,
		TooltipModule
	],
	declarations: [CreateAccountComponent]
})
export class CreateAccountModule { }
