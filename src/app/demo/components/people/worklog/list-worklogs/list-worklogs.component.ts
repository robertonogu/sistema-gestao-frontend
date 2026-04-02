import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { WorkLog } from 'src/app/demo/api/workLog';
import { LocalType } from 'src/app/demo/data/enum/localType';
import { WorkLogService } from 'src/app/demo/service/people/workLogService';

@Component({
  templateUrl: './list-worklogs.component.html'
})
export class ListWorkLogsComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  workLogs!: WorkLog[];

  currentPage: number = 0;
  pageSize: number = 5;

  LocalType = LocalType;

  constructor(private workLogService: WorkLogService, private router: Router) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.workLogService.getWorkLogs(this.currentPage, this.pageSize).subscribe((workLogs) => {
      this.workLogs = workLogs.objectList;
      this.totalRecords = workLogs.totalElements;
      this.loading = false;
    });
  }

  newWorkLog() {
    this.router.navigate(['./people/create-worklog']);
  }
}
