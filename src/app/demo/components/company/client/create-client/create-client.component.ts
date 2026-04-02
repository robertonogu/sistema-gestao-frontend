import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Client } from 'src/app/demo/api/client';
import { ClientCreation } from 'src/app/demo/data/model/clientCreation.model';
import { ClientService } from 'src/app/demo/service/company/clientService';

@Component({
  templateUrl: './create-client.component.html',
  providers: [MessageService]
})
export class CreateClientComponent {

  name!: string;
  nif!: number;

  client!: ClientCreation;

  constructor(
    private clientService: ClientService, 
    private messageService: MessageService,
    private _location: Location
  ) { }

  back() {
    this._location.back();
  }

  newClient() {
    this.client = { name: this.name, nif: this.nif } as ClientCreation;

    if (this.client != null) {
      this.clientService.createClient(this.client).subscribe(newClient => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente adicionado com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

}
