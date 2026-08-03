import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { Unit } from 'src/app/demo/data/enum/unit';
import { BudgetItemCreation } from 'src/app/demo/data/model/budgetItemCreation.model';
import { ConstructionCreation } from 'src/app/demo/data/model/constructionCreation.model';
import { VehicleCostCreation } from 'src/app/demo/data/model/vehicleCostCreation';
import { PlaceSelection } from 'src/app/demo/directives/google-place-autocomplete.directive';
import { ClientService } from 'src/app/demo/service/company/clientService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { VehicleCostService } from 'src/app/demo/service/construction/vehicleCostService';
import { VehicleService } from 'src/app/demo/service/inventory/vehicle.service';

@Component({
  templateUrl: './create-construction.component.html',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host {
  --bg: #fff;
  --surface-2: #fafbfc;
  --border: #e6e8ec;
  --text: #1a1d23;
  --text-2: #555a63;
  --text-3: #8a8f99;
  --accent: oklch(0.62 0.13 250);
  --accent-soft: oklch(0.96 0.025 250);
  --accent-border: oklch(0.85 0.07 250);
  --danger: oklch(0.62 0.18 25);
  --radius: 10px;
  --radius-sm: 6px;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
}

.orcamento {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg);
  font-size: 14px;
}

// Grid columns shared by every row
.orc-head, .orc-row {
  display: grid;
  grid-template-columns: 32px 1fr 125px 125px 132px 125px 120px 44px;
  align-items: center;
}

.orc-head {
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  > div { padding: 10px 12px; }
}

.orc-row {
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  transition: background 0.1s;

  &:hover { background: var(--surface-2); }

  &.parent {
    background: var(--accent-soft);
    &:hover { background: oklch(0.94 0.03 250); }
    .parent-input { font-weight: 600; }
  }

  &.sub-sub {
    background: #f8f9fb;
    &:hover { background: #f2f4f7; }
  }

  &.add-row { background: var(--surface-2); border-bottom: 1px solid var(--border); }

  > div { padding: 8px 12px; }
}

.col-num { text-align: right; font-family: var(--font-mono); }
.col-num.muted { color: var(--text-3); }
.col-num.strong { font-weight: 600; }
.col-num.small { font-size: 11px; }
.col-actions { display: flex; gap: 4px; justify-content: center; }

.col-desc.indent { padding-left: 32px; position: relative; }
.col-desc.indent::before {
  content: '';
  position: absolute;
  left: 16px; top: 50%;
  width: 12px; height: 1px;
  background: var(--border);
}

.col-desc.indent-2 { padding-left: 64px; position: relative; }
.col-desc.indent-2::before {
  content: '';
  position: absolute;
  left: 48px; top: 50%;
  width: 12px; height: 1px;
  background: var(--border);
}

// Toggle chevron
.toggle {
  width: 22px; height: 22px;
  border: none; background: transparent;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-3); cursor: pointer;
  border-radius: 4px;
  transition: transform 0.15s, background 0.15s;
  &:hover { background: rgba(0,0,0,0.05); color: var(--text); }
  &.expanded { transform: rotate(90deg); }
}

// Inputs inside cells: invisible until hover/focus (keeps the table calm)
:host ::ng-deep .orc-row {
  input.p-inputtext,
  .p-inputnumber input,
  .p-dropdown {
    border: 1px solid transparent !important;
    background: transparent !important;
    box-shadow: none !important;
    width: 100% !important;
    transition: border-color 0.15s, background 0.15s;
  }
  input.p-inputtext { padding: 6px 8px !important; }

  input.p-inputtext:hover,
  .p-inputnumber input:hover,
  .p-dropdown:hover {
    border-color: var(--border) !important;
    background: var(--bg) !important;
  }
  input.p-inputtext:focus,
  .p-inputnumber input:focus,
  .p-dropdown.p-focus {
    border-color: var(--accent) !important;
    background: var(--bg) !important;
    box-shadow: 0 0 0 3px var(--accent-soft) !important;
  }

  .cell-num input { text-align: right; font-family: var(--font-mono); }
  .p-dropdown { min-height: 32px; }
}

// Footer with add-button + totals
.orc-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--surface-2);
  border-top: 1px solid var(--border);
  gap: 12px;
}

