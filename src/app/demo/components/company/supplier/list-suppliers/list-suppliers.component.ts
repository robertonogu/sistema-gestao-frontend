import { Component } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Supplier } from 'src/app/demo/api/supplier';
import { SupplierCreation } from 'src/app/demo/data/model/supplierCreation.model';
import { PlaceSelection } from 'src/app/demo/directives/google-place-autocomplete.directive';
import { SupplierService } from 'src/app/demo/service/company/supplierService';

@Component({
  templateUrl: './list-suppliers.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ListSuppliersComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  suppliers!: Supplier[];

  currentPage: number = 0;
  pageSize: number = 20;

  supplierDialog: boolean = false;
  submitted: boolean = false;
  supplier: Partial<Supplier> = {};

  constructor(
    private supplierService: SupplierService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    this.supplierService.getSuppliers(this.currentPage, this.pageSize).subscribe((suppliers) => {
      this.suppliers = suppliers.objectList;
      this.totalRecords = suppliers.totalElements;
      this.loading = false;
    });
  }

  openNew() {
    this.supplier = {};
    this.submitted = false;
    this.supplierDialog = true;
  }

  editSupplier(supplier: Supplier) {
    this.supplier = { ...supplier };
    this.supplierDialog = true;
  }

  hideDialog() {
    this.supplierDialog = false;
    this.submitted = false;
  }

  onAddressPlaceSelected(place: PlaceSelection): void {
    this.supplier.address = place.address;
    this.supplier.placeId = place.placeId;
  }

  saveSupplier() {
    this.submitted = true;

    if (this.supplier.name?.trim()) {
      const supplierCreation = { name: this.supplier.name, nif: this.supplier.nif, address: this.supplier.address, placeId: this.supplier.placeId } as SupplierCreation;

      if (this.supplier.originId) {
        this.supplierService.updateSupplier(this.supplier.originId, supplierCreation).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor atualizado com sucesso.' });
          this.supplierDialog = false;
          this.supplier = {};
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      } else {
        this.supplierService.createSupplier(supplierCreation).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor adicionado com sucesso.' });
          this.supplierDialog = false;
          this.supplier = {};
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      }
    }
  }

  deleteSupplier(supplier: Supplier) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar o fornecedor ' + supplier.name + '?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.supplierService.deleteSupplier(supplier.originId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor eliminado com sucesso.' });
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
