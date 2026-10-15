import { Component } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Supplier } from 'src/app/demo/api/supplier';
import { SupplierCreation } from 'src/app/demo/data/model/supplierCreation.model';
import { PlaceSelection } from 'src/app/demo/directives/google-place-autocomplete.directive';
import { SupplierService } from 'src/app/demo/service/company/supplierService';
import { GooglePlaceLookupService } from 'src/app/demo/service/common/googlePlaceLookup.service';
import { NifLookup } from 'src/app/demo/api/nifLookup';

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

  // nif.pt lookup (create only)
  nifLoading: boolean = false;
  // Values the last lookup wrote; a field still holding one of them was not edited and may be replaced
  private autoFilled = { name: '', locationName: '', address: '' };

  constructor(
    private supplierService: SupplierService,
    private placeLookup: GooglePlaceLookupService,
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
    this.supplier = { locations: [{ name: '', address: '', placeId: '' }] };
    this.submitted = false;
    this.autoFilled = { name: '', locationName: '', address: '' };
    this.supplierDialog = true;
  }

  // Only runs on the search button, so each nif.pt request is deliberate
  lookupNif() {
    const nif = this.supplier.nif;
    if (this.supplier.originId || this.nifLoading || !nif) return;
    if (!isValidNif(nif)) {
      this.messageService.add({ severity: 'warn', summary: 'NIF inválido', detail: 'Verifique o NIF introduzido.' });
      return;
    }
    this.nifLoading = true;
    this.supplierService.lookupNif(nif).subscribe({
      next: (result) => {
        this.nifLoading = false;
        this.applyNifLookup(result);
      },
      error: (err) => {
        this.nifLoading = false;
        this.messageService.add({ severity: 'warn', summary: 'Pesquisa por NIF', detail: err?.error?.message ?? 'Não foi possível pesquisar o NIF.' });
      }
    });
  }

  // Fills fields that are empty or still hold the previous lookup's values, so nothing the user typed is overwritten
  private applyNifLookup(result: NifLookup) {
    if (!this.supplier.locations?.length) {
      this.supplier.locations = [{ name: '', address: '', placeId: '' }];
    }
    const main = this.supplier.locations[0];
    const canReplace = (value: string | undefined, autoFilled: string) => !value?.trim() || value === autoFilled;

    const fullAddress = result.found && result.address
      ? [result.address, [result.postalCode, result.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')
      : '';
    const locationName = fullAddress ? (result.city ?? '') : '';

    // A NIF without data still clears what the previous NIF filled in
    if (canReplace(this.supplier.name, this.autoFilled.name)) {
      this.supplier.name = (result.found ? result.name : null) ?? '';
      this.autoFilled.name = this.supplier.name;
    }
    if (canReplace(main.name, this.autoFilled.locationName)) {
      main.name = locationName;
      this.autoFilled.locationName = locationName;
    }
    const replaceAddress = canReplace(main.address, this.autoFilled.address);
    if (replaceAddress) {
      main.address = fullAddress;
      main.placeId = '';
      this.autoFilled.address = fullAddress;
    }

    if (!result.found) {
      this.messageService.add({ severity: 'info', summary: 'Pesquisa por NIF', detail: 'NIF sem registo no nif.pt. Preencha os dados manualmente.' });
      return;
    }
    if (!replaceAddress || !fullAddress) return;

    // Routes need a Google placeId; without one the user must pick the address from the autocomplete list
    const warnNotFound = () => this.messageService.add({ severity: 'warn', summary: 'Morada', detail: 'Morada não encontrada no Google. Selecione-a na lista de sugestões para poder calcular distâncias.' });
    this.placeLookup.findPlace(fullAddress + ', Portugal').then((place) => {
      if (main.address !== fullAddress) return;
      if (!place) {
        warnNotFound();
        return;
      }
      main.address = place.address;
      main.placeId = place.placeId;
      this.autoFilled.address = place.address;
    }).catch(warnNotFound);
  }

  editSupplier(supplier: Supplier) {
    this.supplier = { ...supplier, locations: (supplier.locations ?? []).map(location => ({ ...location })) };
    this.supplierDialog = true;
  }

  hideDialog() {
    this.supplierDialog = false;
    this.submitted = false;
  }


  saveSupplier() {
    this.submitted = true;

    if (this.supplier.name?.trim()) {
      const supplierCreation = { name: this.supplier.name, nif: this.supplier.nif, locations: this.supplier.locations ?? [], initialBalance: this.supplier.initialBalance ?? null } as SupplierCreation;

      if (this.supplier.originId) {
        this.supplierService.updateSupplier(this.supplier.originId, supplierCreation).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor atualizado com sucesso.' });
            this.supplierDialog = false;
            this.supplier = {};
            this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível atualizar o fornecedor.' })
        });
      } else {
        this.supplierService.createSupplier(supplierCreation).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor adicionado com sucesso.' });
            this.supplierDialog = false;
            this.supplier = {};
            this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível adicionar o fornecedor.' })
        });
      }
    }
  }

  deleteSupplier(supplier: Supplier) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar o fornecedor ' + supplier.name + '?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.supplierService.deleteSupplier(supplier.originId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor eliminado com sucesso.' });
            this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
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

// Portuguese NIF: 9 digits, the last one is a mod 11 check digit
function isValidNif(nif: number): boolean {
  const digits = String(nif);
  if (!/^\d{9}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(digits[i]) * (9 - i);
  let check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  return check === Number(digits[8]);
}
