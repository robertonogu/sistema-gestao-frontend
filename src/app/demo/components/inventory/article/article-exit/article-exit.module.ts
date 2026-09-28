import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TreeSelectModule } from 'primeng/treeselect';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ArticleExitComponent } from './article-exit.component';
import { ArticleExitRoutingModule } from './article-exit-routing.module';

@NgModule({
  declarations: [ArticleExitComponent],
  imports: [
    CommonModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    TreeSelectModule,
    FormsModule,
    ArticleExitRoutingModule,
    ToastModule,
    TableModule,
    TooltipModule
  ]
})

export class ArticleExitModule { }
