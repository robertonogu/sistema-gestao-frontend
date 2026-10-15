import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ItemName } from 'src/app/demo/api/itemName';
import { MonthlySummary } from 'src/app/demo/api/monthlySummary';
import { TimeMap } from 'src/app/demo/api/timemap';
import { AbsenceDay } from 'src/app/demo/api/absenceDay';
import { VacationSummary } from 'src/app/demo/api/vacationSummary';
import { AbsenceType, absenceTypeAllowsHours } from 'src/app/demo/data/enum/absenceType';
import { HolidayService, NationalHoliday } from 'src/app/demo/service/company/holidayService';
import { AbsenceService } from 'src/app/demo/service/people/absence.service';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';
import { WorkLogService } from 'src/app/demo/service/people/workLogService';
import { VacationService } from 'src/app/demo/service/people/vacation.service';
import { exportTimeMapPdf, hexToRgb, TimeMapPdfCell } from 'src/app/demo/service/people/timeMapPdf';

type SummaryScope = 'external' | 'internal';

const HOURS_PER_DAY = 8;

// Same colors as the absence badges in the absences list
const ABSENCE_COLORS: Record<string, { background: string; color: string }> = {
  VACATION: { background: '#FEEDAF', color: '#8A5340' },
  JUSTIFIED_ABSENCE: { background: '#C8E6C9', color: '#256029' },
  UNJUSTIFIED_ABSENCE: { background: '#FFCDD2', color: '#C63737' },
  SICK_LEAVE: { background: '#B3E5FC', color: '#23547B' },
  UNPAID_LEAVE: { background: '#ECCFFF', color: '#694382' },
  BEREAVEMENT: { background: '#CFD8DC', color: '#37474F' },
  MARRIAGE: { background: '#F8BBD0', color: '#880E4F' },
  CHILDBIRTH: { background: '#FFE0B2', color: '#8C4A00' },
  WORK_ACCIDENT: { background: '#FF8A80', color: '#7F0000' },
};

@Component({
  templateUrl: './timemap.component.html',
  providers: [MessageService],
  styles: [`
    :host ::ng-deep .p-datatable-table {
      table-layout: fixed;
      width: 100%;
    }
    :host ::ng-deep .p-datatable-table td,
    :host ::ng-deep .p-datatable-table th {
      font-size: 12px;
      padding: 1px;
      width: 15px;
      max-width: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Each month is outlined in bold: sides, top of the month header and under its last day */
    :host ::ng-deep .p-datatable.p-datatable-gridlines .p-datatable-table .month-start {
      border-left: 2px solid #495057;
    }
    :host ::ng-deep .p-datatable.p-datatable-gridlines .p-datatable-table .month-end {
      border-right: 2px solid #495057;
    }
    :host ::ng-deep .p-datatable.p-datatable-gridlines .p-datatable-table th.month-top {
      border-top: 2px solid #495057;
      border-bottom: 2px solid #495057;
    }
    :host ::ng-deep .p-datatable.p-datatable-gridlines .p-datatable-table td.month-last-day {
      border-bottom: 2px solid #495057;
    }
  `]
})
export class TimeMapComponent implements OnInit {

  months: string[]
  daysPerMonth: number[];

  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  timeMaps: (TimeMap | null)[][] = Array(12).fill(null).map(() => Array(31).fill(null));
  monthlySummaries: MonthlySummary[] = [];

  year: number = 2026;
  years: number[] = [];

  holidays: NationalHoliday[] = [];
  // Absences of the selected employee by ISO date (yyyy-MM-dd)
  absenceDays = new Map<string, AbsenceDay[]>();

  // Vacation balance of the selected employee and year (carried over + this year's entitlement)
  vacationSummary: VacationSummary | null = null;
  vacationDialog: boolean = false;
  editCarriedOverDays: number = 0;

  employeeNames: ItemName[] = [];
  selectedEmployee: number | null = null;