.totals {
  display: flex; align-items: center; gap: 28px;
  font-family: var(--font-mono);

  .t-label {
    font-size: 11px; color: var(--text-3);
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .t-value { font-size: 13px; font-weight: 500; }
  .t-total { font-size: 16px; font-weight: 700; }
}

// "Add capítulo / sub-item" dashed button
.btn-dashed {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 500;
  color: var(--accent);
  background: transparent;
  border: 1px dashed var(--accent-border);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
  &:hover { background: var(--accent-soft); }
  i { font-size: 11px; }
}`]
})
export class CreateConstructionComponent {
  [x: string]: any;

  clientNames!: ItemName[];

  dynamicForm!: FormGroup; // Your main form group

  name!: string;
  address!: string;
  placeId!: string;
  selectedClient!: number;
  adjudicationDate!: Date;
  initialDate!: Date;
  estimatedDays!: number;
  distance!: number;

  //units = Unit;

  construction!: ConstructionCreation;

  units: Record<string, string> = {
    un: 'un',
    m: 'm',
    m2: 'm²',
    m3: 'm³',
    kg: 'kg',
    h: 'h',
    vg: 'vg',
    tn: 'tn',
  };

  constructor(
    private constructionService: ConstructionService,
    private clientService: ClientService,
    private _location: Location,
    private messageService: MessageService,
    private vehicleCostService: VehicleCostService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.clientService.getClientNames().subscribe((clientNames) => {
      this.clientNames = clientNames;
    });

    /*this.dynamicForm = this.fb.group({
      inputs: this.fb.array([])
    });*/

    this.dynamicForm = this.fb.group({
      inputs: this.fb.array([this.buildInput()]),
    });
  }

  back() {
    this._location.back();
  }

  onAddressPlaceSelected(place: PlaceSelection): void {
    this.address = place.address;
    this.placeId = place.placeId;
  }

  asFormGroup(c: any): FormGroup { return c as FormGroup; }

  get inputs(): FormArray { return this.dynamicForm.get('inputs') as FormArray; }

  getSubInputs(rowIndex: number): FormArray {
    return this.inputs.at(rowIndex).get('subInputs') as FormArray;
  }

  getSubSubInputs(rowIndex: number, subIndex: number): FormArray {
    return this.getSubInputs(rowIndex).at(subIndex).get('subSubInputs') as FormArray;
  }

  // ===== builders =====
  private buildInput(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      laborCost: [0],
      materialCost: [0],
      externalServiceCost: [0],
      indirectCost: [0],
      expanded: [true],
      subInputs: this.fb.array([] as FormGroup[]),
    });
  }

  private buildSubInput(): FormGroup {
    return this.fb.group({
      subName: ['', Validators.required],
      subLaborCost: [0],
      subMaterialCost: [0],
      subExternalServiceCost: [0],
      subIndirectCost: [0],
      expanded: [false],
      subSubInputs: this.fb.array([] as FormGroup[]),
    });
  }

  private buildSubSubInput(): FormGroup {
    return this.fb.group({
      subSubName: ['', Validators.required],
      subSubLaborCost: [0],
      subSubMaterialCost: [0],
      subSubExternalServiceCost: [0],
      subSubIndirectCost: [0],
    });
  }

  // ===== actions =====
  addInput(): void {
    this.inputs.push(this.buildInput());
    this.cdr.markForCheck();
  }

  private readonly capituloCostFields = ['laborCost', 'materialCost', 'externalServiceCost', 'indirectCost'];
  private readonly subItemCostFields = ['subLaborCost', 'subMaterialCost', 'subExternalServiceCost', 'subIndirectCost'];

  private setCapituloCostLock(rowIndex: number, locked: boolean): void {
    const grp = this.inputs.at(rowIndex) as FormGroup;
    this.capituloCostFields.forEach(f => locked ? grp.get(f)?.disable() : grp.get(f)?.enable());
  }

  private setSubItemCostLock(rowIndex: number, subIndex: number, locked: boolean): void {
    const grp = this.getSubInputs(rowIndex).at(subIndex) as FormGroup;
    this.subItemCostFields.forEach(f => locked ? grp.get(f)?.disable() : grp.get(f)?.enable());
  }

  addSubInput(rowIndex: number): void {
    this.getSubInputs(rowIndex).push(this.buildSubInput());
    this.inputs.at(rowIndex).patchValue({ expanded: true });
    this.setCapituloCostLock(rowIndex, true);
    this.cdr.markForCheck();
  }

  addSubSubInput(rowIndex: number, subIndex: number): void {
    this.getSubSubInputs(rowIndex, subIndex).push(this.buildSubSubInput());
    this.getSubInputs(rowIndex).at(subIndex).patchValue({ expanded: true });
    this.setSubItemCostLock(rowIndex, subIndex, true);
    this.cdr.markForCheck();
  }

  removeInput(rowIndex: number): void {
    this.inputs.removeAt(rowIndex);
    this.cdr.markForCheck();
  }

  removeSubInput(rowIndex: number, subIndex: number): void {
    this.getSubInputs(rowIndex).removeAt(subIndex);
    if (this.getSubInputs(rowIndex).length === 0) {
      this.setCapituloCostLock(rowIndex, false);
    }
    this.cdr.markForCheck();
  }

  removeSubSubInput(rowIndex: number, subIndex: number, subSubIndex: number): void {
    this.getSubSubInputs(rowIndex, subIndex).removeAt(subSubIndex);
    if (this.getSubSubInputs(rowIndex, subIndex).length === 0) {
      this.setSubItemCostLock(rowIndex, subIndex, false);
    }
    this.cdr.markForCheck();
  }

  toggleExpanded(rowIndex: number): void {
    const grp = this.inputs.at(rowIndex);
    grp.patchValue({ expanded: !grp.value.expanded });
    this.cdr.markForCheck();
  }

  toggleSubExpanded(rowIndex: number, subIndex: number): void {
    const grp = this.getSubInputs(rowIndex).at(subIndex);
    grp.patchValue({ expanded: !grp.value.expanded });
    this.cdr.markForCheck();
  }

  private subItemCategoryTotal(rowIndex: number, subIndex: number, subField: string, subSubField: string): number {
    const subSubs = this.getSubSubInputs(rowIndex, subIndex);
    if (subSubs.length === 0) {
      return Number(this.getSubInputs(rowIndex).at(subIndex).value[subField]) || 0;
    }
    return subSubs.controls.reduce((sum, c) => sum + (Number(c.value[subSubField]) || 0), 0);
  }

  private capituloCategory(rowIndex: number, field: string, subField: string, subSubField: string): number {
    const subs = this.getSubInputs(rowIndex);
    if (subs.length === 0) {
      return Number(this.inputs.at(rowIndex).value[field]) || 0;
    }
    return subs.controls.reduce((sum, _, subIndex) =>
      sum + this.subItemCategoryTotal(rowIndex, subIndex, subField, subSubField), 0);
  }

  subItemLaborCost(ri: number, si: number) { return this.subItemCategoryTotal(ri, si, 'subLaborCost', 'subSubLaborCost'); }
  subItemMaterialCost(ri: number, si: number) { return this.subItemCategoryTotal(ri, si, 'subMaterialCost', 'subSubMaterialCost'); }
  subItemExternalServiceCost(ri: number, si: number) { return this.subItemCategoryTotal(ri, si, 'subExternalServiceCost', 'subSubExternalServiceCost'); }
  subItemIndirectCost(ri: number, si: number) { return this.subItemCategoryTotal(ri, si, 'subIndirectCost', 'subSubIndirectCost'); }

  capituloLaborCost(i: number) { return this.capituloCategory(i, 'laborCost', 'subLaborCost', 'subSubLaborCost'); }
  capituloMaterialCost(i: number) { return this.capituloCategory(i, 'materialCost', 'subMaterialCost', 'subSubMaterialCost'); }
  capituloExternalServiceCost(i: number) { return this.capituloCategory(i, 'externalServiceCost', 'subExternalServiceCost', 'subSubExternalServiceCost'); }
  capituloIndirectCost(i: number) { return this.capituloCategory(i, 'indirectCost', 'subIndirectCost', 'subSubIndirectCost'); }

  subItemTotal(rowIndex: number, subIndex: number): number {
    return this.subItemLaborCost(rowIndex, subIndex)
      + this.subItemMaterialCost(rowIndex, subIndex)
      + this.subItemExternalServiceCost(rowIndex, subIndex)
      + this.subItemIndirectCost(rowIndex, subIndex);
  }

  capituloTotal(rowIndex: number): number {
    return this.capituloLaborCost(rowIndex)
      + this.capituloMaterialCost(rowIndex)
      + this.capituloExternalServiceCost(rowIndex)
      + this.capituloIndirectCost(rowIndex);
  }

  get total(): number {
    return this.inputs.controls.reduce((s, _, i) => s + this.capituloTotal(i), 0);
  }

  fmtEUR(n: number): string {
    return (n || 0).toLocaleString('pt-PT', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }) + ' €';
  }

  newConstruction() {
    const budgetItems: BudgetItemCreation[] = this.inputs.controls.map((input, rowIndex) => {
      const raw = (input as FormGroup).getRawValue();
      const subItems: BudgetItemCreation[] = (input.get('subInputs') as FormArray).controls.map((subInput, subIndex) => {
        const subSubItems: BudgetItemCreation[] = this.getSubSubInputs(rowIndex, subIndex).controls.map(subSubInput => ({
          name: subSubInput.value.subSubName,
          laborCost: subSubInput.value.subSubLaborCost,
          materialCost: subSubInput.value.subSubMaterialCost,
          externalServiceCost: subSubInput.value.subSubExternalServiceCost,
          indirectCost: subSubInput.value.subSubIndirectCost,
        }));
        return {
          name: subInput.value.subName,
          laborCost: this.subItemLaborCost(rowIndex, subIndex),
          materialCost: this.subItemMaterialCost(rowIndex, subIndex),
          externalServiceCost: this.subItemExternalServiceCost(rowIndex, subIndex),
          indirectCost: this.subItemIndirectCost(rowIndex, subIndex),
          children: subSubItems,
        };
      });
      return {
        name: raw.name,
        laborCost: this.capituloLaborCost(rowIndex),
        materialCost: this.capituloMaterialCost(rowIndex),
        externalServiceCost: this.capituloExternalServiceCost(rowIndex),
        indirectCost: this.capituloIndirectCost(rowIndex),
        children: subItems
      };
    });

    console.log('raw form value (inputs):', this.dynamicForm.getRawValue());
    console.log('budgetItems built for submission:', JSON.parse(JSON.stringify(budgetItems)));

    this.construction = {
      name: this.name,
      address: this.address,
      placeId: this.placeId,
      clientId: this.selectedClient,
      adjudicationDate: this.adjudicationDate,
      initialDate: this.initialDate,
      estimatedDays: this.estimatedDays,
      distance: this.distance,
      budgetItems: budgetItems
    } as ConstructionCreation;

    console.log('full construction payload sent to backend:', JSON.parse(JSON.stringify(this.construction)));

    this.constructionService.createConstruction(this.construction).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Construção adicionada com sucesso.' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
      }
    });
  }

}
