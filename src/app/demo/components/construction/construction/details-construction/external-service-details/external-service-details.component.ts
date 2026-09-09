import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialAllocationDetail } from 'src/app/demo/data/model/materialAllocationDetail.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';

@Component({
  templateUrl: './external-service-details.component.html'
})
export class ExternalServiceDetailsComponent implements OnInit {

  budgetItemId?: number;
  constructionId = -1;
  itemName = '';
  services: MaterialAllocationDetail[] = [];
  totalRecords = 0;
  pageSize = 20;
  loading = true;

  constructor(
    private constructionService: ConstructionService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const bid = this.route.snapshot.paramMap.get('budgetItemId');
    this.budgetItemId = bid != null ? Number(bid) : undefined;
    this.itemName = this.route.snapshot.queryParamMap.get('name') ?? '';
    this.constructionId = this.resolveConstructionId();
  }

  loadPage(event: any): void {
    this.loading = true;

    const pageNo = event.first / event.rows;
    this.pageSize = event.rows;

    const req = this.budgetItemId != null
      ? this.constructionService.getExternalServiceDetails(this.budgetItemId, pageNo, this.pageSize)
      : this.constructionService.getConstructionExternalServiceDetails(this.constructionId, pageNo, this.pageSize);

    req.subscribe((res) => {
      this.services = res.objectList;
      this.totalRecords = res.totalElements;
      this.loading = false;
    });
  }

  private resolveConstructionId(): number {
    let r: ActivatedRoute | null = this.route;
    while (r) {
      const id = r.snapshot.paramMap.get('constructionId');
      if (id) return Number(id);
      r = r.parent;
    }
    return -1;
  }

  back(): void {
    this.location.back();
  }

  get title(): string {
    return this.budgetItemId != null ? this.itemName : 'Serviços Externos';
  }

  fmtEUR(n: number): string {
    return (n || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }
}
