import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/demo/api/vehicle';
import { VehicleCost } from 'src/app/demo/api/vehicleCost';
import { VehicleService } from 'src/app/demo/service/inventory/vehicle.service';

@Component({
  templateUrl: './list-vehicles.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListVehiclesComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  vehicles!: Vehicle[];

  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private vehicleService: VehicleService, 
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.vehicleService.getVehicles(this.currentPage, this.pageSize).subscribe((vehicles) => {
      this.vehicles = vehicles.objectList;
      this.totalRecords = vehicles.totalElements;
      console.log(this.vehicles)
      this.loading = false;
    });
  }

  newVehicle() {
    this.router.navigate(['./inventory/vehicles/create-vehicle']);
  }

  updateStatus(vehicle: Vehicle) {
    this.vehicleService.updateVehicleStatus(vehicle.vehicleId, !vehicle.active).subscribe((updatedVehicle) => {
      if (updatedVehicle != null) {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Estado de veículo atualizado.' });
        window.location.reload();
      }
    });
  }

  deleteVehicle(vehicle: Vehicle) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.vehicleService.deleteVehicle(vehicle.vehicleId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Viatura eliminada com sucesso.' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
