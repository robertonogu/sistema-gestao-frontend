import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConstructionDetails } from 'src/app/demo/api/constructionDetails';
import { ItemCost } from 'src/app/demo/api/itemCost';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';

@Component({
  templateUrl: './details-construction.component.html',
})
export class DetailsConstructionComponent implements OnInit, AfterViewInit {

  constructionDetails!: ConstructionDetails;
  constructionSumValue!: number;

  paymentValueVersusCostValueWorksData: any;
  itemsValue: any;
  options: any;

  route: ActivatedRoute = inject(ActivatedRoute);
  
  constructionId = -1;

  constructor(
    private constructionService: ConstructionService
  ) {}
  

  ngOnInit(): void {
    this.constructionId = Number(this.route.snapshot.params['constructionId']);
  
    this.constructionService.getConstructionDetails(this.constructionId).subscribe((constructionDetails) => {
      this.constructionDetails = constructionDetails;
    });
  }

  ngAfterViewInit(): void {
    const labels = this.getLabels(this.constructionDetails.workItemsCost);
    const values = this.getValues(this.constructionDetails.workItemsCost);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.paymentValueVersusCostValueWorksData = {
      labels: ['Pagamentos', 'Custos de Obra'],
      datasets: [
        {
          data: [this.constructionDetails.paymentValue, this.constructionDetails.costValueWorks],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.itemsValue = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.options = {
      cutout: '80%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };
  }

  getLabels(items: ItemCost[]): string[] {
    return items.map(item => item.name);
  }

  getValues(items: ItemCost[]): number[] {
    return items.map(item => item.value);
  }

  getItemsSum(items: ItemCost[]): number {
    return items.reduce((acc, item) => acc + item.value, 0);
  }
}