  scope: SummaryScope = 'external';
  scopeTabs: MenuItem[] = [
    { label: 'Externo' },
    { label: 'Interno' },
  ];
  activeScopeTab: MenuItem = this.scopeTabs[0];

  constructor(
    private workLogService: WorkLogService,
    private holidayService: HolidayService,
    private employeeService: EmployeeService,
    private absenceService: AbsenceService,
    private vacationService: VacationService,
    private messageService: MessageService
  ) {
    this.months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    this.daysPerMonth = daysPerMonthOf(this.year);

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 7 }, (_, i) => currentYear + 1 - i);
  }

  ngOnInit(): void {
    this.employeeService.getEmployeeNames().subscribe(names => {
      this.employeeNames = names;
    });

    this.loadHolidays();
  }

  loadHolidays(): void {
    this.holidayService.getHolidays(this.year).subscribe(
      data => {
        this.holidays = data;
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }

  onYearChange(): void {
    this.daysPerMonth = daysPerMonthOf(this.year);
    this.loadHolidays();
    this.loadTimeMap();
  }

  loadVacationSummary(): void {
    if (this.selectedEmployee == null) {
      this.vacationSummary = null;
      return;
    }
    this.vacationService.getSummary(this.selectedEmployee, this.year).subscribe((summary) => {
      this.vacationSummary = summary;
    });
  }

  openVacationDialog(): void {
    if (!this.vacationSummary?.carriedOverEditable) return;
    this.editCarriedOverDays = this.vacationSummary.carriedOverDays;
    this.vacationDialog = true;
  }

  saveVacationBalance(): void {
    if (this.selectedEmployee == null) return;
    this.vacationService.updateCarriedOver(this.selectedEmployee, this.year, this.editCarriedOverDays ?? 0).subscribe({
      next: (summary) => {
        this.vacationSummary = summary;
        this.vacationDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Férias atualizadas com sucesso.' });
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível guardar as férias.' })
    });
  }

  loadAbsenceDays(): void {
    if (this.selectedEmployee == null) {
      this.absenceDays = new Map();
      return;
    }
    this.absenceService.getAbsenceDays(this.selectedEmployee, this.year).subscribe((days) => {
      const byDate = new Map<string, AbsenceDay[]>();
      days.forEach(d => byDate.set(d.date, [...(byDate.get(d.date) ?? []), d]));
      this.absenceDays = byDate;
    });
  }

  private absencesOn(day: number, month: string): AbsenceDay[] {
    const m = (this.months.indexOf(month) + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return this.absenceDays.get(`${this.year}-${m}-${d}`) ?? [];
  }

  private vacationOn(day: number, month: string): AbsenceDay | undefined {
    return this.absencesOn(day, month).find(a => a.absenceType === 'VACATION');
  }

  // An absence that fills the whole day: vacation, leaves, or any absence registered without hours.
  // Weekends inside an absence period show as normal weekend days.
  wholeDayAbsence(day: number, month: string): AbsenceDay | undefined {
    if (this.isWeekend(day, month)) return undefined;
    return this.absencesOn(day, month).find(a => a.absenceType === 'VACATION' || !absenceTypeAllowsHours(a.absenceType) || !a.hours);
  }

  // Vacation shows the year it belongs to ("Férias 2025" when owed from the previous year)
  absenceLabel(absence: AbsenceDay): string {
    if (absence.absenceType === 'VACATION') {
      return 'Férias ' + (absence.previousYear ? this.year - 1 : this.year);
    }
    return AbsenceType[absence.absenceType as keyof typeof AbsenceType] ?? absence.absenceType;
  }

  absenceStyle(absence: AbsenceDay): { background: string; color: string } | null {
    return ABSENCE_COLORS[absence.absenceType] ?? null;
  }

  // Missing hours explained by a registered absence take that absence type's color (justified green, unjustified red...).
  // Only colored when the absence covers exactly the missing hours, so a day whose work hours are still
  // being filled in is not marked.
  absenceHoursStyle(day: number, month: string): { background: string; color: string } | null {
    const missing = this.timeMaps[this.months.indexOf(month)][day - 1]?.absenceHours;
    if (!missing) return null;
    const partial = this.absencesOn(day, month).filter(a => a.hours > 0);
    const types = new Set(partial.map(a => a.absenceType));
    if (types.size !== 1) return null;
    const hours = partial.reduce((sum, a) => sum + a.hours, 0);
    return hours === missing ? this.absenceStyle(partial[0]) : null;
  }

  // Vacation days in the month: only working days count (weekends and holidays inside a vacation period don't)
  vacationDaysInMonth(monthIndex: number): number {
    let count = 0;
    const month = this.months[monthIndex];
    for (let day = 1; day <= this.daysPerMonth[monthIndex]; day++) {
      const vacation = this.vacationOn(day, month);
      if (!vacation) continue;
      if (!this.isHoliday(day, month) && !this.isWeekend(day, month)) count++;
    }
    return count;
  }

  onScopeTabChange(item: MenuItem): void {
    this.activeScopeTab = item;
    this.scope = item === this.scopeTabs[1] ? 'internal' : 'external';
    this.loadTimeMap();
  }

  loadTimeMap(): void {
    this.loadAbsenceDays();
    this.loadVacationSummary();

    if (this.selectedEmployee == null) {
      this.timeMaps = Array(12).fill(null).map(() => Array(31).fill(null));
      this.monthlySummaries = [];
      return;
    }

    const summary$ = this.scope === 'external'
      ? this.workLogService.getExternalSummary(this.selectedEmployee, this.year)
      : this.workLogService.getInternalSummary(this.selectedEmployee, this.year);

    summary$.subscribe((summary) => {
      this.monthlySummaries = summary.monthlySummaries;
      this.timeMaps = this.transformWorkLogData(summary.dailySummaries);
    });
  }

  // Days with work registered in the month
  workedDaysInMonth(monthIndex: number): number {
    return this.timeMaps[monthIndex].filter(day => (day?.workedHours ?? 0) > 0).length;
  }

  get selectedEmployeeName(): string {
    return this.employeeNames.find(employee => employee.id === this.selectedEmployee)?.name ?? '';
  }

  // Same content as the page: the table (current tab, internal or external), vacation summary and yearly totals
  exportPdf(): void {
    if (this.selectedEmployee == null) return;

    const rows: TimeMapPdfCell[][] = this.days.map(day => this.months.flatMap((month, k) => this.pdfCells(day, month, k)));
    const sum = (pick: (k: number) => number) => this.months.reduce((total, _, k) => total + pick(k), 0);
    const scope = this.scope === 'internal' ? 'Interno' : 'Externo';

    exportTimeMapPdf({
      title: 'MAPA DE HORAS',
      employeeName: this.selectedEmployeeName,
      year: this.year,
      months: this.months,
      daysPerMonth: this.daysPerMonth,
      rows,
      footRows: [
        { label: 'H. Trabalhadas', values: this.months.map((_, k) => this.monthlySummaryFor(k)?.totalWorkedHours ?? 0) },
        { label: 'H. Extra', values: this.months.map((_, k) => this.monthlySummaryFor(k)?.totalExtraHours ?? 0) },
        { label: 'H. Falta', values: this.months.map((_, k) => this.monthlySummaryFor(k)?.totalAbsenceHours ?? 0) },
        { label: 'D. Trabalho', values: this.months.map((_, k) => this.workedDaysInMonth(k)) },
        { label: 'D. Férias', values: this.months.map((_, k) => this.vacationDaysInMonth(k)) },
      ],
      vacation: this.vacationSummary,
      totals: [
        { label: 'Horas trabalhadas', value: sum(k => this.monthlySummaryFor(k)?.totalWorkedHours ?? 0) },
        { label: 'Horas extra', value: sum(k => this.monthlySummaryFor(k)?.totalExtraHours ?? 0) },
        { label: 'Horas em falta', value: sum(k => this.monthlySummaryFor(k)?.totalAbsenceHours ?? 0) },
        { label: 'Dias de férias', value: sum(k => this.vacationDaysInMonth(k)) },
        { label: 'Dias de trabalho', value: sum(k => this.workedDaysInMonth(k)) },
      ],
      fileName: `Mapa de Horas ${scope} - ${this.selectedEmployeeName} - ${this.year}`,
    });
  }

  // PDF cells of one day in one month, mirroring the page cells (missing day, holiday, whole-day absence or H.T/H.E/H.F)
  private pdfCells(day: number, month: string, k: number): TimeMapPdfCell[] {
    if (day > this.daysPerMonth[k]) {
      return [{ text: '', colSpan: 3, missingDay: true, firstMissingDay: day === this.daysPerMonth[k] + 1 }];
    }
    if (this.isHoliday(day, month)) {
      return [{ text: this.getHolidayName(day, month) ?? '', colSpan: 3, fill: HOLIDAY_COLOR, color: [255, 255, 255], bold: true }];
    }
    const absence = this.wholeDayAbsence(day, month);
    if (absence) {
      const style = this.absenceStyle(absence);
      return [{ text: this.absenceLabel(absence), colSpan: 3, fill: style ? hexToRgb(style.background) : undefined, color: style ? hexToRgb(style.color) : undefined, bold: true }];
    }
    const log = this.timeMaps[k][day - 1];
    const weekend = this.isWeekend(day, month) ? WEEKEND_COLOR : undefined;
    const missingStyle = this.absenceHoursStyle(day, month);
    return [
      { text: hoursText(log?.workedHours), fill: weekend },
      { text: hoursText(log?.extraHours), fill: weekend },
      missingStyle
        ? { text: hoursText(log?.absenceHours), fill: hexToRgb(missingStyle.background), color: hexToRgb(missingStyle.color), bold: true }
        : { text: hoursText(log?.absenceHours), fill: weekend },
    ];
  }

  monthlySummaryFor(monthIndex: number): MonthlySummary | undefined {
    return this.monthlySummaries.find(m => m.month === monthIndex + 1);
  }

  get annualTotalExtraHours(): number {
    return this.monthlySummaries.reduce((sum, m) => sum + m.totalExtraHours, 0);
  }

  get annualTotalAbsenceHours(): number {
    return this.monthlySummaries.reduce((sum, m) => sum + m.totalAbsenceHours, 0);
  }

  transformWorkLogData(data: TimeMap[]): (TimeMap | null)[][] {
    const timeMaps: (TimeMap | null)[][] = Array(12).fill(null).map(() => Array(31).fill(null));
    data.forEach(log => {
      const date = new Date(log.date);
      const monthIndex = date.getMonth();
      const dayIndex = date.getDate() - 1;
      timeMaps[monthIndex][dayIndex] = log;
    });
    console.log(timeMaps)
    return timeMaps;
  }

  isHoliday(day: number, month: string): boolean {
    const date = new Date(this.year, this.months.indexOf(month), day);
    return this.holidays.some(holiday => new Date(holiday.date).getTime() === date.getTime());
  }

  isWeekend(day: number, month: string): boolean {
    const date = new Date(this.year, this.months.indexOf(month), day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  getHolidayName(day: number, month: string): string | null {
    const date = new Date(this.year, this.months.indexOf(month), day);
    const holiday = this.holidays.find(holiday => new Date(holiday.date).getTime() === date.getTime());
    return holiday ? holiday.name : null;
  }

}

// Days in each month of the year (February has 29 in leap years)
function daysPerMonthOf(year: number): number[] {
  return Array.from({ length: 12 }, (_, month) => new Date(year, month + 1, 0).getDate());
}

const HOLIDAY_COLOR: [number, number, number] = [76, 175, 80];
const WEEKEND_COLOR: [number, number, number] = [222, 226, 230];

function hoursText(value: number | null | undefined): string {
  return value == null ? '' : String(value);
}
