import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemName } from 'src/app/demo/api/itemName';
import { WorkLogDetail } from 'src/app/demo/data/model/workLogDetail.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';

@Component({
  templateUrl: './worklog-details.component.html'
})
export class WorkLogDetailsComponent implements OnInit {

  budgetItemId = -1;
  itemName = '';
  workLogs: WorkLogDetail[] = [];
  employeeOptions: ItemName[] = [];
  totalRecords = 0;
  pageSize = 20;
  loading = true;

  constructor(
    private constructionService: ConstructionService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.budgetItemId = Number(this.route.snapshot.paramMap.get('budgetItemId'));
    this.itemName = this.route.snapshot.queryParamMap.get('name') ?? '';

    this.constructionService.getWorkLogEmployees(this.budgetItemId).subscribe((employees) => {
      this.employeeOptions = employees;
    });
  }

  loadPage(event: any): void {
    this.loading = true;

    const pageNo = event.first / event.rows;
    this.pageSize = event.rows;

    const meta = Array.isArray(event.filters?.['employee']) ? event.filters['employee'][0] : event.filters?.['employee'];
    const employeeId = meta?.value ?? undefined;

    this.constructionService.getWorkLogDetails(this.budgetItemId, pageNo, this.pageSize, employeeId).subscribe((res) => {
      this.workLogs = res.objectList;
      this.totalRecords = res.totalElements;
      this.loading = false;
    });
  }

  back(): void {
    this.location.back();
  }
}
