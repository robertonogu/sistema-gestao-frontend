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

// Create/edit supplier dialog shared by the suppliers page and the expense form, so both create suppliers the same way.
// Messages go to the host's MessageService (the host page shows the toast).
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

  // nif.pt lookup (create only)
  nifLoading: boolean = false;
  // Values the last lookup wrote; a field still holding one of them was not edited and may be replaced
  private autoFilled = { name: '', locationName: '', address: '' };

  constructor(
    private supplierService: SupplierService,
    private placeLookup: GooglePlaceLookupService,
    private messageService: MessageService
  ) {}

  openNew() {
    this.supplier = { locations: [{ name: '', address: '', placeId: '' }] };
    this.submitted = false;
    this.autoFilled = { name: '', locationName: '', address: '' };
    this.visible = true;
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
