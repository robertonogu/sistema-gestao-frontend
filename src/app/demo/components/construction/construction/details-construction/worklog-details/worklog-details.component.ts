import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkLogDetail } from 'src/app/demo/data/model/workLogDetail.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';

@Component({
  templateUrl: './worklog-details.component.html'
})
export class WorkLogDetailsComponent implements OnInit {

  budgetItemId = -1;
  itemName = '';
  workLogs: WorkLogDetail[] = [];
  loading = true;

  constructor(
    private constructionService: ConstructionService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.budgetItemId = Number(this.route.snapshot.paramMap.get('budgetItemId'));
    this.itemName = this.route.snapshot.queryParamMap.get('name') ?? '';

    this.constructionService.getWorkLogDetails(this.budgetItemId).subscribe((workLogs) => {
      this.workLogs = workLogs;
      this.loading = false;
    });
  }

  back(): void {
    this.location.back();
  }
}
