import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ListMovementsComponent } from './list-movements.component';
import { ListMovementsRoutingModule } from './list-movements-routing.module';
import { TagModule } from 'primeng/tag';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListMovementsRoutingModule,
	  TableModule,
    TagModule
  ],
  declarations: [ListMovementsComponent]
})

export class ListMovementsModule { }
