import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ListFinancersComponent } from './list-financers.component';
import { ListFinancersRoutingModule } from './list-financers-routing.module';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListFinancersRoutingModule,
    TableModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    RippleModule
  ],
  declarations: [ListFinancersComponent]
})
export class ListFinancersModule { }
