import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { VehicleCost } from 'src/app/demo/api/vehicleCost';
import { VehicleCostService } from 'src/app/demo/service/construction/vehicleCostService';

@Component({
  templateUrl: './list-vehicle-costs.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListVehicleCostsComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  vehicleCosts!: VehicleCost[];
  
  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private vehicleCostService: VehicleCostService, 
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.vehicleCostService.getVehicleCosts(this.currentPage, this.pageSize).subscribe((vehicleCosts) => {
      this.vehicleCosts = vehicleCosts.objectList;
      this.totalRecords = vehicleCosts.totalElements;
      this.loading = false;
    });
  }

  newVehicleCost() {
    this.router.navigate(['./constructions/vehicleCosts/create-vehicleCost']);
  }

  deleteVehicleCost(vehicleCost: VehicleCost) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.vehicleCostService.deleteVehicleCost(vehicleCost.vehicleCostId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Deslocação eliminada com sucesso.' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
