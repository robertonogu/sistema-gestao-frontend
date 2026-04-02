import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Client } from 'src/app/demo/api/client';
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
  pageSize: number = 5;
  sortField: string = 'originId';
  sortDirection!: string;

  constructor(
    private clientService: ClientService, 
    private router: Router,
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

  newClient() {
    this.router.navigate(['./company/clients/create-client']);
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
