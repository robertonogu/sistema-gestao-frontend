import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ClientCreation } from 'src/app/demo/data/model/clientCreation.model';
import { SupplierCreation } from 'src/app/demo/data/model/supplierCreation.model';
import { SupplierService } from 'src/app/demo/service/company/supplierService';

@Component({
  templateUrl: './create-supplier.component.html',
  providers: [MessageService]
})
export class CreateSupplierComponent {

  name!: string;
  nif!: number;
  distance!: number;

  supplier!: SupplierCreation;

  constructor(
    private supplierService: SupplierService, 
    private messageService: MessageService,
    private _location: Location
  ) { }

  back() {
    this._location.back();
  }

  newSupplier() {
    this.supplier = { name: this.name, nif: this.nif, distance: this.distance } as SupplierCreation;

    if (this.supplier != null) {
      this.supplierService.createSupplier(this.supplier).subscribe(newSupplier => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor adicionado com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
