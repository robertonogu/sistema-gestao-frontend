import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ListCurrentAccountsComponent } from './list-current-accounts.component';
import { ListCurrentAccountsRoutingModule } from './list-current-accounts-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		ButtonModule,
		DropdownModule,
		ListCurrentAccountsRoutingModule,
		TagModule,
		TooltipModule
  ],
  declarations: [ListCurrentAccountsComponent]
})

export class ListCurrentAccountsModule { }
