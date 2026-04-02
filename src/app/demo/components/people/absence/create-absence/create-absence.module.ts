import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CreateAbsenceRoutingModule } from './create-absence-routing.module';
import { CreateAbsenceComponent } from './create-absence.component';
import { TagModule } from 'primeng/tag';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CreateAbsenceRoutingModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    TagModule
  ],
  declarations: [CreateAbsenceComponent]
})

export class CreateAbsenceModule { }
