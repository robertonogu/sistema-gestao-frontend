import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { Destination } from 'src/app/demo/data/model/destination.model';
import { VehicleCostCreation } from 'src/app/demo/data/model/vehicleCostCreation';
import { SupplierService } from 'src/app/demo/service/company/supplierService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { VehicleCostService } from 'src/app/demo/service/construction/vehicleCostService';
import { VehicleService } from 'src/app/demo/service/inventory/vehicle.service';

interface DestinationOption {
  label: string;
  value: Destination;
}

@Component({
  templateUrl: './create-vehicle-cost.component.html',
  providers: [MessageService],
  styles: [`
    .route-sidebar {
      position: sticky;
      top: 16px;
    }
    .route-sidebar-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #8a8f99;
      margin-bottom: 10px;
    }
    .route-empty {
      font-size: 13px;
    }
    .route-stop {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      position: relative;
    }
    .route-stop + .route-stop {
      border-top: 1px dashed #e6e8ec;
    }
    .route-stop-index {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #f0f2f5;
      font-size: 11px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .route-stop-label {
      flex: 1;
      font-size: 13px;
    }
    .route-stop-actions {
      display: flex;
      gap: 2px;
    }
    .route-stop-fixed {
      opacity: 0.85;
    }
    .route-stop-fixed .route-stop-index {
      background: #fde9c8;
    }
  `]
})
export class CreateVehicleCostComponent implements OnInit {

  supplierNames!: ItemName[];
  constructionNames!: ConstructionNames[];
  vehicleNames!: ItemName[];

  date!: Date;
  selectedVehicle!: number;
  selectedConstruction!: number;

  destinations: Destination[] = [];
  destinationToAdd: Destination | null = null;
  destinationOptions: DestinationOption[] = [];

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
      this.refreshDestinationOptions();
    });
    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
      this.refreshDestinationOptions();
    });
    this.vehicleService.getActiveVehicleNames().subscribe((vehicleNames) => {
      this.vehicleNames = vehicleNames;
    });
  }

  back() {
    this._location.back();
  }

  onConstructionChange(): void {
    this.refreshDestinationOptions();
  }

  private refreshDestinationOptions(): void {
    const options: DestinationOption[] = (this.supplierNames ?? []).map((s) => ({
      label: s.name,
      value: { type: 'SUPPLIER', id: s.id },
    }));

    const construction = this.constructionNames?.find((c) => c.constructionId === this.selectedConstruction);
    if (construction) {
      options.push({
        label: 'Obra: ' + construction.name,
        value: { type: 'CONSTRUCTION', id: construction.constructionId },
      });
    }

    this.destinationOptions = options;
  }

  destinationLabel(destination: Destination): string {
    if (destination.type === 'CONSTRUCTION') {
      return 'Obra: ' + (this.constructionNames?.find((c) => c.constructionId === destination.id)?.name ?? destination.id);
    }
    return this.supplierNames?.find((s) => s.id === destination.id)?.name ?? String(destination.id);
  }

  addDestination(): void {
    if (!this.destinationToAdd) return;
    this.destinations.push(this.destinationToAdd);
    this.destinationToAdd = null;
  }

  removeDestination(index: number): void {
    this.destinations.splice(index, 1);
  }

  moveDestinationUp(index: number): void {
    if (index === 0) return;
    [this.destinations[index - 1], this.destinations[index]] = [this.destinations[index], this.destinations[index - 1]];
  }

  moveDestinationDown(index: number): void {
    if (index === this.destinations.length - 1) return;
    [this.destinations[index + 1], this.destinations[index]] = [this.destinations[index], this.destinations[index + 1]];
  }

  newVehicleCost() {
    this.vehicleCost = {
      date: this.date,
      vehicleId: this.selectedVehicle,
      constructionId: this.selectedConstruction,
      destinations: this.destinations,
    } as VehicleCostCreation;

    if (this.vehicleCost != null) {
      this.vehicleCostService.createVehicleCost(this.vehicleCost).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Deslocação adicionada com sucesso.' });
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

}
