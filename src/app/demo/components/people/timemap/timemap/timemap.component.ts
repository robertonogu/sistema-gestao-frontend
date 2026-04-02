import { Component, OnInit } from '@angular/core';
import { TimeMap } from 'src/app/demo/api/timemap';
import { HolidayService } from 'src/app/demo/service/company/holidayService';
import { WorkLogService } from 'src/app/demo/service/people/workLogService';

export interface Holiday {
  id: number;
  name: string;
  date: string;
}

@Component({
  templateUrl: './timemap.component.html',
  styles: ['p-table td, p-table th { font-size: 12px; } td,th { padding: 1px; width: 15px; }']
})
export class TimeMapComponent implements OnInit {

  months: string[]
  daysPerMonth: number[];

  days: number[] = Array.from({ length: 31 }, (_, i) => i);
  timeMaps: TimeMap[][] = [];

  holidays: any;

  constructor(
    private workLogService: WorkLogService,
    private holidayService: HolidayService
  ) {
    this.months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    this.daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }

  ngOnInit(): void {
    this.workLogService.getTimeMap(2).subscribe((timemap) => {
      this.timeMaps = this.transformWorkLogData(timemap);
    });

    this.holidayService.getHolidays().subscribe(
      data => {
        this.holidays = data;
        console.log(this.holidays);
      },
      error => {
        console.error('There was an error!', error);
      }
    );
    this.holidays = [
      { id: 1, name: 'New Year\'s Day', date: '2024-01-01' },
      { id: 2, name: 'Martin Luther King Jr. Day', date: '2024-01-16' },
      { id: 3, name: 'Presidents\' Day', date: '2024-02-20' },
      { id: 4, name: 'Memorial Day', date: '2024-05-29' },
      { id: 5, name: 'Independence Day', date: '2024-07-04' },
      { id: 6, name: 'Labor Day', date: '2024-09-04' },
      { id: 7, name: 'Columbus Day', date: '2024-10-09' },
      { id: 8, name: 'Veterans Day', date: '2024-11-11' },
      { id: 9, name: 'Thanksgiving Day', date: '2024-11-23' },
      { id: 10, name: 'Christmas Day', date: '2024-12-25' }
    ];
  }

  transformWorkLogData(data: TimeMap[]): any[] {
    const timeMaps = Array(12).fill(null).map(() => Array(31).fill(null));
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
    const date = new Date(2024, this.months.indexOf(month), day);
    return this.holidays.some((holiday: { date: string | number | Date; }) => new Date(holiday.date).getTime() === date.getTime());
  }

  isWeekend(day: number, month: string): boolean {
    const date = new Date(2024, this.months.indexOf(month), day); 
    return date.getDay() === 6;
  }

  getHolidayName(day: number, month: string): string | null {
    const date = new Date(2024, this.months.indexOf(month), day); 
    const holiday = this.holidays.find((holiday: { date: string | number | Date; }) => new Date(holiday.date).getTime() === date.getTime());
    return holiday ? holiday.name : null;
  }

}