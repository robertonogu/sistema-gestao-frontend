import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ItemName } from 'src/app/demo/api/itemName';
import { MonthlySummary } from 'src/app/demo/api/monthlySummary';
import { TimeMap } from 'src/app/demo/api/timemap';
import { HolidayService, NationalHoliday } from 'src/app/demo/service/company/holidayService';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';
import { WorkLogService } from 'src/app/demo/service/people/workLogService';

type SummaryScope = 'external' | 'internal';

@Component({
  templateUrl: './timemap.component.html',
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
  `]
})
export class TimeMapComponent implements OnInit {

  months: string[]
  daysPerMonth: number[];

  days: number[] = Array.from({ length: 31 }, (_, i) => i);
  timeMaps: (TimeMap | null)[][] = Array(12).fill(null).map(() => Array(31).fill(null));
  monthlySummaries: MonthlySummary[] = [];

  year: number = 2026;
  years: number[] = [];

  holidays: NationalHoliday[] = [];

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
    private employeeService: EmployeeService
  ) {
    this.months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    this.daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
    this.loadHolidays();
    this.loadTimeMap();
  }

  onScopeTabChange(item: MenuItem): void {
    this.activeScopeTab = item;
    this.scope = item === this.scopeTabs[1] ? 'internal' : 'external';
    this.loadTimeMap();
  }

  loadTimeMap(): void {
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

  monthlySummaryFor(monthIndex: number): MonthlySummary | undefined {
    return this.monthlySummaries.find(m => m.month === monthIndex + 1);
  }

  get annualTotalWorkedHours(): number {
    return this.monthlySummaries.reduce((sum, m) => sum + m.totalWorkedHours, 0);
  }

  get annualTotalExtraHours(): number {
    return this.monthlySummaries.reduce((sum, m) => sum + m.totalExtraHours, 0);
  }

  get annualTotalAbsenceHours(): number {
    return this.monthlySummaries.reduce((sum, m) => sum + m.totalAbsenceHours, 0);
  }

  get annualTotalWorkedDays(): number {
    return this.monthlySummaries.reduce((sum, m) => sum + m.totalWorkedDays, 0);
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