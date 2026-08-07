import { Component } from '@angular/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { BudgetItem } from 'src/app/demo/api/budgetItem';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { WorkLog } from 'src/app/demo/api/workLog';
import { LocalType } from 'src/app/demo/data/enum/localType';
import { WorkLogCreation } from 'src/app/demo/data/model/worklogCreation.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';
import { WorkLogService } from 'src/app/demo/service/people/workLogService';

@Component({
  templateUrl: './list-worklogs.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListWorkLogsComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  workLogs!: WorkLog[];

  currentPage: number = 0;
  pageSize: number = 20;

  LocalType = LocalType;

  constructionNames!: ConstructionNames[];
  budgetTree: TreeNode[] = [];
  employeeNames!: ItemName[];

  workLogDialog: boolean = false;
  submitted: boolean = false;
  editingWorkLogId?: number;

  date?: Date;
  hours?: number;
  workOnConstruction: boolean = false;
  selectedConstruction?: number;
  selectedBudgetNode?: TreeNode;
  selectedEmployee?: number;

  constructor(
    private workLogService: WorkLogService,
    private constructionService: ConstructionService,
    private employeeService: EmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

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

  getBudgetItemsAndEmployees() {
    this.selectedBudgetNode = undefined;
    this.selectedEmployee = undefined;

    if (!this.selectedConstruction) {
      return;
    }

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

  private findTreeNode(nodes: TreeNode[], budgetItemId: number): TreeNode | undefined {
    for (const node of nodes) {
      if (node.data === budgetItemId) {
        return node;
      }
      if (node.children) {
        const found = this.findTreeNode(node.children, budgetItemId);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  openNew() {
    this.editingWorkLogId = undefined;
    this.date = undefined;
    this.hours = undefined;
    this.workOnConstruction = false;
    this.selectedConstruction = undefined;
    this.selectedBudgetNode = undefined;
    this.selectedEmployee = undefined;
    this.employeeNames = [];
    this.budgetTree = [];
    this.submitted = false;

    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });

    this.workLogDialog = true;
  }

  editWorkLog(workLog: WorkLog) {
    this.editingWorkLogId = workLog.workLogId;
    this.date = new Date(workLog.date);
    this.hours = workLog.hours;
    this.workOnConstruction = workLog.workOnConstruction;
    this.selectedConstruction = workLog.constructionId;
    this.selectedBudgetNode = undefined;
    this.selectedEmployee = undefined;
    this.employeeNames = [];
    this.budgetTree = [];
    this.submitted = false;

    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });

    this.employeeService.getEmployeeNamesInCostEmployeeHourForConstruction(workLog.constructionId).subscribe((employeeNames) => {
      this.employeeNames = employeeNames;
      this.selectedEmployee = workLog.employeeId;
    });

    this.constructionService.getBudgetItemsForConstruction(workLog.constructionId).subscribe((budgetItems) => {
      this.budgetTree = this.mapBudgetItemsToTreeNodes(budgetItems);
      this.selectedBudgetNode = this.findTreeNode(this.budgetTree, workLog.budgetItemId);
    });

    this.workLogDialog = true;
  }

  hideDialog() {
    this.workLogDialog = false;
    this.submitted = false;
  }

  saveWorkLog() {
    this.submitted = true;

    if (this.date && this.selectedConstruction && this.selectedEmployee && this.selectedBudgetNode) {
      const workLogCreation = {
        date: this.date,
        hours: this.hours,
        workOnConstruction: this.workOnConstruction,
        constructionId: this.selectedConstruction,
        budgetItemId: this.selectedBudgetNode.data,
        employeeId: this.selectedEmployee
      } as WorkLogCreation;

      if (this.editingWorkLogId) {
        this.workLogService.updateWorkLog(this.editingWorkLogId, workLogCreation).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Registo de trabalho atualizado com sucesso.' });
          this.workLogDialog = false;
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      } else {
        this.workLogService.createWorkLog(workLogCreation).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Registo de trabalho adicionado com sucesso.' });
          this.workLogDialog = false;
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      }
    }
  }

  deleteWorkLog(workLog: WorkLog) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.workLogService.deleteWorkLog(workLog.workLogId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Registo de trabalho eliminado com sucesso.' });
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
