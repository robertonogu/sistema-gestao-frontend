import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ExternalEntityCreation } from 'src/app/demo/data/model/externalEntityCreation.model';
import { ExternalEntityService } from 'src/app/demo/service/company/externalEntityService';

@Component({
  templateUrl: './create-external-entity.component.html',
  providers: [MessageService]
})
export class CreateExternalEntityComponent {

  name!: string;
  nif!: number;

  externalEntity!: ExternalEntityCreation;

  constructor(
    private externalEntityService: ExternalEntityService, 
    private messageService: MessageService,
    private _location: Location
  ) { }

  back() {
    this._location.back();
  }

  newExternalEntity() {
    this.externalEntity = { name: this.name, nif: this.nif } as ExternalEntityCreation;

    if (this.externalEntity != null) {
      this.externalEntityService.createExternalEntity(this.externalEntity).subscribe(newExternalEntity => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Entidade Externa adicionado com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
