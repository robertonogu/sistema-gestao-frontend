import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { BudgetItem } from 'src/app/demo/api/budgetItem';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { WorkLogSubmission } from 'src/app/demo/api/workLogSubmission';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { parseLocalDate } from 'src/app/demo/service/localDate.interceptor';
import { WorkLogSubmissionService } from 'src/app/demo/service/people/workLogSubmission.service';

// Registos submetidos pelos funcionários na app: aprovar (com correções, se for preciso) cria o registo de
// trabalho normal; rejeitar pede um motivo, que o funcionário vê na app
@Component({
  templateUrl: './worklog-submissions.component.html',
  providers: [MessageService]
})
export class WorkLogSubmissionsComponent implements OnInit {

  loading = true;
  submissions: WorkLogSubmission[] = [];
  constructionNames: ConstructionNames[] = [];

  // ===== Aprovar =====
  approveDialog = false;
  approving: WorkLogSubmission | null = null;
  saving = false;
  submitted = false;
  date?: Date;
  hours?: number;
  workOnConstruction = true;
  constructionId?: number;
  budgetTree: TreeNode[] = [];
  budgetNode?: TreeNode;

  // ===== Rejeitar =====
  rejectDialog = false;
  rejecting: WorkLogSubmission | null = null;
  rejectionReason = '';

  constructor(private submissionService: WorkLogSubmissionService, private constructionService: ConstructionService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadSubmissions();
    this.constructionService.getConstructionNames().subscribe(names => this.constructionNames = names);
  }

  get totalHours(): number {
    return this.submissions.reduce((total, submission) => total + submission.hours, 0);
  }

  loadSubmissions(): void {
    this.loading = true;
    this.submissionService.getPending().subscribe({
      next: (submissions) => {
        this.submissions = submissions;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  parseDate(value: string): Date | undefined {
    return parseLocalDate(value);
  }

  openApprove(submission: WorkLogSubmission): void {
    this.approving = submission;
    this.submitted = false;
    this.date = parseLocalDate(submission.date);
    this.hours = submission.hours;
    this.workOnConstruction = submission.workOnConstruction;
    this.constructionId = submission.constructionId;
    this.budgetNode = undefined;
    this.loadBudgetTree(submission.constructionId, submission.budgetItemId);
    this.approveDialog = true;
  }

  onConstructionChange(): void {
    this.budgetNode = undefined;
    this.budgetTree = [];
    if (this.constructionId) this.loadBudgetTree(this.constructionId);
  }

  approve(): void {
    this.submitted = true;
    if (!this.approving || !this.date || !this.hours || !this.constructionId || !this.budgetNode) return;
    this.saving = true;
    this.submissionService.approve(this.approving.workLogSubmissionId, {
      date: this.date,
      hours: this.hours,
      workOnConstruction: this.workOnConstruction,
      constructionId: this.constructionId,
      budgetItemId: this.budgetNode.data,
      description: this.approving.description
    }).subscribe({
      next: () => {
        this.saving = false;
        this.approveDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Aprovado', detail: 'O registo passou para o Mapa de Tempos.' });
        this.loadSubmissions();
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível aprovar.' });
      }
    });
  }

  openReject(submission: WorkLogSubmission): void {
    this.rejecting = submission;
    this.rejectionReason = '';
    this.submitted = false;
    this.rejectDialog = true;
  }

  reject(): void {
    this.submitted = true;
    if (!this.rejecting || !this.rejectionReason.trim()) return;
    this.saving = true;
    this.submissionService.reject(this.rejecting.workLogSubmissionId, this.rejectionReason.trim()).subscribe({
      next: () => {
        this.saving = false;
        this.rejectDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Rejeitado', detail: 'O funcionário vê o motivo na app.' });
        this.loadSubmissions();
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível rejeitar.' });
      }
    });
  }

  private loadBudgetTree(constructionId: number, selectBudgetItemId?: number): void {
    this.constructionService.getBudgetItemsForConstruction(constructionId).subscribe((budgetItems) => {
      this.budgetTree = this.toTreeNodes(budgetItems);
      if (selectBudgetItemId) this.budgetNode = this.findTreeNode(this.budgetTree, selectBudgetItemId);
    });
  }

  private toTreeNodes(budgetItems: BudgetItem[]): TreeNode[] {
    return budgetItems.map((budgetItem) => ({
      key: budgetItem.id.toString(),
      label: budgetItem.name,
      data: budgetItem.id,
      children: budgetItem.children?.length ? this.toTreeNodes(budgetItem.children) : undefined
    }));
  }

  private findTreeNode(nodes: TreeNode[], budgetItemId: number): TreeNode | undefined {
    for (const node of nodes) {
      if (node.data === budgetItemId) return node;
      const found = node.children ? this.findTreeNode(node.children, budgetItemId) : undefined;
      if (found) return found;
    }
    return undefined;
  }
}
