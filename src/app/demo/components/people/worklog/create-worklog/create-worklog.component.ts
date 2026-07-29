import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { BudgetItem } from 'src/app/demo/api/budgetItem';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { WorkLogCreation } from 'src/app/demo/data/model/worklogCreation.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';
import { WorkLogService } from 'src/app/demo/service/people/workLogService';

@Component({
  templateUrl: './create-worklog.component.html',
  providers: [MessageService]
})
export class CreateWorklogComponent implements OnInit {

  constructionNames!: ConstructionNames[];
  budgetTree: TreeNode[] = [];
  employeeNames!: ItemName[];

  date!: Date;
  description!: string;
  hours!: number;
  workOnConstruction!: boolean;
  selectedConstruction!: number;
  selectedBudgetNode!: TreeNode;
  selectedEmployee!: number;

  constructor(
    private constructionService: ConstructionService,
    private employeeService: EmployeeService,
    private workLogService: WorkLogService, 
    private messageService: MessageService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });
  }

  back() {
    this._location.back();
  }

  getBudgetItemsAndEmployees() {
    this.selectedBudgetNode = undefined as unknown as TreeNode;
    this.employeeService.getEmployeeNamesInCostEmployeeHourForConstruction(this.selectedConstruction).subscribe((employeeNames) => {
      this.employeeNames = employeeNames;
    });
    this.constructionService.getBudgetItemsForConstruction(this.selectedConstruction).subscribe((budgetItems) => {
      this.budgetTree = this.mapBudgetItemsToTreeNodes(budgetItems);
    });
  }

  private mapBudgetItemsToTreeNodes(budgetItems: BudgetItem[]): TreeNode[] {
    return budgetItems.map((budgetItem) => ({
      key: budgetItem.id.toString(),
      label: budgetItem.name,
      data: budgetItem.id,
      children: budgetItem.children?.length ? this.mapBudgetItemsToTreeNodes(budgetItem.children) : undefined
    }));
  }

  createWorkLog() {
    let workLogCreation = { date: this.date, hours: this.hours, workOnConstruction: this.workOnConstruction, constructionId: this.selectedConstruction, budgetItemId: this.selectedBudgetNode?.data, employeeId: this.selectedEmployee } as WorkLogCreation;
    
    if (workLogCreation != null) {
      this.workLogService.createWorkLog(workLogCreation).subscribe(newWorkLog => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'WorkLog adicionado com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

  delete() {

  }

}
