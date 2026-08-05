import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { EditConstructionComponent } from './edit-construction.component';
import { EditConstructionRoutingModule } from './edit-construction-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { GooglePlaceAutocompleteDirective } from 'src/app/demo/directives/google-place-autocomplete.directive';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    EditConstructionRoutingModule,
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
    GooglePlaceAutocompleteDirective
  ],
  declarations: [EditConstructionComponent]
})

export class EditConstructionModule { }
