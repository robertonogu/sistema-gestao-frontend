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

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListClientsRoutingModule,
    TableModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule
  ],
  declarations: [ListClientsComponent]
})

export class ListClientsModule { }
