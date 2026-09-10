import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Absence } from 'src/app/demo/api/absence';
import { ItemName } from 'src/app/demo/api/itemName';
import { AbsenceType } from 'src/app/demo/data/enum/absenceType';
import { AbsenceCreation } from 'src/app/demo/data/model/absenceCreation.model';
import { AbsenceService } from 'src/app/demo/service/people/absence.service';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';

@Component({
  templateUrl: './list-absences.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ListAbsencesComponent implements OnInit {

  loading: boolean = true;
  totalRecords: number = 0;
  absences!: Absence[];

  currentPage: number = 0;
  pageSize: number = 20;

  AbsenceType: any = AbsenceType;

  // ===== Dialog de registo =====
  absenceDialog = false;
  submitted = false;
  employeeNames: ItemName[] = [];
  absenceTypes = AbsenceType;
  selectedEmployee: number | null = null;
  selectedAbsenceType: AbsenceType | null = null;
  dateRange: Date[] = [];
  hours: number | null = null;

  constructor(
    private absenceService: AbsenceService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployeeNames().subscribe((names) => {
      this.employeeNames = names;
    });
  }

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    this.absenceService.getAbsences(this.currentPage, this.pageSize).subscribe((absences) => {
      this.absences = absences.objectList;
      this.totalRecords = absences.totalElements;
      this.loading = false;
    });
  }

  get isSingleDay(): boolean {
    const r = this.dateRange;
    if (!r || !r[0]) return false;
    return !r[1] || r[0].toDateString() === r[1].toDateString();
  }

  onDateChange(): void {
    if (!this.isSingleDay) {
      this.hours = null;
    }
  }

  newAbsence() {
    this.submitted = false;
    this.selectedEmployee = null;
    this.selectedAbsenceType = null;
    this.dateRange = [];
    this.hours = null;
    this.absenceDialog = true;
  }

  hideDialog() {
    this.absenceDialog = false;
  }

  saveAbsence() {
    this.submitted = true;

    if (!this.selectedEmployee || !this.selectedAbsenceType || !this.dateRange?.[0]) {
      return;
    }

    const absence = {
      employeeId: this.selectedEmployee,
      absenceType: this.selectedAbsenceType,
      initialDate: this.dateRange[0],
      finalDate: this.dateRange[1] ?? null,
      hours: this.isSingleDay ? (this.hours ?? 0) : 0
    } as unknown as AbsenceCreation;

    this.absenceService.createAbsence(absence).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ausência adicionada com sucesso.' });
      this.absenceDialog = false;
      this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
    });
  }

  deleteAbsence(absence: Absence) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.absenceService.deleteAbsence(absence.absenceId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ausência eliminada com sucesso.' });
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
