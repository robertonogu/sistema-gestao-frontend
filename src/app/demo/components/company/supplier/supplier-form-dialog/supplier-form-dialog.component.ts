import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { NifLookup } from 'src/app/demo/api/nifLookup';
import { Supplier } from 'src/app/demo/api/supplier';
import { LocationsEditorComponent } from 'src/app/demo/components/shared/locations-editor/locations-editor.component';
import { SupplierCreation } from 'src/app/demo/data/model/supplierCreation.model';
import { GooglePlaceLookupService } from 'src/app/demo/service/common/googlePlaceLookup.service';
import { SupplierService } from 'src/app/demo/service/company/supplierService';

@Component({
  selector: 'app-supplier-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputNumberModule, InputTextModule, RippleModule, TooltipModule,
    LocationsEditorComponent],
  templateUrl: './supplier-form-dialog.component.html'
})
export class SupplierFormDialogComponent {

  @Output() saved = new EventEmitter<Supplier>();

  visible: boolean = false;
  submitted: boolean = false;
  supplier: Partial<Supplier> = {};

  nifLoading: boolean = false;
  private autoFilled = { name: '', locationName: '', address: '' };

  constructor(
    private supplierService: SupplierService,
    private placeLookup: GooglePlaceLookupService,
    private messageService: MessageService
  ) {}

  openNew(nif?: number) {
    this.supplier = { locations: [{ name: '', address: '', placeId: '' }] };
    this.submitted = false;
    this.autoFilled = { name: '', locationName: '', address: '' };
    this.visible = true;
    if (nif) {
      this.supplier.nif = nif;
      this.lookupNif();
    }
  }

  openEdit(supplier: Supplier) {
    this.supplier = { ...supplier, locations: (supplier.locations ?? []).map(location => ({ ...location })) };
    this.submitted = false;
    this.visible = true;
  }

  hide() {
    this.visible = false;
    this.submitted = false;
  }

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

  save() {
    this.submitted = true;
    if (!this.supplier.name?.trim()) return;

    const supplierCreation = { name: this.supplier.name, nif: this.supplier.nif, locations: this.supplier.locations ?? [], initialBalance: this.supplier.initialBalance ?? null } as SupplierCreation;
    const editing = !!this.supplier.originId;
    const request = editing
      ? this.supplierService.updateSupplier(this.supplier.originId!, supplierCreation)
      : this.supplierService.createSupplier(supplierCreation);

    request.subscribe({
      next: (supplier) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: editing ? 'Fornecedor atualizado com sucesso.' : 'Fornecedor adicionado com sucesso.' });
        this.visible = false;
        this.supplier = {};
        this.saved.emit(supplier);
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? (editing ? 'Não foi possível atualizar o fornecedor.' : 'Não foi possível adicionar o fornecedor.') })
    });
  }
}

function isValidNif(nif: number): boolean {
  const digits = String(nif);
  if (!/^\d{9}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(digits[i]) * (9 - i);
  let check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  return check === Number(digits[8]);
}
