import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { BudgetItemCreation } from 'src/app/demo/data/model/budgetItemCreation.model';
import { BudgetSubItemCreation } from 'src/app/demo/data/model/budgetSubItemCreation.model';
import { ConstructionCreation } from 'src/app/demo/data/model/constructionCreation.model';
import { VehicleCostCreation } from 'src/app/demo/data/model/vehicleCostCreation';
import { ClientService } from 'src/app/demo/service/company/clientService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { VehicleCostService } from 'src/app/demo/service/construction/vehicleCostService';
import { VehicleService } from 'src/app/demo/service/inventory/vehicle.service';

@Component({
  templateUrl: './create-construction.component.html',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateConstructionComponent {
[x: string]: any;

  clientNames!: ItemName[];

  dynamicForm!: FormGroup; // Your main form group

  name!: string;
  local!: string;
  selectedClient!: number;
  adjudicationDate!: Date;
  distance!: number;

  construction!: ConstructionCreation;

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

    this.dynamicForm = this.fb.group({
      inputs: this.fb.array([])
    });
  }

  back() {
    this._location.back();
  }

  get inputs(): FormArray {
    return (this.dynamicForm.get('inputs') as FormArray);
  }

  addInput() {
    let input = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      subInputs: this.fb.array([])
    });
    this.inputs.push(input);
  }

  removeInput(index: number): void {
    this.inputs.removeAt(index);
  }

  getSubInputs(index: number): FormArray {
    const inputFormGroup = this.inputs.at(index) as FormGroup;
    return inputFormGroup.get('subInputs') as FormArray;
  }

  addSubInput(index: number): void {
    /*const subInputs = this.getSubInputs(index);
    console.log(subInputs)
    subInputs.push(this.fb.group({
      subName: '',
      subValue: ''
    }));*/
    this.getSubInputs(index).push(this.fb.group({
      subName: '',
      subValue: ''
    }));
  }

  removeSubInput(index: number, subIndex: number): void {
    this.getSubInputs(index).removeAt(subIndex);
  }

  newConstruction() {
    console.log(this.inputs.controls);
    /*let budgetItems: BudgetItemCreation[] = [];
    let budgetSubItems: BudgetSubItemCreation[];
    let budgetItem: BudgetItemCreation;
    let budgetSubItem: BudgetSubItemCreation;
    
    this.inputs.controls.forEach((input) => {
      budgetSubItems = [];
      input.value.subInputs.forEach((subInput) => {
        budgetSubItem = { name: subInput.name, value: subInput.value };
        budgetSubItems.push(budgetSubItem);
      });
      budgetItem = { name: input.value.name, budgetSubItems: budgetSubItems };
      budgetItems.push(budgetItem);
    });

    this.construction = { name: this.name, local: this.local, clientId: this.selectedClient, adjudicationDate: this.adjudicationDate, distance: this.distance, budgetItems: budgetItems } as ConstructionCreation;

    if (this.construction != null) {
      this.constructionService.createConstruction(this.construction).subscribe(newConstruction => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Construção adicionada com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }*/
  }
  
}
