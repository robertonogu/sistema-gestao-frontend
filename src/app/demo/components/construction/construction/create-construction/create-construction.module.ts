import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CreateConstructionComponent } from './create-construction.component';
import { CreateConstructionRoutingModule } from './create-construction-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CreateConstructionRoutingModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    DividerModule,
    ToastModule,
    TableModule,
    TooltipModule
  ],
  declarations: [CreateConstructionComponent]
})

export class CreateConstructionModule { }
