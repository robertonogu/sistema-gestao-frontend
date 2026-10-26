import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Table } from 'primeng/table';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Supplier } from 'src/app/demo/api/supplier';
import { SupplierService } from 'src/app/demo/service/company/supplierService';
import { SupplierFormDialogComponent } from '../supplier-form-dialog/supplier-form-dialog.component';

@Component({
  templateUrl: './list-suppliers.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ListSuppliersComponent implements OnDestroy {

  loading: boolean = true;
  totalRecords: number = 0;
  suppliers!: Supplier[];

  currentPage: number = 0;
  pageSize: number = 20;

  @ViewChild(SupplierFormDialogComponent) supplierForm!: SupplierFormDialogComponent;
  @ViewChild('dt') table!: Table;

  // Pesquisa por nome: só pede à API quando se pára de escrever
  searchName: string = '';
  private searchChanges = new Subject<string>();
  private searchSubscription: Subscription;

  constructor(
    private supplierService: SupplierService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.searchSubscription = this.searchChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.goToFirstPage());
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  onSearchChange(value: string) {
    this.searchChanges.next(value.trim());
  }

  // Novos resultados começam na primeira página
  private goToFirstPage() {
    this.table.first = 0;
    this.nextPage({ first: 0, rows: this.pageSize });
  }

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    this.supplierService.getSuppliers(this.currentPage, this.pageSize, this.searchName).subscribe((suppliers) => {
      this.suppliers = suppliers.objectList;
      this.totalRecords = suppliers.totalElements;
      this.loading = false;
    });
  }

  openNew() {
    this.supplierForm.openNew();
  }

  editSupplier(supplier: Supplier) {
    this.supplierForm.openEdit(supplier);
  }

  reload() {
    this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
  }

  deleteSupplier(supplier: Supplier) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar o fornecedor ' + supplier.name + '?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.supplierService.deleteSupplier(supplier.originId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor eliminado com sucesso.' });
            this.reload();
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível eliminar o fornecedor.' })
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}

