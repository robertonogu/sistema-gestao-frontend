import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ListRevenuesRoutingModule } from './list-revenues-routing.module';
import { TableModule } from 'primeng/table';
import { ListRevenuesComponent } from './list-revenues.component';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListRevenuesRoutingModule,
    TableModule,
    TooltipModule,
    TagModule
  ],
  declarations: [ListRevenuesComponent]
})

export class ListRevenuesModule { }
