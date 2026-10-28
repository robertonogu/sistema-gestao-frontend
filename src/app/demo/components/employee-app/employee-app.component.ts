import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt-PT';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService, PrimeNGConfig, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TreeSelectModule } from 'primeng/treeselect';
import { BudgetItem } from 'src/app/demo/api/budgetItem';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { WorkLogSubmission, WorkLogSubmissionStatus } from 'src/app/demo/api/workLogSubmission';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { parseLocalDate } from 'src/app/demo/service/localDate.interceptor';
import { WorkLogSubmissionService } from 'src/app/demo/service/people/workLogSubmission.service';

type View = 'list' | 'form';

// Datas em português na lista ("ter., 28/10")
registerLocaleData(localePt, 'pt');

// App do funcionário (PWA no telemóvel): submete registos de trabalho, que ficam pendentes até o escritório os
// aprovar, e vê os seus registos dos últimos 30 dias. Enquanto pendentes, pode editá-los ou apagá-los.
@Component({
  selector: 'app-employee-app',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CalendarModule, CheckboxModule, ConfirmDialogModule, DropdownModule,
    InputNumberModule, InputTextareaModule, TagModule, ToastModule, TreeSelectModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './employee-app.component.html'
})
export class EmployeeAppComponent implements OnInit {

  readonly statusLabels: Record<WorkLogSubmissionStatus, { label: string, severity: 'warning' | 'success' | 'danger' }> = {
    PENDING: { label: 'Pendente', severity: 'warning' },
    APPROVED: { label: 'Aprovado', severity: 'success' },
    REJECTED: { label: 'Rejeitado', severity: 'danger' }
  };

  view: View = 'list';
  loading = true;
  loadError: string | null = null;
  submissions: WorkLogSubmission[] = [];
  constructions: ConstructionNames[] = [];

  // ===== Formulário =====
  editingId: number | null = null;
  saving = false;
  submitted = false;
  formError: string | null = null;
  today = new Date();
  date: Date = new Date();
  hours: number | null = 8;
  workOnConstruction = true;
  constructionId: number | null = null;
  budgetTree: TreeNode[] = [];
  budgetNode: TreeNode | null = null;
  description = '';

  constructor(public authService: AuthService, private submissionService: WorkLogSubmissionService,
              private confirmationService: ConfirmationService, private messageService: MessageService,
              private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    // Calendário em português (o funcionário só usa esta página, por isso não afeta o backoffice)
    this.primengConfig.setTranslation({
      dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
      monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      firstDayOfWeek: 1,
      today: 'Hoje',
      clear: 'Limpar'
    });

    this.loadSubmissions();
    this.submissionService.getMyConstructions().subscribe(constructions => this.constructions = constructions);
  }

  get pendingHours(): number {
    return this.submissions.filter(s => s.status === 'PENDING').reduce((total, s) => total + s.hours, 0);
  }

  loadSubmissions(): void {
    this.loading = true;
    this.loadError = null;
    this.submissionService.getMySubmissions(30).subscribe({
      next: (submissions) => {
        this.submissions = submissions;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.loadError = err?.status === 0 ? 'Sem ligação. Verifique a internet e tente de novo.' : 'Não foi possível carregar os registos.';
      }
    });
  }

  parseDate(value: string): Date | undefined {
    return parseLocalDate(value);
  }

  newSubmission(): void {
    this.editingId = null;
    this.date = new Date();
    this.hours = 8;
    this.workOnConstruction = true;
    this.description = '';
    // Com uma só obra, já vem escolhida
    this.constructionId = this.constructions.length === 1 ? this.constructions[0].constructionId : null;
    this.budgetNode = null;
    this.budgetTree = [];
    if (this.constructionId) this.loadBudgetTree(this.constructionId);
    this.openForm();
  }

  editSubmission(submission: WorkLogSubmission): void {
    this.editingId = submission.workLogSubmissionId;
    this.date = parseLocalDate(submission.date) ?? new Date();
    this.hours = submission.hours;
    this.workOnConstruction = submission.workOnConstruction;
    this.description = submission.description ?? '';
    this.constructionId = submission.constructionId;
    this.budgetNode = null;
    this.loadBudgetTree(submission.constructionId, submission.budgetItemId);
    this.openForm();
  }

  deleteSubmission(submission: WorkLogSubmission): void {
    this.confirmationService.confirm({
      header: 'Apagar registo',
      message: `Apagar o registo de ${submission.hours} h em ${submission.constructionName}?`,
      accept: () => {
        this.submissionService.deleteMySubmission(submission.workLogSubmissionId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Registo apagado' });
            this.loadSubmissions();
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível apagar.' })
        });
      }
    });
  }

  onConstructionChange(): void {
    this.budgetNode = null;
    this.budgetTree = [];
    if (this.constructionId) this.loadBudgetTree(this.constructionId);
  }

  save(): void {
    this.submitted = true;
    this.formError = null;
    if (!this.date || !this.hours || !this.constructionId || !this.budgetNode) {
      this.formError = 'Preencha a data, as horas, a obra e o item.';
      return;
    }
    const input = {
      date: this.date,
      hours: this.hours,
      workOnConstruction: this.workOnConstruction,
      constructionId: this.constructionId,
      budgetItemId: this.budgetNode.data,
      description: this.description.trim() || null
    };
    this.saving = true;
    const request = this.editingId
      ? this.submissionService.updateMySubmission(this.editingId, input)
      : this.submissionService.createMySubmission(input);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.messageService.add({ severity: 'success', summary: this.editingId ? 'Registo atualizado' : 'Registo enviado', detail: 'Fica pendente até o escritório o aprovar.' });
        this.view = 'list';
        this.loadSubmissions();
      },
      error: (err) => {
        this.saving = false;
        this.formError = err?.status === 0
          ? 'Sem ligação. O registo não foi enviado: tente de novo quando tiver rede.'
          : err?.error?.message ?? 'Não foi possível guardar o registo.';
      }
    });
  }

  cancel(): void {
    this.view = 'list';
  }

  private openForm(): void {
    this.submitted = false;
    this.formError = null;
    this.view = 'form';
    window.scrollTo(0, 0);
  }

  private loadBudgetTree(constructionId: number, selectBudgetItemId?: number): void {
    this.submissionService.getMyBudgetTree(constructionId).subscribe({
      next: (budgetItems) => {
        this.budgetTree = toTreeNodes(budgetItems);
        if (selectBudgetItemId) this.budgetNode = findTreeNode(this.budgetTree, selectBudgetItemId) ?? null;
      },
      error: (err) => this.formError = err?.error?.message ?? 'Não foi possível carregar os itens da obra.'
    });
  }
}

function toTreeNodes(budgetItems: BudgetItem[]): TreeNode[] {
  return budgetItems.map(budgetItem => ({
    key: budgetItem.id.toString(),
    label: budgetItem.name,
    data: budgetItem.id,
    children: budgetItem.children?.length ? toTreeNodes(budgetItem.children) : undefined
  }));
}

function findTreeNode(nodes: TreeNode[], budgetItemId: number): TreeNode | undefined {
  for (const node of nodes) {
    if (node.data === budgetItemId) return node;
    const found = node.children ? findTreeNode(node.children, budgetItemId) : undefined;
    if (found) return found;
  }
  return undefined;
}
