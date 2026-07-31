import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ListClientsComponent } from './list-clients.component';
import { ListClientsRoutingModule } from './list-clients-routing.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListClientsRoutingModule,
    TableModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    RippleModule
  ],
  declarations: [ListClientsComponent]
})

export class ListClientsModule { }
