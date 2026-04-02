import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CreateMovementComponent } from './create-movement.component';
import { CreateMovementRoutingModule } from './create-movement-routing.module';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CreateMovementRoutingModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ToastModule
  ],
  declarations: [CreateMovementComponent]
})

export class CreateMovementModule { }
