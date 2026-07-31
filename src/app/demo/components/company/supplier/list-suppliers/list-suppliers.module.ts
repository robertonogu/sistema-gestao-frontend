import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ListSuppliersComponent } from './list-suppliers.component';
import { ListSuppliersRoutingModule } from './list-suppliers-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListSuppliersRoutingModule,
    TableModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    RippleModule
  ],
  declarations: [ListSuppliersComponent]
})

export class ListSuppliersModule { }
