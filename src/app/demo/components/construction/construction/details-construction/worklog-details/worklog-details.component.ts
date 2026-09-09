import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { BudgetItem } from 'src/app/demo/api/budgetItem';
import { ItemName } from 'src/app/demo/api/itemName';
import { WorkLogDetail } from 'src/app/demo/data/model/workLogDetail.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';

@Component({
  templateUrl: './worklog-details.component.html'
})
export class WorkLogDetailsComponent implements OnInit {

  budgetItemId?: number;
  constructionId = -1;
  itemName = '';
  workLogs: WorkLogDetail[] = [];
  employeeOptions: ItemName[] = [];
  subItemTree: TreeNode[] = [];
  selectedSubItemNode?: TreeNode;
  totalRecords = 0;
  totalHours = 0;
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

    const employees$ = this.budgetItemId != null
      ? this.constructionService.getWorkLogEmployees(this.budgetItemId)
      : this.constructionService.getConstructionWorkLogEmployees(this.constructionId);
    employees$.subscribe((employees) => {
      this.employeeOptions = employees;
    });

    this.constructionService.getBudgetItemsForConstruction(this.constructionId).subscribe((budgetItems) => {
      let items = budgetItems;
      if (this.budgetItemId != null) {
        const node = this.findBudgetItem(budgetItems, this.budgetItemId);
        items = node ? (node.children?.length ? node.children : [node]) : [];
      }
      this.subItemTree = this.mapToTreeNodes(items);
    });
  }

  private mapToTreeNodes(items: BudgetItem[]): TreeNode[] {
    return items.map((item) => ({
      key: item.id.toString(),
      label: item.name,
      data: item.id,
      children: item.children?.length ? this.mapToTreeNodes(item.children) : undefined,
    }));
  }

  private findBudgetItem(items: BudgetItem[], id: number): BudgetItem | undefined {
    for (const item of items) {
      if (item.id === id) return item;
      const found = item.children?.length ? this.findBudgetItem(item.children, id) : undefined;
      if (found) return found;
    }
    return undefined;
  }

  loadPage(event: any): void {
    this.loading = true;

    const pageNo = event.first / event.rows;
    this.pageSize = event.rows;

    const filterValue = (field: string) => {
      const meta = Array.isArray(event.filters?.[field]) ? event.filters[field][0] : event.filters?.[field];
      return meta?.value ?? undefined;
    };
    const employeeId = filterValue('employee');
    const subItemId = filterValue('subItem');

    const req = this.budgetItemId != null
      ? this.constructionService.getWorkLogDetails(this.budgetItemId, pageNo, this.pageSize, employeeId, subItemId)
      : this.constructionService.getConstructionWorkLogDetails(this.constructionId, pageNo, this.pageSize, employeeId, subItemId);

    req.subscribe((res) => {
      this.workLogs = res.objectList;
      this.totalRecords = res.totalElements;
      this.totalHours = res.totalHours;
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
    return this.budgetItemId != null ? this.itemName : 'Mão-de-obra';
  }
}
