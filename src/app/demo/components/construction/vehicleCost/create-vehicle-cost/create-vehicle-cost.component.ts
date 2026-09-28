import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { Destination } from 'src/app/demo/data/model/destination.model';
import { DestinationLocation } from 'src/app/demo/api/destinationLocation';
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
    .add-destination-btn {
      width: auto;
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
  // Every supplier/construction location; a stop is picked by owner and location name
  destinationLocations: DestinationLocation[] = [];
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
    this.vehicleCostService.getDestinationLocations().subscribe((destinationLocations) => {
      this.destinationLocations = destinationLocations;
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

  // One option per supplier location (all suppliers) and per location of the selected construction.
  // The location name is only shown when the supplier/construction has more than one.
  private refreshDestinationOptions(): void {
    const all = this.destinationLocations ?? [];
    const countByOwner = new Map<string, number>();
    all.forEach(d => countByOwner.set(d.type + d.ownerId, (countByOwner.get(d.type + d.ownerId) ?? 0) + 1));

    this.destinationOptions = all
      .filter(d => d.type === 'SUPPLIER' || d.ownerId === this.selectedConstruction)
      .map(d => {
        const withLocation = (countByOwner.get(d.type + d.ownerId) ?? 0) > 1 ? `${d.ownerName} — ${d.locationName}` : d.ownerName;
        const label = d.type === 'CONSTRUCTION' ? 'Obra: ' + withLocation : withLocation;
        return { label, value: { type: d.type, id: d.ownerId, locationId: d.locationId, label } };
      });
  }

  destinationLabel(destination: Destination): string {
    return destination.label ?? String(destination.id);
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
        this.resetForm();
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

  private resetForm(): void {
    this.date = undefined as any;
    this.selectedVehicle = undefined as any;
    this.selectedConstruction = undefined as any;
    this.destinations = [];
    this.destinationToAdd = null;
    this.refreshDestinationOptions();
  }

}
