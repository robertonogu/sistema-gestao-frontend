import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { ListPaymentsComponent } from './list-payments.component';
import { ListPaymentsRoutingModule } from './list-payments-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { OriginBadgeComponent } from 'src/app/demo/components/shared/origin-badge/origin-badge.component';

@NgModule({
  imports: [
    CommonModule,
		FormsModule,
		TableModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		InputTextModule,
		ToggleButtonModule,
		RippleModule,
		MultiSelectModule,
		DropdownModule,
		ProgressBarModule,
		ToastModule,
		TagModule,
		ListPaymentsRoutingModule,
		TooltipModule,
		ConfirmDialogModule,
		CalendarModule,
		OriginBadgeComponent
  ],
  declarations: [ListPaymentsComponent]
})

export class ListPaymentsModule { }
