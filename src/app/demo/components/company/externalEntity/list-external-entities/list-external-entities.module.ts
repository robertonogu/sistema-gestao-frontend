import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ListExternalEntitiesComponent } from './list-external-entities.component';
import { ListExternalEntitiesRoutingModule } from './list-external-entities-routing.module';
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
    ListExternalEntitiesRoutingModule,
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
  declarations: [ListExternalEntitiesComponent]
})

export class ListExternalEntitiesModule { }
