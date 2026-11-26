import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { LibraryComponent } from './library.component';

@NgModule({
	imports: [
		CommonModule,
		TableModule,
		InputTextModule,
		RouterModule.forChild([{ path: '', component: LibraryComponent }])
	],
	declarations: [LibraryComponent]
})
export class LibraryModule { }
