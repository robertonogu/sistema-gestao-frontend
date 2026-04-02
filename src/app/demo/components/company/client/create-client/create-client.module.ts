import { NgModule } from '@angular/core';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { CreateClientComponent } from './create-client.component';
import { CreateClientRoutingModule } from './create-client-routing.module';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
	imports: [
		CommonModule,
		ButtonModule,
		InputNumberModule,
		InputTextModule,
		CreateClientRoutingModule,
		ToastModule,
		FormsModule,
		TooltipModule
	],
	declarations: [CreateClientComponent]
})
export class CreateClientModule { }
