import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ListSuppliersComponent } from './list-suppliers.component';
import { ListSuppliersRoutingModule } from './list-suppliers-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListSuppliersRoutingModule,
    TableModule,
    TagModule,
    TooltipModule
  ],
  declarations: [ListSuppliersComponent]
})

export class ListSuppliersModule { }
