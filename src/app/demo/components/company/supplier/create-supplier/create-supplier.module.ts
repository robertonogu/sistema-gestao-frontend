import { NgModule } from '@angular/core';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateSupplierComponent } from './create-supplier.component';
import { CreateSupplierRoutingModule } from './create-supplier-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
	imports: [
		CommonModule,
		ButtonModule,
		InputNumberModule,
		InputTextModule,
		CreateSupplierRoutingModule,
		ToastModule,
		FormsModule,
		TooltipModule
	],
	declarations: [CreateSupplierComponent]
})
export class CreateSupplierModule { }
