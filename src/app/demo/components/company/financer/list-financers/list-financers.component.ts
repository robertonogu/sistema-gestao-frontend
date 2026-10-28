import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Financer, FinancerCreation } from 'src/app/demo/api/financer';
import { FinancerService } from 'src/app/demo/service/company/financerService';

// Financiadores: emprestam dinheiro à empresa (receita "Empréstimo de Financiador"), com o que a empresa deve a cada um.
// As devoluções fazem-se nos Pagamentos.
@Component({
  templateUrl: './list-financers.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ListFinancersComponent implements OnInit {

  loading: boolean = true;
  financers: Financer[] = [];

  financerDialog: boolean = false;
  submitted: boolean = false;
  financer: Partial<Financer> = {};

  constructor(
    private financerService: FinancerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.load();
  }


  load() {
    this.loading = true;
    this.financerService.getFinancers().subscribe((financers) => {
      this.financers = financers;
      this.loading = false;
    });
  }


  openNew() {
    this.financer = {};
    this.submitted = false;
    this.financerDialog = true;
  }

  editFinancer(financer: Financer) {
    this.financer = { ...financer };
    this.financerDialog = true;
  }

  hideDialog() {
    this.financerDialog = false;
    this.submitted = false;
  }

  saveFinancer() {
    this.submitted = true;
    if (!this.financer.name?.trim()) return;

    const financerCreation: FinancerCreation = {
      name: this.financer.name, nif: this.financer.nif as number, initialBalance: this.financer.initialBalance ?? null
    };
    const editing = !!this.financer.originId;
    const request = editing
      ? this.financerService.updateFinancer(this.financer.originId as number, financerCreation)
      : this.financerService.createFinancer(financerCreation);

    request.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: editing ? 'Financiador atualizado com sucesso.' : 'Financiador adicionado com sucesso.' });
        this.financerDialog = false;
        this.financer = {};
        this.load();
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível guardar.' })
    });
  }

  // Inativo: deixa de aparecer para escolher na Nova Despesa e no Novo Pagamento
  updateStatus(financer: Financer) {
    this.financerService.changeStatus(financer.originId, !financer.active).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Estado do financiador atualizado.' });
        this.load();
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível alterar o estado.' })
    });
  }

  deleteFinancer(financer: Financer) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar ' + financer.name + '?',
      message: 'Só é possível eliminar financiadores sem empréstimos nem devoluções registados.',
      accept: () => {
        this.financerService.deleteFinancer(financer.originId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Eliminado com sucesso.' });
            this.load();
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível eliminar.' })
        });
      }
    });
  }
}
