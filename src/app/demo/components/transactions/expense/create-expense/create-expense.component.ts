import { Location } from '@angular/common';
import { ExpenseItemName } from 'src/app/demo/api/expenseItemName';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { AccountName } from 'src/app/demo/api/accountName';
import { BudgetItem } from 'src/app/demo/api/budgetItem';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ExpenseEdit, ExpenseItemEdit } from 'src/app/demo/api/expenseEdit';
import { ItemName } from 'src/app/demo/api/itemName';
import { Origin } from 'src/app/demo/api/origin';
import { EXPENSE_CATEGORIES } from 'src/app/demo/data/expenseCategories';
import { CategoryType } from 'src/app/demo/data/enum/categoryType';
import { DocumentType } from 'src/app/demo/data/enum/documentType';
import { EquipmentStatus } from 'src/app/demo/data/enum/equipmentStatus';
import { PaymentCondition, PAYMENT_CONDITION_DAYS } from 'src/app/demo/data/enum/paymentCondition';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { SubCategoryType } from 'src/app/demo/data/enum/subCategoryType';
import { ToolStatus } from 'src/app/demo/data/enum/toolStatus';
import { Unit } from 'src/app/demo/data/enum/unit';
import { CostAllocationCreation } from 'src/app/demo/data/model/costAllocationCreation.model';
import { EquipmentCreation } from 'src/app/demo/data/model/equipmentCreation.model';
import { ExpenseCreation } from 'src/app/demo/data/model/expenseCreation.model';
import { ExternalEntityCreation } from 'src/app/demo/data/model/externalEntityCreation.model';
import { ItemCreation } from 'src/app/demo/data/model/itemCreation.model';
import { SupplierCreation } from 'src/app/demo/data/model/supplierCreation.model';
import { ToolCreation } from 'src/app/demo/data/model/toolCreation.model';
import { AccountService, CASH_PAYMENT_METHOD_KEY, getPaymentMethodEntries } from 'src/app/demo/service/company/accountService';
import { ExternalEntityService } from 'src/app/demo/service/company/externalEntityService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { SupplierService } from 'src/app/demo/service/company/supplierService';
import { PaymentService } from 'src/app/demo/service/transactions/paymentService';
import { ExpensePayment } from 'src/app/demo/api/payment';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { EquipmentService } from 'src/app/demo/service/inventory/equipment.service';
import { ToolService } from 'src/app/demo/service/inventory/tool.service';
import { VehicleService } from 'src/app/demo/service/inventory/vehicle.service';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';

