import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialAllocationDetail } from 'src/app/demo/data/model/materialAllocationDetail.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';

@Component({
  templateUrl: './material-details.component.html'
})
export class MaterialDetailsComponent implements OnInit {

  budgetItemId = -1;
  itemName = '';
  materials: MaterialAllocationDetail[] = [];
  loading = true;

  constructor(
    private constructionService: ConstructionService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.budgetItemId = Number(this.route.snapshot.paramMap.get('budgetItemId'));
    this.itemName = this.route.snapshot.queryParamMap.get('name') ?? '';

    this.constructionService.getMaterialDetails(this.budgetItemId).subscribe((materials) => {
      this.materials = materials;
      this.loading = false;
    });
  }

  back(): void {
    this.location.back();
  }

  get totalValue(): number {
    return this.materials.reduce((sum, m) => sum + m.totalValue, 0);
  }

  fmtEUR(n: number): string {
    return (n || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }
}
