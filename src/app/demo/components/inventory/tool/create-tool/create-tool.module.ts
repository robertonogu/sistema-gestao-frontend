import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CreateToolComponent } from './create-tool.component';
import { CreateToolRoutingModule } from './create-tool-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { UppercaseDirective } from 'src/app/demo/directives/uppercase.directive';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CreateToolRoutingModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    TooltipModule,
    UppercaseDirective
  ],
  declarations: [CreateToolComponent]
})

export class CreateToolModule { }
