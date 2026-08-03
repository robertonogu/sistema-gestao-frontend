import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EquipmentStatus } from 'src/app/demo/data/enum/equipmentStatus';
import { EquipmentCreation } from 'src/app/demo/data/model/equipmentCreation.model';
import { EquipmentService } from 'src/app/demo/service/inventory/equipment.service';

@Component({
  templateUrl: './create-equipment.component.html',
  providers: [MessageService]
})
export class CreateEquipmentComponent {

  equipmentStatus = EquipmentStatus;

  code!: string;
  name!: string;
  brand!: string;
  model!: string;
  serialNumber!: string;
  purchaseDate!: Date;
  purchaseValue!: number;
  warrantyStart!: Date;
  warrantyEnd!: Date;
  power!: string;
  selectedStatus!: EquipmentStatus;

  equipment!: EquipmentCreation;

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private equipmentService: EquipmentService) { }

  back() {
    this._location.back();
  }

  newEquipment() {
    this.equipment = {
      code: this.code,
      name: this.name,
      brand: this.brand,
      model: this.model,
      serialNumber: this.serialNumber,
      purchaseDate: this.purchaseDate,
      purchaseValue: this.purchaseValue,
      warrantyStart: this.warrantyStart,
      warrantyEnd: this.warrantyEnd,
      power: this.power,
      status: this.selectedStatus
    } as EquipmentCreation;

    if (this.equipment != null) {
      this.equipmentService.createEquipment(this.equipment).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Equipamento adicionado com sucesso.' });
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
