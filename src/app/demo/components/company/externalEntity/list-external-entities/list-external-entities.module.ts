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

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListExternalEntitiesRoutingModule,
    TableModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule
  ],
  declarations: [ListExternalEntitiesComponent]
})

export class ListExternalEntitiesModule { }
