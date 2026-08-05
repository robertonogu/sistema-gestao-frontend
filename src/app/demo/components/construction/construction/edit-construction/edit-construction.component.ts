import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ItemName } from 'src/app/demo/api/itemName';
import { BudgetItem } from 'src/app/demo/data/model/budgetItem.model';
import { Construction } from 'src/app/demo/data/model/construction.model';
import { PlaceSelection } from 'src/app/demo/directives/google-place-autocomplete.directive';
import { ClientService } from 'src/app/demo/service/company/clientService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';

@Component({
  templateUrl: './edit-construction.component.html',
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
  grid-template-columns: 32px 1fr 125px 125px 132px 125px 120px 60px 44px;
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
.col-extra { display: flex; justify-content: center; }

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
export class EditConstructionComponent implements OnInit {

  clientNames!: ItemName[];

  dynamicForm!: FormGroup;

  loading = true;

  constructionId!: number;

  name!: string;
  address!: string;
  placeId!: string;
  selectedClient!: number;
  adjudicationDate!: Date;
  initialDate!: Date;
  estimatedDays!: number;

  construction!: Construction;

  constructor(
    private constructionService: ConstructionService,
    private clientService: ClientService,
    private _location: Location,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.constructionId = Number(this.route.snapshot.params['constructionId']);

    this.clientService.getClientNames().subscribe((clientNames) => {
      this.clientNames = clientNames;
      this.cdr.markForCheck();
    });

    this.constructionService.getConstructionForEdit(this.constructionId).subscribe({
      next: (construction) => {
        this.name = construction.name;
        this.address = construction.address;
        this.placeId = construction.placeId;
        this.selectedClient = construction.clientId;
        this.adjudicationDate = construction.adjudicationDate ? new Date(construction.adjudicationDate) : null as any;
        this.initialDate = construction.initialDate ? new Date(construction.initialDate) : null as any;
        this.estimatedDays = construction.estimatedDays;

        this.dynamicForm = this.fb.group({
          inputs: this.fb.array(
            (construction.budgetItems ?? []).map(item => this.buildInput(item))
          ),
        });
        this.applyInitialExtraLocks();

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar a obra.' });
        this.loading = false;
        this.cdr.markForCheck();
      }
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
  private buildInput(item?: BudgetItem): FormGroup {
    const hasChildren = !!item?.children?.length;
    return this.fb.group({
      budgetItemId: [item?.budgetItemId ?? null],
      name: [item?.name ?? '', Validators.required],
      laborCost: [{ value: item?.laborCost ?? 0, disabled: hasChildren }],
      materialCost: [{ value: item?.materialCost ?? 0, disabled: hasChildren }],
      externalServiceCost: [{ value: item?.externalServiceCost ?? 0, disabled: hasChildren }],
      indirectCost: [{ value: item?.indirectCost ?? 0, disabled: hasChildren }],
      isExtra: [item?.isExtra ?? false],
      expanded: [true],
      subInputs: this.fb.array((item?.children ?? []).map(child => this.buildSubInput(child))),
    });
  }

  private buildSubInput(item?: BudgetItem): FormGroup {
    const hasChildren = !!item?.children?.length;
    return this.fb.group({
      budgetItemId: [item?.budgetItemId ?? null],
      subName: [item?.name ?? '', Validators.required],
      subLaborCost: [{ value: item?.laborCost ?? 0, disabled: hasChildren }],
      subMaterialCost: [{ value: item?.materialCost ?? 0, disabled: hasChildren }],
      subExternalServiceCost: [{ value: item?.externalServiceCost ?? 0, disabled: hasChildren }],
      subIndirectCost: [{ value: item?.indirectCost ?? 0, disabled: hasChildren }],
      isExtra: [item?.isExtra ?? false],
      expanded: [false],
      subSubInputs: this.fb.array((item?.children ?? []).map(child => this.buildSubSubInput(child))),
    });
  }

  private buildSubSubInput(item?: BudgetItem): FormGroup {
    return this.fb.group({
      budgetItemId: [item?.budgetItemId ?? null],
      subSubName: [item?.name ?? '', Validators.required],
      subSubLaborCost: [item?.laborCost ?? 0],
      subSubMaterialCost: [item?.materialCost ?? 0],
      subSubExternalServiceCost: [item?.externalServiceCost ?? 0],
      subSubIndirectCost: [item?.indirectCost ?? 0],
      isExtra: [item?.isExtra ?? false],
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
    const subGrp = this.buildSubInput();
    this.getSubInputs(rowIndex).push(subGrp);
    this.inputs.at(rowIndex).patchValue({ expanded: true });
    this.setCapituloCostLock(rowIndex, true);
    if (this.inputs.at(rowIndex).get('isExtra')?.value) {
      subGrp.get('isExtra')?.setValue(true);
      subGrp.get('isExtra')?.disable();
    }
    this.cdr.markForCheck();
  }

  addSubSubInput(rowIndex: number, subIndex: number): void {
    const subSubGrp = this.buildSubSubInput();
    this.getSubSubInputs(rowIndex, subIndex).push(subSubGrp);
    this.getSubInputs(rowIndex).at(subIndex).patchValue({ expanded: true });
    this.setSubItemCostLock(rowIndex, subIndex, true);
    const inherited = this.inputs.at(rowIndex).get('isExtra')?.value || this.getSubInputs(rowIndex).at(subIndex).get('isExtra')?.value;
    if (inherited) {
      subSubGrp.get('isExtra')?.setValue(true);
      subSubGrp.get('isExtra')?.disable();
    }
    this.cdr.markForCheck();
  }

  // ===== "extra" cascades to descendants =====
  private cascadeCapituloExtra(rowIndex: number, value: boolean): void {
    this.getSubInputs(rowIndex).controls.forEach((subGrp, subIndex) => {
      const ctrl = (subGrp as FormGroup).get('isExtra');
      ctrl?.setValue(value);
      value ? ctrl?.disable() : ctrl?.enable();
      this.cascadeSubExtra(rowIndex, subIndex, value);
    });
  }

  private cascadeSubExtra(rowIndex: number, subIndex: number, value: boolean): void {
    this.getSubSubInputs(rowIndex, subIndex).controls.forEach(subSubGrp => {
      const ctrl = (subSubGrp as FormGroup).get('isExtra');
      ctrl?.setValue(value);
      value ? ctrl?.disable() : ctrl?.enable();
    });
  }

  onParentExtraChange(rowIndex: number): void {
    const isExtra = !!this.inputs.at(rowIndex).get('isExtra')?.value;
    this.cascadeCapituloExtra(rowIndex, isExtra);
    this.cdr.markForCheck();
  }

  onSubExtraChange(rowIndex: number, subIndex: number): void {
    const isExtra = !!this.getSubInputs(rowIndex).at(subIndex).get('isExtra')?.value;
    this.cascadeSubExtra(rowIndex, subIndex, isExtra);
    this.cdr.markForCheck();
  }

  private applyInitialExtraLocks(): void {
    this.inputs.controls.forEach((_, rowIndex) => {
      if (this.inputs.at(rowIndex).get('isExtra')?.value) {
        this.cascadeCapituloExtra(rowIndex, true);
        return;
      }
      this.getSubInputs(rowIndex).controls.forEach((__, subIndex) => {
        if (this.getSubInputs(rowIndex).at(subIndex).get('isExtra')?.value) {
          this.cascadeSubExtra(rowIndex, subIndex, true);
        }
      });
    });
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

  saveConstruction() {
    const budgetItems: BudgetItem[] = this.inputs.controls.map((input, rowIndex) => {
      const raw = (input as FormGroup).getRawValue();
      const subItems: BudgetItem[] = (input.get('subInputs') as FormArray).controls.map((subInput, subIndex) => {
        const rawSub = (subInput as FormGroup).getRawValue();
        const subSubItems: BudgetItem[] = this.getSubSubInputs(rowIndex, subIndex).controls.map(subSubInput => {
          const rawSubSub = (subSubInput as FormGroup).getRawValue();
          return {
            budgetItemId: rawSubSub.budgetItemId ?? undefined,
            name: rawSubSub.subSubName,
            laborCost: rawSubSub.subSubLaborCost,
            materialCost: rawSubSub.subSubMaterialCost,
            externalServiceCost: rawSubSub.subSubExternalServiceCost,
            indirectCost: rawSubSub.subSubIndirectCost,
            isExtra: rawSubSub.isExtra,
          };
        });
        return {
          budgetItemId: rawSub.budgetItemId ?? undefined,
          name: rawSub.subName,
          laborCost: this.subItemLaborCost(rowIndex, subIndex),
          materialCost: this.subItemMaterialCost(rowIndex, subIndex),
          externalServiceCost: this.subItemExternalServiceCost(rowIndex, subIndex),
          indirectCost: this.subItemIndirectCost(rowIndex, subIndex),
          isExtra: rawSub.isExtra,
          children: subSubItems,
        };
      });
      return {
        budgetItemId: raw.budgetItemId ?? undefined,
        name: raw.name,
        laborCost: this.capituloLaborCost(rowIndex),
        materialCost: this.capituloMaterialCost(rowIndex),
        externalServiceCost: this.capituloExternalServiceCost(rowIndex),
        indirectCost: this.capituloIndirectCost(rowIndex),
        isExtra: raw.isExtra,
        children: subItems,
      };
    });

    this.construction = {
      id: this.constructionId,
      name: this.name,
      address: this.address,
      placeId: this.placeId,
      clientId: this.selectedClient,
      adjudicationDate: this.adjudicationDate,
      initialDate: this.initialDate,
      estimatedDays: this.estimatedDays,
      budgetItems: budgetItems,
    };

    console.log(this.construction.budgetItems);

    this.constructionService.updateConstruction(this.constructionId, this.construction).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Obra atualizada com sucesso.' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
      }
    });
  }

}
