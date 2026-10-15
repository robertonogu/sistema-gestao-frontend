import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Absence } from 'src/app/demo/api/absence';
import { ItemName } from 'src/app/demo/api/itemName';
import { AbsenceType, absenceTypeAllowsHours } from 'src/app/demo/data/enum/absenceType';
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
  selectedAbsenceType: string | null = null; // AbsenceType key (e.g. VACATION)
  dateRange: Date[] = [];
  hours: number | null = null;
  previousYear: boolean = false;
  editingAbsenceId: number | null = null;

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

  // Hours only make sense for a single day and for types that are not whole-day leaves
  get hoursEnabled(): boolean {
    return this.isSingleDay && absenceTypeAllowsHours(this.selectedAbsenceType);
  }

  // Year the vacation being registered is taken from: the previous one when the box is ticked
  get vacationYearOptionLabel(): string {
    const year = this.dateRange?.[0]?.getFullYear() ?? new Date().getFullYear();
    return 'Férias do ano anterior (' + (year - 1) + ')';
  }

  onDateChange(): void {
    if (!this.hoursEnabled) {
      this.hours = null;
    }
  }

  newAbsence() {
    this.editingAbsenceId = null;
    this.submitted = false;
    this.selectedEmployee = null;
    this.selectedAbsenceType = null;
    this.dateRange = [];
    this.hours = null;
    this.previousYear = false;
    this.absenceDialog = true;
  }

  editAbsence(absence: Absence) {
    this.editingAbsenceId = absence.absenceId;
    this.submitted = false;
    this.selectedEmployee = absence.employeeId;
    this.selectedAbsenceType = absence.absenceType as unknown as string;
    const start = toLocalDate(absence.initialDate);
    const end = absence.finalDate ? toLocalDate(absence.finalDate) : null;
    this.dateRange = end ? [start, end] : [start];
    this.hours = absence.hours || null;
    this.previousYear = !!absence.previousYear;
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
      hours: this.hoursEnabled ? (this.hours ?? 0) : 0,
      previousYear: this.selectedAbsenceType === 'VACATION' && this.previousYear
    } as unknown as AbsenceCreation;

    const request = this.editingAbsenceId
      ? this.absenceService.updateAbsence(this.editingAbsenceId, absence)
      : this.absenceService.createAbsence(absence);
    request.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: this.editingAbsenceId ? 'Ausência atualizada com sucesso.' : 'Ausência adicionada com sucesso.' });
        this.absenceDialog = false;
        this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível guardar a ausência.' })
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

// "yyyy-MM-dd" from the API as a local date (new Date(string) would read it as UTC midnight)
function toLocalDate(value: Date | string): Date {
  const [year, month, day] = String(value).substring(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}
