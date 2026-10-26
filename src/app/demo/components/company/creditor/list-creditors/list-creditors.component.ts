import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Creditor, CreditorCreation } from 'src/app/demo/api/creditor';
import { CreditorService } from 'src/app/demo/service/company/creditorService';

// Credores: pagam despesas da empresa com dinheiro deles (aparecem junto das contas nas despesas e nos pagamentos),
// com o que a empresa deve a cada um. As devoluções fazem-se nos Pagamentos.
@Component({
  templateUrl: './list-creditors.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ListCreditorsComponent implements OnInit {

  loading: boolean = true;
  creditors: Creditor[] = [];

  creditorDialog: boolean = false;
  submitted: boolean = false;
  creditor: Partial<Creditor> = {};

  constructor(
    private creditorService: CreditorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.load();
  }


  load() {
    this.loading = true;
    this.creditorService.getCreditors().subscribe((creditors) => {
      this.creditors = creditors;
      this.loading = false;
    });
  }


  openNew() {
    this.creditor = {};
    this.submitted = false;
    this.creditorDialog = true;
  }

  editCreditor(creditor: Creditor) {
    this.creditor = { ...creditor };
    this.creditorDialog = true;
  }

  hideDialog() {
    this.creditorDialog = false;
    this.submitted = false;
  }

  saveCreditor() {
    this.submitted = true;
    if (!this.creditor.name?.trim()) return;

    const creditorCreation: CreditorCreation = {
      name: this.creditor.name, nif: this.creditor.nif as number, initialBalance: this.creditor.initialBalance ?? null
    };
    const editing = !!this.creditor.originId;
    const request = editing
      ? this.creditorService.updateCreditor(this.creditor.originId as number, creditorCreation)
      : this.creditorService.createCreditor(creditorCreation);

    request.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: editing ? 'Credor atualizado com sucesso.' : 'Credor adicionado com sucesso.' });
        this.creditorDialog = false;
        this.creditor = {};
        this.load();
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível guardar.' })
    });
  }

  deleteCreditor(creditor: Creditor) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar ' + creditor.name + '?',
      message: 'Só é possível eliminar credores sem despesas pagas nem devoluções registadas.',
      accept: () => {
        this.creditorService.deleteCreditor(creditor.originId).subscribe({
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
