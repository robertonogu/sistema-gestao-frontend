import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { IssueArticleComponent } from './issue-article.component';
import { IssueArticleRoutingModule } from './issue-article-routing.module';

@NgModule({
  declarations: [IssueArticleComponent],
  imports: [
    CommonModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    DividerModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
    IssueArticleRoutingModule,
    ToastModule,
    MultiSelectModule,
    FormsModule,
    TableModule
  ]
})

export class IssueArticleModule { }
