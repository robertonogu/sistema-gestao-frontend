import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { GooglePlaceAutocompleteDirective } from 'src/app/demo/directives/google-place-autocomplete.directive';
import { UppercaseDirective } from 'src/app/demo/directives/uppercase.directive';

@NgModule({
  imports: [
    ButtonModule,
    DragDropModule,
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
    TooltipModule,
    CheckboxModule,
    DialogModule,
    GooglePlaceAutocompleteDirective,
    UppercaseDirective
  ],
  declarations: [CreateConstructionComponent]
})

export class CreateConstructionModule { }
