import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Equipment } from 'src/app/demo/api/equipment';
import { EquipmentStatus } from 'src/app/demo/data/enum/equipmentStatus';
import { EquipmentService } from 'src/app/demo/service/inventory/equipment.service';

@Component({
  templateUrl: './list-equipment.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListEquipmentComponent {

  equipmentStatus: any = EquipmentStatus;

  loading: boolean = true;
  totalRecords: number = 0;
  equipments!: Equipment[];

  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private equipmentService: EquipmentService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    this.equipmentService.getEquipments(this.currentPage, this.pageSize).subscribe((equipments) => {
      this.equipments = equipments.objectList;
      this.totalRecords = equipments.totalElements;
      this.loading = false;
    });
  }

  newEquipment() {
    this.router.navigate(['./inventory/equipments/create-equipment']);
  }

  deleteEquipment(equipment: Equipment) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.equipmentService.deleteEquipment(equipment.equipmentId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Equipamento eliminado com sucesso.' });
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
