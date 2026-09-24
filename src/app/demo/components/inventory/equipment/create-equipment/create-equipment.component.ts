import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  editingEquipmentId: number | null = null;

  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private equipmentService: EquipmentService) { }

  ngOnInit(): void {
    const equipmentId = Number(this.route.snapshot.params['equipmentId']);
    if (equipmentId) {
      this.editingEquipmentId = equipmentId;
      this.equipmentService.getEquipment(equipmentId).subscribe(equipment => {
        this.code = equipment.code;
        this.name = equipment.name;
        this.brand = equipment.brand;
        this.model = equipment.model;
        this.serialNumber = equipment.serialNumber;
        this.purchaseDate = this.toDate(equipment.purchaseDate);
        this.purchaseValue = equipment.purchaseValue;
        this.warrantyStart = this.toDate(equipment.warrantyStart);
        this.warrantyEnd = this.toDate(equipment.warrantyEnd);
        this.power = equipment.power;
        this.selectedStatus = equipment.status;
      });
    }
  }

  private toDate(value: any): Date {
    return value ? new Date(value) : undefined as any;
  }

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

    if (this.editingEquipmentId) {
      this.equipmentService.updateEquipment(this.editingEquipmentId, this.equipment).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Equipamento atualizado com sucesso.' });
      });
      return;
    }

    if (this.equipment != null) {
      this.equipmentService.createEquipment(this.equipment).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Equipamento adicionado com sucesso.' });
        this.resetForm();
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

  private resetForm(): void {
    this.code = undefined as any;
    this.name = undefined as any;
    this.brand = undefined as any;
    this.model = undefined as any;
    this.serialNumber = undefined as any;
    this.purchaseDate = undefined as any;
    this.purchaseValue = undefined as any;
    this.warrantyStart = undefined as any;
    this.warrantyEnd = undefined as any;
    this.power = undefined as any;
    this.selectedStatus = undefined as any;
  }
}
