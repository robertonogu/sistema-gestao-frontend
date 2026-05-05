import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { Unit } from 'src/app/demo/data/enum/unit';
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

    units = Unit;

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

  asFormGroup(control: AbstractControl): FormGroup {
  return control as FormGroup;
}

  get inputs(): FormArray {
    return (this.dynamicForm.get('inputs') as FormArray);
  }

  addInput() {
    let input = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      value: ['', Validators.required],
      unit:['', Validators.required],
      subInputs: this.fb.array([])
    });
    this.inputs.push(input);

    (input.get('subInputs') as FormArray).valueChanges.subscribe(() => {
      this.updateItemValue(input as FormGroup);
    });
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
      subQuantity: '',
      subUnit: '',
      subValue: ''
    }));
  }

  removeSubInput(index: number, subIndex: number): void {
    this.getSubInputs(index).removeAt(subIndex);
    this.updateItemValue(this.inputs.at(index) as FormGroup);
  }

  updateItemValue(itemGroup: FormGroup): void {
    const subInputs = itemGroup.get('subInputs') as FormArray;
    const valueControl = itemGroup.get('value')!;

    if (subInputs.length > 0) {
      const sum = subInputs.controls.reduce((acc, ctrl) => {
        return acc + (parseFloat(ctrl.get('subValue')?.value) || 0);
      }, 0);
      valueControl.setValue(sum, { emitEvent: false });
      valueControl.disable({ emitEvent: false });
    } else {
      valueControl.enable({ emitEvent: false });
    }

    this.cdr.markForCheck();
  }

  newConstruction() {
    const budgetItems: BudgetItemCreation[] = this.inputs.controls.map(input => {
      const raw = (input as FormGroup).getRawValue();
      const subItems: BudgetSubItemCreation[] = (input.get('subInputs') as FormArray).controls.map(subInput => ({
        name: subInput.value.subName,
        quantity: subInput.value.subQuantity,
        unit: subInput.value.subUnit,
        value: subInput.value.subValue
      }));
      return {
        name: raw.name,
        quantity: raw.quantity,
        unit: raw.unit,
        value: raw.value,
        budgetSubItems: subItems
      };
    });

    console.log(budgetItems);

    this.construction = {
      name: this.name,
      local: this.local,
      clientId: this.selectedClient,
      adjudicationDate: this.adjudicationDate,
      distance: this.distance,
      budgetItems: budgetItems
    } as ConstructionCreation;

    console.log(this.construction);

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