@Component({
  templateUrl: './create-expense.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
.section-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-color, #495057);
}

.section-title + div {
  padding-top: 0.75rem;
}

:host ::ng-deep .origin-dropdown {
  min-width: 0;
}

:host ::ng-deep .origin-dropdown .p-dropdown-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:host {
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
  grid-template-columns: 36px minmax(420px, 2fr) 320px 90px 130px 130px 130px 130px 200px 84px;
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
.item-col-actions {
  display: flex; align-items: center; justify-content: center; gap: 2px;
  padding-left: 4px !important; padding-right: 4px !important;

  .assoc-icon { font-size: 12px; flex-shrink: 0; }
}

:host ::ng-deep .item-col-actions .p-button.p-button-icon-only {
  width: 1.75rem;
  height: 1.75rem;

  .p-button-icon { font-size: 12px; }
}

// Item name autocomplete fills its whole column (PrimeNG's wrapper otherwise shrinks to its content)
:host ::ng-deep .item-row p-autocomplete,
:host ::ng-deep .item-row .p-autocomplete {
  display: flex;
  width: 100%;
}

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

  input.p-inputtext.ng-invalid.ng-touched,
  p-inputnumber.ng-invalid.ng-touched input,
  p-dropdown.ng-invalid.ng-touched > .p-dropdown {
    border-color: #f44336 !important;
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

  categoriesAndSubCategories = EXPENSE_CATEGORIES;

  categories: any[] = [];
  origins: Origin[] = [];
  // O "Saldo Inicial" é criado a partir da ficha do fornecedor/funcionário/entidade, não no formulário de despesas
  documentTypes = Object.fromEntries(Object.entries(DocumentType).filter(([key]) => key !== 'OPENING_BALANCE'));
  validIvaRates: number[];
  disablePaidValue: boolean = false;
  accountNames: AccountName[] = [];
  paymentMethods = PaymentMethod;
  paymentConditions = PaymentCondition;

  date!: Date;
  selectedOrigin!: number;
  selectedDocumentType!: DocumentType;
  documentNumber!: string;
  selectedPaymentCondition!: PaymentCondition;
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

  bulkAssociateDialogVisible: boolean = false;
  bulkAssociateConstructionId: number | null = null;
  bulkAssociateBudgetTree: TreeNode[] = [];
  selectedBulkAssociateBudgetNode?: TreeNode;
  bulkAssociateValidationAttempted: boolean = false;
  // Categoria comum dos itens selecionados: define a que se associam (obra, veículo, equipamento ou ferramenta)
  bulkAssociateCategory: CategoryType | null = null;
  bulkAssociateVehicleId: number | null = null;
  bulkAssociateEquipmentId: number | null = null;
  bulkAssociateToolId: number | null = null;

  vehicleNames: ItemName[] = [];
  toolNames: ItemName[] = [];
  equipmentNames: ItemName[] = [];
  // Names of items already used in expenses, and the subcategory (enum key) last used for each
  itemNames: string[] = [];
  filteredItemNames: string[] = [];
  // Última utilização de cada item (subcategoria, unidade e IVA), por nome em maiúsculas
  private lastUseByItemName = new Map<string, ExpenseItemName>();

  quickAddOriginOptions: MenuItem[] = [
    { label: 'Fornecedor', icon: 'pi pi-truck', command: () => this.openQuickAddOrigin('supplier') },
    { label: 'Entidade Externa', icon: 'pi pi-building', command: () => this.openQuickAddOrigin('externalEntity') },
  ];

  quickAddOriginDialogVisible: boolean = false;
  quickAddOriginType: 'supplier' | 'externalEntity' | null = null;
  quickAddOriginSubmitted: boolean = false;
  quickAddOriginName: string | null = null;
  quickAddOriginNif: number | null = null;

  quickAddToolEquipmentDialogVisible: boolean = false;
  quickAddToolEquipmentType: 'tool' | 'equipment' | null = null;
  quickAddToolEquipmentSubmitted: boolean = false;
  quickAddToolEquipmentName: string | null = null;

  editingExpenseId?: number;

  // Pagamentos da despesa em edição (cada um é um documento de pagamento, que pode liquidar outras faturas)
  expensePayments: ExpensePayment[] = [];
  loadingEdit: boolean = false;

  constructor(
    private originService: OriginService,
    private accountService: AccountService,
    private constructionService: ConstructionService,
    private vehicleService: VehicleService,
    private toolService: ToolService,
    private equipmentService: EquipmentService,
    private expenseService: ExpenseService,
    private supplierService: SupplierService,
    private paymentService: PaymentService,
    private confirmationService: ConfirmationService,
    private externalEntityService: ExternalEntityService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;
    });

    this.accountService.getAccountNamesWithType().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });

    this.expenseService.getUsedItemNames().subscribe((items) => {
      this.itemNames = items.map(item => item.name);
      this.lastUseByItemName = new Map(items.map(item => [item.name.toUpperCase(), item]));
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
    this.getConstructionNames();
    this.vehicleService.getActiveVehicleNames().subscribe(names => this.vehicleNames = names);
    this.toolService.getActiveToolNames().subscribe(names => this.toolNames = names);
    this.equipmentService.getActiveEquipmentNames().subscribe(names => this.equipmentNames = names);

    this.categories = this.transformCategoriesAndSubCategories(this.categoriesAndSubCategories);

    const expenseId = Number(this.route.snapshot.params['expenseId']);
    if (expenseId) {
      this.editingExpenseId = expenseId;
      this.loadExpensePayments();
      this.loadingEdit = true;
      this.expenseService.getExpenseForEdit(expenseId).subscribe({
        next: (expenseEdit) => {
          this.populateFormForEdit(expenseEdit);
          this.loadingEdit = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar a despesa.' });
          this.loadingEdit = false;
        }
      });
    }
  }

  private populateFormForEdit(expenseEdit: ExpenseEdit): void {
    this.date = new Date(expenseEdit.date);
    this.selectedDocumentType = expenseEdit.documentType;
    this.documentNumber = expenseEdit.documentNumber;
    this.selectedOrigin = expenseEdit.originId as any;
    this.selectedPaymentCondition = expenseEdit.paymentCondition;
    this.paymentDeadline = expenseEdit.paymentDeadline ? new Date(expenseEdit.paymentDeadline) : undefined as any;

    this.itemInputs.clear();
    for (const item of expenseEdit.itemList) {
      this.itemInputs.push(this.buildItemInputFromEdit(item));
    }
    if (this.itemInputs.length === 0) {
      this.itemInputs.push(this.buildItemInput());
    }
  }

  private buildItemInputFromEdit(item: ExpenseItemEdit): FormGroup {
    const costAllocation = item.costAllocations?.[0];
    const subCategoryType = (SubCategoryType as any)[item.subCategoryType] ?? null;
    const isSelectable = this.isBulkAssociable(subCategoryType);

    const group = this.fb.group({
      subCategoryType: [subCategoryType, Validators.required],
      name: [item.name, Validators.required],
      quantity: [item.quantity, Validators.required],
      unit: [item.unit, Validators.required],
      value: [item.netValue, Validators.required],
      total: [item.totalValue, Validators.required],
      iva: [item.iva, Validators.required],
      constructionId: [item.constructionId ?? null],
      budgetItemId: [costAllocation?.budgetItemId ?? null],
      allocationQuantity: [costAllocation?.quantity ?? null],
      vehicleId: [item.vehicleId ?? null],
      toolId: [item.toolId ?? null],
      equipmentId: [item.equipmentId ?? null],
      associationName: [item.associationName ?? null],
      selected: [{ value: false, disabled: !isSelectable }],
    });
    this.wireSelectedDisabling(group);
    this.wirePurchaseLinkReset(group);
    return group;
  }

  back() {
    this._location.back();
  }

  paymentMethodLabel(key: string): string {
    return (PaymentMethod as any)[key] ?? key;
  }

  private loadExpensePayments(): void {
    if (!this.editingExpenseId) return;
    this.paymentService.getPaymentsForExpense(this.editingExpenseId).subscribe(payments => this.expensePayments = payments);
  }

  newExpensePayment(): void {
    this.router.navigate(['/transactions/payments/create-payment'], {
      queryParams: { originId: this.selectedOrigin, expenseId: this.editingExpenseId }
    });
  }

  editExpensePayment(payment: ExpensePayment): void {
    this.router.navigate(['/transactions/payments/edit-payment', payment.paymentDocumentId]);
  }

  deleteExpensePayment(payment: ExpensePayment): void {
    const shared = payment.documentValue > payment.value + 0.005;
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar este pagamento?',
      message: shared
        ? 'Este pagamento também liquida outras faturas, que voltam igualmente a ficar em dívida. Os lançamentos na conta e na conta corrente são removidos.'
        : 'A fatura volta a ficar em dívida pelo valor pago e os lançamentos na conta e na conta corrente são removidos.',
      accept: () => {
        this.paymentService.deletePayment(payment.paymentDocumentId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento eliminado com sucesso.' });
            this.loadExpensePayments();
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível eliminar o pagamento.' })
        });
      }
    });
  }

  get quickAddOriginTitle(): string {
    switch (this.quickAddOriginType) {
      case 'supplier': return 'Novo Fornecedor';
      case 'externalEntity': return 'Nova Entidade Externa';
      default: return '';
    }
  }

  openQuickAddOrigin(type: 'supplier' | 'externalEntity'): void {
    this.quickAddOriginType = type;
    this.quickAddOriginSubmitted = false;
    this.quickAddOriginName = null;
    this.quickAddOriginNif = null;
    this.quickAddOriginDialogVisible = true;
  }

  closeQuickAddOrigin(): void {
    this.quickAddOriginDialogVisible = false;
    this.quickAddOriginType = null;
  }

  private afterOriginCreated(originId: number): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Origem criada com sucesso.' });
    this.quickAddOriginDialogVisible = false;
    this.originService.getOriginsGrouped().subscribe(origins => {
      this.origins = origins;
      this.selectedOrigin = originId;
    });
  }

  saveQuickAddOrigin(): void {
    this.quickAddOriginSubmitted = true;
    if (!this.quickAddOriginName?.trim()) return;

    const name = this.quickAddOriginName;
    const nif = this.quickAddOriginNif as number;

    if (this.quickAddOriginType === 'supplier') {
      // Criado a partir da despesa só com nome e NIF; as localizações são geridas na ficha do fornecedor
      this.supplierService.createSupplier({ name, nif } as SupplierCreation)
        .subscribe({
          next: supplier => this.afterOriginCreated(supplier.originId),
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível criar o fornecedor.' })
        });
    } else if (this.quickAddOriginType === 'externalEntity') {
      this.externalEntityService.createExternalEntity({ name, nif } as ExternalEntityCreation)
        .subscribe(externalEntity => this.afterOriginCreated(externalEntity.originId));
    }
  }

  get quickAddToolEquipmentTitle(): string {
    switch (this.quickAddToolEquipmentType) {
      case 'tool': return 'Nova Ferramenta';
      case 'equipment': return 'Novo Equipamento';
      default: return '';
    }
  }

  openQuickAddToolEquipment(type: 'tool' | 'equipment'): void {
    this.quickAddToolEquipmentType = type;
    this.quickAddToolEquipmentSubmitted = false;
    this.quickAddToolEquipmentName = null;
    this.quickAddToolEquipmentDialogVisible = true;
  }

  closeQuickAddToolEquipment(): void {
    this.quickAddToolEquipmentDialogVisible = false;
    this.quickAddToolEquipmentType = null;
  }

  saveQuickAddToolEquipment(): void {
    this.quickAddToolEquipmentSubmitted = true;
    if (!this.quickAddToolEquipmentName?.trim()) return;

    const name = this.quickAddToolEquipmentName;

    if (this.quickAddToolEquipmentType === 'tool') {
      this.toolService.createTool({ name, status: ToolStatus.AVAILABLE } as ToolCreation)
        .subscribe(tool => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ferramenta criada com sucesso.' });
          this.quickAddToolEquipmentDialogVisible = false;
          this.toolNames = [...this.toolNames, { id: tool.toolId, name: tool.name }];
          this.linkRowGroup?.patchValue({ toolId: tool.toolId });
        });
    } else if (this.quickAddToolEquipmentType === 'equipment') {
      this.equipmentService.createEquipment({ name, status: EquipmentStatus.ACTIVE } as EquipmentCreation)
        .subscribe(equipment => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Equipamento criado com sucesso.' });
          this.quickAddToolEquipmentDialogVisible = false;
          this.equipmentNames = [...this.equipmentNames, { id: equipment.equipmentId, name: equipment.name }];
          this.linkRowGroup?.patchValue({ equipmentId: equipment.equipmentId });
        });
    }
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
    }
    else {
      this.disablePaidValue = false;
      this._paymentValue = this.totalValue;
    }
  }

  isCashAccountSelected: boolean = false;
  paymentMethodOptions: { key: string; value: string }[] = getPaymentMethodEntries(undefined);

  private get selectedAccountObj(): AccountName | undefined {
    return this.accountNames.find(account => account.objectId === this.selectedAccount);
  }

  private refreshPaymentMethodOptions(): void {
    const cashBox = this.selectedAccountObj?.cashBox;
    this.isCashAccountSelected = !!cashBox;
    this.paymentMethodOptions = getPaymentMethodEntries(cashBox);
  }

  onAccountChange() {
    this.refreshPaymentMethodOptions();
    if (this.isCashAccountSelected) {
      this.selectedPaymentMethod = CASH_PAYMENT_METHOD_KEY;
    } else if ((this.selectedPaymentMethod as unknown as string) === 'CASH') {
      this.selectedPaymentMethod = undefined as any;
    }
  }

  onPaymentConditionChange() {
    if ((this.selectedPaymentCondition as unknown as string) === 'IMMEDIATE') {
      this.isIntegralPayment = true;
      this.disablePaidValue = true;
    } else {
      this.isIntegralPayment = false;
      this.disablePaidValue = false;
      this.paymentValue = 0;
    }
    this.recalculatePaymentDeadline();
  }

  get isOtherPaymentCondition(): boolean {
    return (this.selectedPaymentCondition as unknown as string) === 'OTHER';
  }

  onDateChange() {
    this.recalculatePaymentDeadline();
  }

  private recalculatePaymentDeadline(): void {
    if (this.isOtherPaymentCondition) {
      this.paymentDeadline = undefined as any;
      return;
    }

    const conditionKey = this.selectedPaymentCondition as unknown as string;
    if (!this.date || !conditionKey || !(conditionKey in PAYMENT_CONDITION_DAYS)) {
      this.paymentDeadline = undefined as any;
      return;
    }

    const deadline = new Date(this.date);
    deadline.setDate(deadline.getDate() + PAYMENT_CONDITION_DAYS[conditionKey]);
    this.paymentDeadline = deadline;
  }

  originalOrder = (): number => 0;

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
    const group = this.fb.group({
      subCategoryType: [null, Validators.required],
      name: [null, Validators.required],
      quantity: [null, Validators.required],
      unit: [null, Validators.required],
      value: [null, Validators.required],
      total: [null, Validators.required],
      iva: [0, Validators.required],
      constructionId: [null],
      budgetItemId: [null],
      allocationQuantity: [null],
      vehicleId: [null],
      toolId: [null],
      equipmentId: [null],
      selected: [{ value: false, disabled: true }],
    });
    this.wireSelectedDisabling(group);
    this.wirePurchaseLinkReset(group);
    return group;
  }

  // Controla o disabled do checkbox "selected" via FormControl.disable()/enable() em vez de um
  // binding [disabled] no template, que não é fiável quando combinado com formControlName no Angular.
  private wireSelectedDisabling(group: FormGroup): void {
    group.get('subCategoryType')?.valueChanges.subscribe((value) => {
      const selectedControl = group.get('selected');
      if (this.isBulkAssociable(value)) {
        selectedControl?.enable({ emitEvent: false });
      } else {
        selectedControl?.disable({ emitEvent: false });
        selectedControl?.setValue(false, { emitEvent: false });
      }
    });
  }

  // Moving a line into or out of a purchase subcategory drops its links: a purchase gets a new tool/equipment
  // created by the backend, and a line that stops being a purchase no longer owns the one it had created
  // (the backend deletes it when saving).
  private wirePurchaseLinkReset(group: FormGroup): void {
    let previous = group.get('subCategoryType')?.value ?? null;
    group.get('subCategoryType')?.valueChanges.subscribe((value) => {
      const touchesPurchase = this.isNonAssociable(value) || this.isNonAssociable(previous);
      previous = value;
      if (!touchesPurchase) return;
      group.patchValue({
        constructionId: null,
        budgetItemId: null,
        allocationQuantity: null,
        vehicleId: null,
        toolId: null,
        equipmentId: null,
      }, { emitEvent: false });
    });
  }

  // ===== "select all" checkbox in the items header (only rows whose checkbox is enabled, i.e. inventory items) =====
  private get selectableItemControls() {
    return this.itemInputs.controls
      .map(control => control.get('selected'))
      .filter(control => !!control && control.enabled);
  }

  get hasSelectableItems(): boolean {
    return this.selectableItemControls.length > 0;
  }

  get allSelectableItemsSelected(): boolean {
    const selectable = this.selectableItemControls;
    return selectable.length > 0 && selectable.every(control => control!.value === true);
  }

  toggleSelectAllItems(checked: boolean) {
    this.selectableItemControls.forEach(control => control!.setValue(checked));
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

  filterItemNames(event: { query: string }) {
    const query = (event.query ?? '').toUpperCase();
    this.filteredItemNames = this.itemNames.filter((name) => name.toUpperCase().includes(query));
  }

  // Picking an item already used fills in the subcategory, unit and VAT rate it had the last time
  onItemNameSelect(index: number, event: { value: string }) {
    const lastUse = this.lastUseByItemName.get((event.value ?? '').toUpperCase());
    if (!lastUse) return;

    const row = this.itemInputs.at(index);
    const subCategoryType = lastUse.subCategoryType ? (SubCategoryType as any)[lastUse.subCategoryType] : null;
    if (subCategoryType) {
      row.get('subCategoryType')?.setValue(subCategoryType);
    }
    if (lastUse.unit) {
      row.get('unit')?.setValue(lastUse.unit);
    }
    if (lastUse.iva != null && this.validIvaRates.includes(lastUse.iva)) {
      row.get('iva')?.setValue(lastUse.iva);
      this.onItemIvaChange(index);
    }
  }

  showConstructionLink(subCategoryType: SubCategoryType | null): boolean {
    return subCategoryType === SubCategoryType.EXTERNAL_SERVICES || subCategoryType === SubCategoryType.MEALS || this.categoryOf(subCategoryType) === CategoryType.INVENTORY;
  }

  showBudgetItemLink(subCategoryType: SubCategoryType | null): boolean {
    return this.showConstructionLink(subCategoryType) && subCategoryType !== SubCategoryType.MEALS;
  }

  showVehicleLink(subCategoryType: SubCategoryType | null): boolean {
    return this.categoryOf(subCategoryType) === CategoryType.VEHICLES;
  }

  showToolLink(subCategoryType: SubCategoryType | null): boolean {
    return this.categoryOf(subCategoryType) === CategoryType.TOOLS;
  }

  showEquipmentLink(subCategoryType: SubCategoryType | null): boolean {
    return this.categoryOf(subCategoryType) === CategoryType.EQUIPMENTS;
  }

  showToolEquipmentLink(subCategoryType: SubCategoryType | null): boolean {
    return this.showToolLink(subCategoryType) || this.showEquipmentLink(subCategoryType);
  }

  showToolPurchaseLink(subCategoryType: SubCategoryType | null): boolean {
    return subCategoryType === SubCategoryType.TOOLS_PURCHASE;
  }

  // Aquisições que criam automaticamente um equipamento ao guardar (igual ao backend)
  private readonly equipmentPurchaseSubCategories: SubCategoryType[] = [
    SubCategoryType.EQUIPMENTS_PURCHASE,
    SubCategoryType.OFFICE_EQUIPMENT_ACQUISITION,
  ];

  showEquipmentPurchaseLink(subCategoryType: SubCategoryType | null): boolean {
    return subCategoryType !== null && this.equipmentPurchaseSubCategories.includes(subCategoryType);
  }

  // Purchases of equipment/tools cannot be associated manually: the backend creates the tool/equipment and links it
  private readonly nonAssociableSubCategories: SubCategoryType[] = [
    SubCategoryType.EQUIPMENTS_PURCHASE,
    SubCategoryType.OFFICE_EQUIPMENT_ACQUISITION,
    SubCategoryType.TOOLS_PURCHASE,
    SubCategoryType.ELECTRIC_TOOLS_PURCHASE,
  ];

  isNonAssociable(subCategoryType: SubCategoryType | null): boolean {
    return subCategoryType !== null && this.nonAssociableSubCategories.includes(subCategoryType);
  }

  autoPurchaseTooltip(index: number): string {
    const row = this.itemInputs.at(index).value;
    const isEquipment = this.showEquipmentPurchaseLink(row.subCategoryType);
    const alreadyCreated = isEquipment ? !!row.equipmentId : !!row.toolId;
    if (isEquipment) {
      return alreadyCreated ? 'Associado ao equipamento criado com esta despesa' : 'Será criado um equipamento ao guardar';
    }
    return alreadyCreated ? 'Associado à ferramenta criada com esta despesa' : 'Será criada uma ferramenta ao guardar';
  }

  canOpenLinkDialog(subCategoryType: SubCategoryType | null): boolean {
    if (this.isNonAssociable(subCategoryType)) return false;
    return this.showConstructionLink(subCategoryType) || this.showVehicleLink(subCategoryType) || this.showToolEquipmentLink(subCategoryType);
  }

  rowHasAssociation(index: number): boolean {
    const row = this.itemInputs.at(index).value;
    const subCategoryType = row.subCategoryType;

    if (this.showConstructionLink(subCategoryType)) {
      return this.showBudgetItemLink(subCategoryType)
        ? !!row.constructionId && !!row.budgetItemId
        : !!row.constructionId;
    }

    if (this.showVehicleLink(subCategoryType)) {
      return !!row.vehicleId;
    }

    if (this.showToolEquipmentLink(subCategoryType)) {
      return !!row.toolId || !!row.equipmentId;
    }

    return false;
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
      if (this.showBudgetItemLink(subCategoryType)) {
        if (row.constructionId) this.onLinkConstructionChange(row.constructionId, false);
        if (row.allocationQuantity == null) {
          this.itemInputs.at(index).patchValue({ allocationQuantity: row.quantity });
        }
      }
    }

    if (this.showVehicleLink(subCategoryType) && this.vehicleNames.length === 0) {
      this.vehicleService.getActiveVehicleNames().subscribe(names => this.vehicleNames = names);
    }

    if (this.showToolLink(subCategoryType) && this.toolNames.length === 0) {
      this.toolService.getActiveToolNames().subscribe(names => this.toolNames = names);
    }

    if (this.showEquipmentLink(subCategoryType) && this.equipmentNames.length === 0) {
      this.equipmentService.getActiveEquipmentNames().subscribe(names => this.equipmentNames = names);
    }
  }

  closeLinkDialog() {
    this.linkDialogVisible = false;
    this.linkDialogIndex = null;
  }

  linkValidationAttempted: boolean = false;

  get linkItemRequired(): boolean {
    return !!this.linkRowGroup?.value.constructionId && this.showBudgetItemLink(this.linkRowSubCategory);
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
      toolId: null,
      equipmentId: null,
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

  // Nome do que está associado ao item (coluna "Associado a"): usa as listas carregadas, para refletir
  // alterações feitas no formulário, e o nome vindo da despesa para associações já inativas
  associationLabel(index: number): string {
    const row = this.itemInputs.at(index).value;
    const original = this.itemInputs.at(index).get('associationName')?.value ?? null;
    if (row.vehicleId) return this.vehicleNames.find(v => v.id === row.vehicleId)?.name ?? original ?? '';
    if (row.equipmentId) return this.equipmentNames.find(e => e.id === row.equipmentId)?.name ?? original ?? '';
    if (row.toolId) return this.toolNames.find(t => t.id === row.toolId)?.name ?? original ?? '';
    if (row.constructionId) return this.constructionNames?.find(c => c.constructionId === row.constructionId)?.name ?? original ?? '';
    return '';
  }

  // Categorias cujos itens se podem associar em conjunto (as aquisições ficam de fora: criam o seu próprio equipamento/ferramenta)
  private readonly bulkAssociableCategories: CategoryType[] = [
    CategoryType.INVENTORY, CategoryType.VEHICLES, CategoryType.EQUIPMENTS, CategoryType.TOOLS
  ];

  isBulkAssociable(subCategoryType: SubCategoryType | null): boolean {
    const category = this.categoryOf(subCategoryType);
    return !!category && this.bulkAssociableCategories.includes(category) && !this.isNonAssociable(subCategoryType);
  }

  private get selectedItemControls() {
    return this.itemInputs.controls.filter(control => control.value.selected && this.isBulkAssociable(control.value.subCategoryType));
  }

  get bulkAssociateTitle(): string {
    switch (this.bulkAssociateCategory) {
      case CategoryType.VEHICLES: return 'Associar Itens a um Veículo';
      case CategoryType.EQUIPMENTS: return 'Associar Itens a um Equipamento';
      case CategoryType.TOOLS: return 'Associar Itens a uma Ferramenta';
      default: return 'Associar Itens a uma Obra';
    }
  }

  get bulkAssociatesToConstruction(): boolean {
    return this.bulkAssociateCategory === CategoryType.INVENTORY;
  }

  get bulkAssociatesToVehicle(): boolean {
    return this.bulkAssociateCategory === CategoryType.VEHICLES;
  }

  get bulkAssociatesToEquipment(): boolean {
    return this.bulkAssociateCategory === CategoryType.EQUIPMENTS;
  }

  get bulkAssociatesToTool(): boolean {
    return this.bulkAssociateCategory === CategoryType.TOOLS;
  }

  openBulkAssociateDialog() {
    const selected = this.selectedItemControls;
    if (selected.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Nenhum item selecionado', detail: 'Selecione pelo menos um item de Inventário, Veículos, Equipamentos ou Ferramentas para associar.' });
      return;
    }

    const categories = new Set(selected.map(control => this.categoryOf(control.value.subCategoryType)));
    if (categories.size > 1) {
      this.messageService.add({ severity: 'warn', summary: 'Categorias diferentes', detail: 'Os itens selecionados têm de ser todos da mesma categoria para os associar.' });
      return;
    }

    this.bulkAssociateCategory = [...categories][0] ?? null;
    this.bulkAssociateValidationAttempted = false;
    this.bulkAssociateConstructionId = null;
    this.bulkAssociateBudgetTree = [];
    this.selectedBulkAssociateBudgetNode = undefined;
    this.bulkAssociateVehicleId = null;
    this.bulkAssociateEquipmentId = null;
    this.bulkAssociateToolId = null;

    if (this.bulkAssociatesToVehicle && this.vehicleNames.length === 0) {
      this.vehicleService.getActiveVehicleNames().subscribe(names => this.vehicleNames = names);
    } else if (this.bulkAssociatesToEquipment && this.equipmentNames.length === 0) {
      this.equipmentService.getActiveEquipmentNames().subscribe(names => this.equipmentNames = names);
    } else if (this.bulkAssociatesToTool && this.toolNames.length === 0) {
      this.toolService.getActiveToolNames().subscribe(names => this.toolNames = names);
    } else if (this.bulkAssociatesToConstruction) {
      this.getConstructionNames();
    }
    this.bulkAssociateDialogVisible = true;
  }

  closeBulkAssociateDialog() {
    this.bulkAssociateDialogVisible = false;
  }

  onBulkAssociateConstructionChange(constructionId: number) {
    this.selectedBulkAssociateBudgetNode = undefined;
    this.constructionService.getBudgetItemsForConstruction(constructionId).subscribe(budgetItems => {
      this.bulkAssociateBudgetTree = this.mapBudgetItemsToTreeNodes(budgetItems);
    });
  }

  saveBulkAssociateDialog() {
    const selected = this.selectedItemControls;

    if (this.bulkAssociatesToConstruction) {
      if (!this.bulkAssociateConstructionId || !this.selectedBulkAssociateBudgetNode) {
        this.bulkAssociateValidationAttempted = true;
        this.messageService.add({ severity: 'warn', summary: 'Campos obrigatórios', detail: 'Selecione a Obra e o Item antes de guardar.' });
        return;
      }
      const budgetItemId = this.selectedBulkAssociateBudgetNode.data;
      selected.forEach(control => control.patchValue({
        constructionId: this.bulkAssociateConstructionId,
        budgetItemId: budgetItemId,
        allocationQuantity: control.value.quantity,
        selected: false
      }));
    } else {
      const targetId = this.bulkAssociatesToVehicle ? this.bulkAssociateVehicleId
        : this.bulkAssociatesToEquipment ? this.bulkAssociateEquipmentId : this.bulkAssociateToolId;
      if (!targetId) {
        this.bulkAssociateValidationAttempted = true;
        this.messageService.add({ severity: 'warn', summary: 'Campo obrigatório', detail: 'Selecione a que associar os itens antes de guardar.' });
        return;
      }
      const field = this.bulkAssociatesToVehicle ? 'vehicleId' : this.bulkAssociatesToEquipment ? 'equipmentId' : 'toolId';
      selected.forEach(control => control.patchValue({ [field]: targetId, selected: false }));
    }

    this.closeBulkAssociateDialog();
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
    if (this.dynamicItemForm.invalid) {
      this.dynamicItemForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Campos obrigatórios', detail: 'Preencha todos os campos obrigatórios dos itens.' });
      return;
    }

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
        constructionId: control.value.budgetItemId ? undefined : (control.value.constructionId ?? undefined),
        vehicleId: control.value.vehicleId,
        toolId: control.value.toolId,
        equipmentId: control.value.equipmentId
      } as ItemCreation;
      itemList.push(item);
    });

    this.expenseCreation = {
      date: this.date, originId: this.selectedOrigin, documentType: this.selectedDocumentType, documentNumber: this.documentNumber,
      paymentCondition: this.selectedPaymentCondition, paymentDeadline: this.paymentDeadline, netValue: this.netValue, iva: this.iva, totalValue: this.totalValue, isIntegralPayment: this.isIntegralPayment, paymentValue: this.paymentValue,
      accountId: this.selectedAccount, paymentMethod: this.selectedPaymentMethod, itemList: itemList
    } as ExpenseCreation;

    if (this.editingExpenseId) {
      this.expenseService.updateExpense(this.editingExpenseId, this.expenseCreation).subscribe({
        next: () => {
          this.router.navigate(['/transactions/expenses'], { state: { expenseUpdated: true } });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível atualizar a despesa.' });
        }
      });
      return;
    }

    this.expenseService.createExpense(this.expenseCreation).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Despesa adicionada com sucesso.' });
        this.resetForm();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível adicionar a despesa.' });
      }
    });
  }

  private resetForm(): void {
    this.date = undefined as any;
    this.selectedOrigin = undefined as any;
    this.selectedDocumentType = undefined as any;
    this.documentNumber = undefined as any;
    this.selectedPaymentCondition = undefined as any;
    this.paymentDeadline = undefined as any;
    this.isIntegralPayment = false;
    this.paymentValue = 0;
    this.disablePaidValue = false;
    this.selectedAccount = undefined as any;
    this.selectedPaymentMethod = undefined as any;
    this.refreshPaymentMethodOptions();

    this.inputs.clear();

    this.itemInputs.clear();
    this.itemInputs.push(this.buildItemInput());
  }

}
