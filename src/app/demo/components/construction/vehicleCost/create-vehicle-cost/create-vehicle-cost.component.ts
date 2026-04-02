import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { ObjectName } from 'src/app/demo/api/objectName';
import { VehicleCostCreation } from 'src/app/demo/data/model/vehicleCostCreation';
import { SupplierService } from 'src/app/demo/service/company/supplierService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { VehicleCostService } from 'src/app/demo/service/construction/vehicleCostService';
import { VehicleService } from 'src/app/demo/service/inventory/vehicle.service';

@Component({
  templateUrl: './create-vehicle-cost.component.html',
  providers: [MessageService]
})
export class CreateVehicleCostComponent {

  supplierNames!: ItemName[];
  constructionNames!: ConstructionNames[];
  vehicleNames!: ItemName[];

  date!: Date;
  selectedVehicle!: number;
  selectedSuppliers!: number[];
  isTravelToConstruction!: boolean;
  selectedConstruction!: number;

  vehicleCost!: VehicleCostCreation;

  constructor(
    private supplierService: SupplierService,
    private constructionService: ConstructionService,
    private vehicleService: VehicleService, 
    private _location: Location,
    private messageService: MessageService,
    private vehicleCostService: VehicleCostService) { }

  ngOnInit(): void {
    this.supplierService.getSupplierNames().subscribe((supplierNames) => {
      this.supplierNames = supplierNames;
    });
    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });
    this.vehicleService.getActiveVehicleNames().subscribe((vehicleNames) => {
      this.vehicleNames = vehicleNames;
    });
  }

  back() {
    this._location.back();
  }

  newVehicleCost() {
    this.vehicleCost = { date: this.date, vehicleId: this.selectedVehicle, constructionId: this.selectedConstruction, isTravelToConstruction: this.isTravelToConstruction, destinations: this.selectedSuppliers } as VehicleCostCreation;

    if (this.vehicleCost != null) {
      this.vehicleCostService.createVehicleCost(this.vehicleCost).subscribe(newVehicleCost => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Deslocação adicionada com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

}
