import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { BudgetItem } from 'src/app/demo/api/budgetItem';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { ObjectName } from 'src/app/demo/api/objectName';
import { Origin } from 'src/app/demo/api/origin';
import { CategoryType } from 'src/app/demo/data/enum/categoryType';
import { DocumentType } from 'src/app/demo/data/enum/documentType';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { SubCategoryType } from 'src/app/demo/data/enum/subCategoryType';
import { Unit } from 'src/app/demo/data/enum/unit';
import { CostAllocationCreation } from 'src/app/demo/data/model/costAllocationCreation.model';
import { ExpenseCreation } from 'src/app/demo/data/model/expenseCreation.model';
import { ItemCreation } from 'src/app/demo/data/model/itemCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { VehicleService } from 'src/app/demo/service/inventory/vehicle.service';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';

@Component({
  templateUrl: './create-expense.component.html',
  providers: [MessageService],
  styles: [`:host {
  --bg: #fff;
  --surface-2: #fafbfc;
  --border: #e6e8ec;
  --text-3: #8a8f99;
  --accent: oklch(0.62 0.13 250);
  --accent-soft: oklch(0.96 0.025 250);
  --accent-border: oklch(0.85 0.07 250);
  --radius: 10px;
  --radius-sm: 6px;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
}

.item-tbl {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow-x: auto;
  overflow-y: hidden;
  background: var(--bg);
  font-size: 14px;
}

.item-head, .item-row {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 300px 90px 130px 130px 130px 130px 76px;
  align-items: center;
  column-gap: 8px;
  min-width: fit-content;
}

.item-head {
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  > div { padding: 10px 12px; }
}

.item-row {
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  transition: background 0.1s;

  &:hover { background: var(--surface-2); }

  > div { padding: 6px 12px; }
}

.item-row:last-child { border-bottom: none; }

.item-col-num { text-align: right; font-family: var(--font-mono); }
.item-col-total { font-weight: 600; }
.item-col-actions { display: flex; justify-content: center; }

:host ::ng-deep .item-row {
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

  input.p-inputtext:disabled {
    color: inherit !important;
    -webkit-text-fill-color: inherit;
    opacity: 1 !important;
  }

  .item-col-num input { text-align: right; font-family: var(--font-mono); }
  .p-dropdown { min-height: 32px; }
}

.item-foot {
  padding: 10px 12px;
  background: var(--surface-2);
  border-top: 1px solid var(--border);
}

.totals-bar {
  display: flex;
  justify-content: flex-end;
  gap: 32px;
  padding: 12px 4px;
  font-family: var(--font-mono);
}

.totals-bar .t-block { text-align: right; }
.totals-bar .t-label {
  font-size: 11px; color: var(--text-3);
  text-transform: uppercase; letter-spacing: 0.05em;
}
.totals-bar .t-value { font-size: 13px; font-weight: 500; }
.totals-bar .t-value.t-total { font-size: 18px; font-weight: 700; }

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

export class CreateExpenseComponent implements OnInit {

  categoriesAndSubCategories = {
    [CategoryType.BANK]: [SubCategoryType.MAINTENANCE_COMMISSIONS, SubCategoryType.IMMEDIATE_TRANSFERS, SubCategoryType.FEES, SubCategoryType.COMMISSIONS, SubCategoryType.CREDIT],
    [CategoryType.TAXES]: [SubCategoryType.IVA, SubCategoryType.IRC, SubCategoryType.FEES, SubCategoryType.IES, SubCategoryType.FONT_RETENTION],
    [CategoryType.PEOPLE]: [SubCategoryType.SALARIES, SubCategoryType.SOCIAL_SECURITY_CONTRIBUTIONS, SubCategoryType.IRS, SubCategoryType.COMPENSATION_FUNDS, SubCategoryType.INSURANCE_PEOPLE, SubCategoryType.SAFETY],
    [CategoryType.OPERATION]: [SubCategoryType.ELECTRICITY, SubCategoryType.COMMUNICATIONS, SubCategoryType.CONSUMABLES],
    [CategoryType.VEHICLES]: [SubCategoryType.INSURANCE_VEHICLES, SubCategoryType.IUC, SubCategoryType.FUEL, SubCategoryType.MAINTENANCE_VEHICLES, SubCategoryType.INSPECTION, SubCategoryType.PARKING, SubCategoryType.TOLLS],
    [CategoryType.EQUIPMENTS]: [SubCategoryType.MAINTENANCE_EQUIPMENTS],
    [CategoryType.TOOLS]: [SubCategoryType.TOOLS_PURCHASE, SubCategoryType.TOOLS_MAINTENANCE],
    [CategoryType.INVENTORY]: [SubCategoryType.FEEDSTOCK, SubCategoryType.WOOD, SubCategoryType.GLASS_MIRRORS, SubCategoryType.PLUMBING, SubCategoryType
      .CIVIL_CONSTRUCTION, SubCategoryType.COATINGS
    ],
    [CategoryType.ASSOCIATIONS]: [SubCategoryType.DUES],
    [CategoryType.CONSTRUCTIONS]: [SubCategoryType.EXTERNAL_SERVICES],
  };

  categories: any[] = [];
  origins: Origin[] = [];
  documentTypes = DocumentType;
  validIvaRates: number[];
  disablePaidValue: boolean = false;
  disablePaymentDeadline: boolean = false;
  accountNames: ObjectName[] = [];
  paymentMethods = PaymentMethod;

  date!: Date;
  selectedOrigin!: number;
  selectedDocumentType!: DocumentType;
  documentNumber!: string;
  paymentDeadline!: Date;
  isIntegralPayment: boolean = false;
  private _paymentValue: number = 0;
  selectedAccount!: number;
  selectedPaymentMethod!: PaymentMethod;

  items!: MenuItem[];

  lunchVisible: boolean = false;
  dynamicForm: FormGroup;
  dynamicItemForm: FormGroup;

  constructionNames!: ConstructionNames[];
  subItemOptions: ItemName[][] = [];

  units = Unit;

  expenseCreation!: ExpenseCreation;

  linkDialogVisible: boolean = false;
  linkDialogIndex: number | null = null;
  linkBudgetTree: TreeNode[] = [];
  selectedLinkBudgetNode?: TreeNode;
  vehicleNames: ItemName[] = [];

  constructor(
    private originService: OriginService,
    private accountService: AccountService,
    private constructionService: ConstructionService,
    private vehicleService: VehicleService,
    private expenseService: ExpenseService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private _location: Location
  ) {
    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;
    });

    this.accountService.getAccountNames().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });

    this.validIvaRates = [0, 6, 13, 23];

    this.dynamicForm = this.fb.group({
      inputs: this.fb.array([])
    });

    this.dynamicItemForm = this.fb.group({
      itemInputs: this.fb.array([this.buildItemInput()])
    });
  }

  ngOnInit() {
    this.categories = this.transformCategoriesAndSubCategories(this.categoriesAndSubCategories);
  }

  back() {
    this._location.back();
  }

  transformCategoriesAndSubCategories(data: any): any[] {
    return Object.keys(data).map(category => ({
      label: category,
      items: data[category].map((subCategory: string) => ({
        label: subCategory,
        value: subCategory
      }))
    }));
  }

  onCheckboxChange() {
    if (this.isIntegralPayment) {
      this.disablePaidValue = true;
      this.disablePaymentDeadline = true;
    }
    else {
      this.disablePaidValue = false;
      this.disablePaymentDeadline = false;
      this._paymentValue = this.totalValue;
    }
  }

  getConstructionNames() {
    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });
  }

  onConstructionChange(constructionId: number, index: number) {
    this.constructionService.getBudgetSubItemsForConstruction(constructionId).subscribe((budgetSubItems) => {
      this.subItemOptions[index] = budgetSubItems;
    })
  }

  disableLunch() {
    this.lunchVisible = false;
  }

  get inputs(): FormArray {
    return this.dynamicForm.get('inputs') as FormArray;
  }

  addInput() {
    this.inputs.push(this.fb.group({
      constructionId: [null, Validators.required],
      budgetSubItemId: [null, Validators.required],
      value: [null, Validators.required],
      description: [null, Validators.required],
    }));
  }

  addExternalServiceInput() {
    this.addInput();
    this.getConstructionNames();
  }

  removeInput(index: number) {
    this.inputs.removeAt(index);
  }

  get itemInputs(): FormArray {
    return this.dynamicItemForm.get('itemInputs') as FormArray;
  }

  private buildItemInput(): FormGroup {
    return this.fb.group({
      subCategoryType: [null, Validators.required],
      name: [null, Validators.required],
      quantity: [null, Validators.required],
      unit: [null, Validators.required],
      value: [null, Validators.required],
      total: [null],
      iva: [0, Validators.required],
      constructionId: [null],
      budgetItemId: [null],
      allocationQuantity: [null],
      vehicleId: [null],
    });
  }

  addItemInput() {
    this.itemInputs.push(this.buildItemInput());
  }

  private recalcItemTotal(index: number): void {
    const grp = this.itemInputs.at(index) as FormGroup;
    const value = Number(grp.value.value) || 0;
    const ivaRate = Number(grp.value.iva) || 0;
    grp.get('total')?.setValue(value + value * ivaRate / 100, { emitEvent: false });
  }

  private recalcItemValue(index: number): void {
    const grp = this.itemInputs.at(index) as FormGroup;
    const total = Number(grp.value.total) || 0;
    const ivaRate = Number(grp.value.iva) || 0;
    grp.get('value')?.setValue(ivaRate ? total / (1 + ivaRate / 100) : total, { emitEvent: false });
  }

  onItemValueChange(index: number): void {
    const grp = this.itemInputs.at(index) as FormGroup;
    grp.get('value')?.enable({ emitEvent: false });
    if (!Number(grp.get('value')?.value)) {
      grp.get('total')?.enable({ emitEvent: false });
      grp.get('total')?.setValue(null, { emitEvent: false });
      return;
    }
    grp.get('total')?.disable({ emitEvent: false });
    this.recalcItemTotal(index);
  }

  onItemTotalChange(index: number): void {
    const grp = this.itemInputs.at(index) as FormGroup;
    grp.get('total')?.enable({ emitEvent: false });
    if (!Number(grp.get('total')?.value)) {
      grp.get('value')?.enable({ emitEvent: false });
      grp.get('value')?.setValue(null, { emitEvent: false });
      return;
    }
    grp.get('value')?.disable({ emitEvent: false });
    this.recalcItemValue(index);
  }

  onItemIvaChange(index: number): void {
    const grp = this.itemInputs.at(index) as FormGroup;
    if (grp.get('value')?.disabled) {
      this.recalcItemValue(index);
    } else {
      this.recalcItemTotal(index);
    }
  }

  removeItemInput(index: number) {
    this.itemInputs.removeAt(index);
  }

  asFormGroup(c: AbstractControl): FormGroup {
    return c as FormGroup;
  }

  private categoryOf(subCategoryType: SubCategoryType | null): CategoryType | undefined {
    const entry = Object.entries(this.categoriesAndSubCategories)
      .find(([, subs]) => (subs as SubCategoryType[]).includes(subCategoryType as SubCategoryType));
    return entry ? entry[0] as CategoryType : undefined;
  }

  showConstructionLink(subCategoryType: SubCategoryType | null): boolean {
    return subCategoryType === SubCategoryType.EXTERNAL_SERVICES || this.categoryOf(subCategoryType) === CategoryType.INVENTORY;
  }

  showVehicleLink(subCategoryType: SubCategoryType | null): boolean {
    return this.categoryOf(subCategoryType) === CategoryType.VEHICLES;
  }

  showToolEquipmentLink(subCategoryType: SubCategoryType | null): boolean {
    const category = this.categoryOf(subCategoryType);
    return category === CategoryType.TOOLS || category === CategoryType.EQUIPMENTS;
  }

  canOpenLinkDialog(subCategoryType: SubCategoryType | null): boolean {
    return this.showConstructionLink(subCategoryType) || this.showVehicleLink(subCategoryType) || this.showToolEquipmentLink(subCategoryType);
  }

  get linkRowGroup(): FormGroup | null {
    return this.linkDialogIndex !== null ? this.asFormGroup(this.itemInputs.at(this.linkDialogIndex)) : null;
  }

  get linkRowSubCategory(): SubCategoryType | null {
    return this.linkDialogIndex !== null ? this.itemInputs.at(this.linkDialogIndex).value.subCategoryType : null;
  }

  private mapBudgetItemsToTreeNodes(budgetItems: BudgetItem[]): TreeNode[] {
    return budgetItems.map((budgetItem) => ({
      key: budgetItem.id.toString(),
      label: budgetItem.name,
      data: budgetItem.id,
      children: budgetItem.children?.length ? this.mapBudgetItemsToTreeNodes(budgetItem.children) : undefined
    }));
  }

  private findBudgetTreeNode(nodes: TreeNode[], budgetItemId?: number | null): TreeNode | undefined {
    for (const node of nodes) {
      if (node.data === budgetItemId) return node;
      if (node.children?.length) {
        const found = this.findBudgetTreeNode(node.children, budgetItemId);
        if (found) return found;
      }
    }
    return undefined;
  }

  onLinkBudgetNodeChange(node: TreeNode | undefined) {
    if (this.linkDialogIndex === null) return;
    this.itemInputs.at(this.linkDialogIndex).patchValue({ budgetItemId: node?.data ?? null });
  }

  openLinkDialog(index: number) {
    this.linkDialogIndex = index;
    this.linkDialogVisible = true;
    this.linkValidationAttempted = false;
    this.linkBudgetTree = [];
    this.selectedLinkBudgetNode = undefined;

    const row = this.itemInputs.at(index).value;
    const subCategoryType = row.subCategoryType;

    if (this.showConstructionLink(subCategoryType)) {
      this.getConstructionNames();
      if (row.constructionId) this.onLinkConstructionChange(row.constructionId, false);
      if (row.allocationQuantity == null) {
        this.itemInputs.at(index).patchValue({ allocationQuantity: row.quantity });
      }
    }

    if (this.showVehicleLink(subCategoryType) && this.vehicleNames.length === 0) {
      this.vehicleService.getActiveVehicleNames().subscribe(names => this.vehicleNames = names);
    }
  }

  closeLinkDialog() {
    this.linkDialogVisible = false;
    this.linkDialogIndex = null;
  }

  linkValidationAttempted: boolean = false;

  get linkItemRequired(): boolean {
    return !!this.linkRowGroup?.value.constructionId;
  }

  get linkAllocationQuantityInvalid(): boolean {
    const row = this.linkRowGroup?.value;
    if (!row) return false;
    const allocationQuantity = Number(row.allocationQuantity);
    return !(allocationQuantity > 0 && allocationQuantity <= Number(row.quantity));
  }

  saveLinkDialog() {
    const row = this.linkRowGroup?.value;
    if (row && this.linkItemRequired) {
      if (!row.budgetItemId) {
        this.linkValidationAttempted = true;
        this.messageService.add({ severity: 'warn', summary: 'Item obrigatório', detail: 'Selecione o Item da obra antes de guardar.' });
        return;
      }
      if (this.linkAllocationQuantityInvalid) {
        this.linkValidationAttempted = true;
        this.messageService.add({ severity: 'warn', summary: 'Quantidade inválida', detail: 'A quantidade alocada tem de ser maior que 0 e no máximo igual à quantidade do item.' });
        return;
      }
    }
    this.closeLinkDialog();
  }

  clearLinkFields() {
    if (this.linkDialogIndex === null) return;
    this.linkValidationAttempted = false;
    this.itemInputs.at(this.linkDialogIndex).patchValue({
      constructionId: null,
      budgetItemId: null,
      allocationQuantity: null,
      vehicleId: null,
    });
    this.linkBudgetTree = [];
    this.selectedLinkBudgetNode = undefined;
  }

  onLinkConstructionChange(constructionId: number, resetChildren: boolean = true) {
    const row = this.linkRowGroup?.value;
    if (resetChildren && this.linkDialogIndex !== null) {
      this.itemInputs.at(this.linkDialogIndex).patchValue({ budgetItemId: null });
      this.selectedLinkBudgetNode = undefined;
    }
    this.constructionService.getBudgetItemsForConstruction(constructionId).subscribe(budgetItems => {
      this.linkBudgetTree = this.mapBudgetItemsToTreeNodes(budgetItems);
      this.selectedLinkBudgetNode = resetChildren
        ? undefined
        : this.findBudgetTreeNode(this.linkBudgetTree, row?.budgetItemId);
    });
  }

  itemNetValue(index: number): number {
    return Number(this.itemInputs.at(index).get('value')?.value) || 0;
  }

  itemTotal(index: number): number {
    return Number(this.itemInputs.at(index).get('total')?.value) || 0;
  }

  fmt(n: number): string {
    return (n || 0).toLocaleString('de-DE', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    }) + ' €';
  }

  get netValue(): number {
    const servicesTotal = this.inputs.controls.reduce((sum, c) => sum + (Number(c.value.value) || 0), 0);
    const itemsTotal = this.itemInputs.controls.reduce((sum, _, index) => sum + this.itemNetValue(index), 0);
    return servicesTotal + itemsTotal;
  }

  get iva(): number {
    return this.itemInputs.controls.reduce((sum, _, index) => sum + (this.itemTotal(index) - this.itemNetValue(index)), 0);
  }

  get totalValue(): number {
    return this.netValue + this.iva;
  }

  get paymentValue(): number {
    return this.isIntegralPayment ? this.totalValue : this._paymentValue;
  }

  set paymentValue(v: number) {
    this._paymentValue = v;
  }

  private subCategoryKey(value: SubCategoryType): string {
    return Object.keys(SubCategoryType)[Object.values(SubCategoryType).indexOf(value)];
  }

  newExpense() {
    const itemList: ItemCreation[] = [];
    let item: ItemCreation;

    this.itemInputs.controls.forEach((control, index) => {
      const costAllocations: CostAllocationCreation[] = control.value.budgetItemId
        ? [{ budgetItemId: control.value.budgetItemId, quantity: control.value.allocationQuantity }]
        : [];

      item = {
        subCategoryType: this.subCategoryKey(control.value.subCategoryType),
        name: control.value.name,
        quantity: control.value.quantity,
        unit: control.value.unit,
        netValue: this.itemNetValue(index),
        iva: control.value.iva,
        totalValue: this.itemTotal(index),
        costAllocations: costAllocations,
        vehicleId: control.value.vehicleId
      } as ItemCreation;
      itemList.push(item);
    });

    this.expenseCreation = {
      date: this.date, originId: this.selectedOrigin, documentType: this.selectedDocumentType, documentNumber: this.documentNumber,
      paymentDeadline: this.paymentDeadline, netValue: this.netValue, iva: this.iva, totalValue: this.totalValue, isIntegralPayment: this.isIntegralPayment, paymentValue: this.paymentValue,
      accountId: this.selectedAccount, paymentMethod: this.selectedPaymentMethod, itemList: itemList
    } as ExpenseCreation;

    console.log(this.expenseCreation)

    this.expenseService.createExpense(this.expenseCreation).subscribe(newExpense => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Despesa adicionada com sucesso.' });
    })
  }

}
