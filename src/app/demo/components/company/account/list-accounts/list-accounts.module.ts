import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ListAccountsComponent } from './list-accounts.component';
import { ListAccountsRoutingModule } from './list-accounts-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ListAccountsRoutingModule,
    TableModule,
    TagModule,
    TooltipModule
  ],
  declarations: [ListAccountsComponent]
})

export class ListAccountsModule { }
