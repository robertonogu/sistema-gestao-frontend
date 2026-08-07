import { Component } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Client } from 'src/app/demo/api/client';
import { ClientCreation } from 'src/app/demo/data/model/clientCreation.model';
import { ClientService } from 'src/app/demo/service/company/clientService';

@Component({
  templateUrl: './list-clients.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListClientsComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  clients!: Client[];

  currentPage: number = 0;
  pageSize: number = 20;
  sortField: string = 'originId';
  sortDirection!: string;

  clientDialog: boolean = false;
  submitted: boolean = false;
  client: Partial<Client> = {};

  constructor(
    private clientService: ClientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.sortField = event.sortField ?? this.sortField;
    this.sortDirection = event.sortOrder == 1 ? 'DESC' : 'ASC';

    this.clientService.getClients(this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe((clients) => {
      this.clients = clients.objectList;
      this.totalRecords = clients.totalElements;
      this.loading = false;
    });
  }

  openNew() {
    this.client = {};
    this.submitted = false;
    this.clientDialog = true;
  }

  editClient(client: Client) {
    this.client = { ...client };
    this.clientDialog = true;
  }

  hideDialog() {
    this.clientDialog = false;
    this.submitted = false;
  }

  saveClient() {
    this.submitted = true;

    if (this.client.name?.trim()) {
      const clientCreation = { name: this.client.name, nif: this.client.nif } as ClientCreation;

      if (this.client.originId) {
        this.clientService.updateClient(this.client.originId, clientCreation).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado com sucesso.' });
          this.clientDialog = false;
          this.client = {};
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      } else {
        this.clientService.createClient(clientCreation).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente adicionado com sucesso.' });
          this.clientDialog = false;
          this.client = {};
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      }
    }
  }

  deleteClient(client: Client) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar o cliente ' + client.name + '?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.clientService.deleteClient(client.originId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente eliminade com sucesso.' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
