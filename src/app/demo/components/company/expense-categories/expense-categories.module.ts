import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ExpenseCategoriesComponent } from './expense-categories.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    RouterModule.forChild([{ path: '', component: ExpenseCategoriesComponent }])
  ],
  declarations: [ExpenseCategoriesComponent]
})
export class ExpenseCategoriesModule { }
