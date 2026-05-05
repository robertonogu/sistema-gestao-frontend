import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { ObjectName } from 'src/app/demo/api/objectName';
import { Origin } from 'src/app/demo/api/origin';
import { ArticleFamily } from 'src/app/demo/data/enum/articleFamily';
import { CategoryType } from 'src/app/demo/data/enum/categoryType';
import { DocumentType } from 'src/app/demo/data/enum/documentType';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { SubCategoryType } from 'src/app/demo/data/enum/subCategoryType';
import { Unit } from 'src/app/demo/data/enum/unit';
import { ArticleCreation } from 'src/app/demo/data/model/articleCreation.model';
import { ExpenseCreation } from 'src/app/demo/data/model/expenseCreation.model';
import { ExternalServiceCreation } from 'src/app/demo/data/model/externalServiceCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';

@Component({
  templateUrl: './create-expense.component.html',
  providers: [MessageService]
})

export class CreateExpenseComponent implements OnInit {

  categoriesAndSubCategories = {
    [CategoryType.BANK]: [SubCategoryType.MAINTENANCE_COMMISSIONS, SubCategoryType.IMMEDIATE_TRANSFERS, SubCategoryType.FEES, SubCategoryType.COMMISSIONS, SubCategoryType.CREDIT],
    [CategoryType.TAXES]: [SubCategoryType.IVA, SubCategoryType.IRC, SubCategoryType.FEES, SubCategoryType.IES, SubCategoryType.FONT_RETENTION],
    [CategoryType.PEOPLE]: [SubCategoryType.SALARIES, SubCategoryType.SOCIAL_SECURITY_CONTRIBUTIONS, SubCategoryType.IRS, SubCategoryType.COMPENSATION_FUNDS, SubCategoryType.INSURANCE, SubCategoryType.SAFETY],
    [CategoryType.OPERATION]: [SubCategoryType.ELECTRICITY, SubCategoryType.COMMUNICATIONS, SubCategoryType.CONSUMABLES],
    [CategoryType.VEHICLES]: [SubCategoryType.INSURANCE, SubCategoryType.IUC, SubCategoryType.FUEL, SubCategoryType.MAINTENANCE, SubCategoryType.INSPECTION, SubCategoryType.PARKING, SubCategoryType.TOLLS],
    [CategoryType.EQUIPMENTS]: [SubCategoryType.MAINTENANCE_EQUIPMENTS],
    [CategoryType.TOOLS]: [],
    [CategoryType.INVENTORY]: [SubCategoryType.FEEDSTOCK],
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
  selectedCategory!: SubCategoryType;
  selectedOrigin!: number;
  selectedDocumentType!: DocumentType;
  documentNumber!: string;
  paymentDeadline!: Date;
  value: number = 0;
  iva: number = 0;
  isIntegralPayment: boolean = false;
  paymentValue: number = 0;
  selectedAccount!: number;
  selectedPaymentMethod!: PaymentMethod;

  items!: MenuItem[];

  lunchVisible: boolean = false;
  dynamicForm: FormGroup;
  dynamicArticleForm: FormGroup;

  constructionNames!: ConstructionNames[];
  subItemOptions: ItemName[][] = [];

  articleFamilies = ArticleFamily;
  units = Unit;

  expenseCreation!: ExpenseCreation;

  constructor(
    private originService: OriginService,
    private accountService: AccountService,
    private constructionService: ConstructionService, 
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

    this.dynamicArticleForm = this.fb.group({
      articleInputs: this.fb.array([])
    });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Artigo',
        command: () => {
          this.addArticleInput();
        }
      },
      {
        label: 'Item',
        command: () => {

        }
      },
      {
        label: 'Serviço Externo',
        command: () => {
          this.addInput();
          this.getConstructionNames();
        }
      },
      {
        label: 'Almoço',
        command: () => {
          this.lunchVisible = true;
        }
      },
    ];

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

  changePaidValue() {
    if (this.isIntegralPayment) this.paymentValue = this.value + this.value * this.iva / 100;
  }

  changeIvaRate() {
    this.paymentValue = this.value + this.value * this.iva / 100;
  }

  onCheckboxChange() {
    if (this.isIntegralPayment) {
      this.disablePaidValue = true;
      this.disablePaymentDeadline = true;
      this.paymentDeadline ;
      this.paymentValue = this.value + this.value * this.iva / 100;
    }
    else {
      this.disablePaidValue = false;
      this.disablePaymentDeadline = false;
      this.paymentValue = 0;
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

  removeInput(index: number) {
    this.inputs.removeAt(index);
  }

  get articleInputs(): FormArray {
    return this.dynamicArticleForm.get('articleInputs') as FormArray;
  }

  addArticleInput() {
    this.articleInputs.push(this.fb.group({
      family: [null, Validators.required],
      name: [null, Validators.required],
      quantity: [null, Validators.required],
      unit: [null, Validators.required],
      value: [null, Validators.required],
    }));
  }

  removeArticleInput(index: number) {
    this.articleInputs.removeAt(index);
  }

  newExpense() {
    let subCategory = Object.keys(SubCategoryType)[Object.values(SubCategoryType).indexOf(this.selectedCategory)];
    
    const externalServiceList: ExternalServiceCreation[] = [];
    const articleList: ArticleCreation[] = [];
    let externalService: ExternalServiceCreation;
    let article: ArticleCreation;

    this.inputs.controls.forEach((control) => {
      externalService = { 
        constructionId: control.value.constructionId, budgetSubItemId: control.value.budgetSubItemId, 
        description: control.value.description, value: control.value.value 
      } as ExternalServiceCreation;
      externalServiceList.push(externalService);
    });

    this.articleInputs.controls.forEach((control) => {
      article = { 
        articleFamily: control.value.family,
        name: control.value.name,
        quantity: control.value.quantity,
        unit: control.value.unit,
        unitValue: control.value.value
      } as ArticleCreation;
      articleList.push(article);
    });

    this.expenseCreation = { 
      date: this.date, subCategoryType: subCategory, originId: this.selectedOrigin, documentType: this.selectedDocumentType, documentNumber: this.documentNumber, 
      paymentDeadline: this.paymentDeadline, value: this.value, iva: this.iva, isIntegralPayment: this.isIntegralPayment, paymentValue: this.paymentValue, 
      accountId: this.selectedAccount, paymentMethod: this.selectedPaymentMethod, externalServiceList: externalServiceList, articleList: articleList
    } as ExpenseCreation;

    console.log(this.expenseCreation)

    this.expenseService.createExpense(this.expenseCreation).subscribe(newExpense => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Despesa adicionada com sucesso.' });
    })
  }

}
