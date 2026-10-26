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
import { ListCreditorsComponent } from './list-creditors.component';
import { ListCreditorsRoutingModule } from './list-creditors-routing.module';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListCreditorsRoutingModule,
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
  declarations: [ListCreditorsComponent]
})
export class ListCreditorsModule { }
