import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Equipment } from 'src/app/demo/api/equipment';
import { EquipmentCategory } from 'src/app/demo/data/enum/equipmentCategory';
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

  tabs = Object.entries(EquipmentCategory).map(([key, label]) => ({ key, label }));
  activeTab: number = 0;
  first: number = 0;

  currentPage: number = 0;
  pageSize: number = 20;

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

    this.first = event.first;

    this.equipmentService.getEquipments(this.currentPage, this.pageSize, this.tabs[this.activeTab].key).subscribe((equipments) => {
      this.equipments = equipments.objectList;
      this.totalRecords = equipments.totalElements;
      this.loading = false;
    });
  }

  onTabChange(event: any) {
    this.activeTab = event.index;
    this.nextPage({ first: 0, rows: this.pageSize });
  }

  newEquipment() {
    this.router.navigate(['./inventory/equipments/create-equipment']);
  }

  onRowSelect(event: any) {
    this.openEquipment(event.data);
  }

  openEquipment(equipment: Equipment) {
    this.router.navigate(['./inventory/equipments/dashboard', equipment.equipmentId]);
  }

  viewEquipment(equipment: Equipment) {
    this.router.navigate(['./inventory/equipments/view-equipment', equipment.equipmentId]);
  }

  editEquipment(equipment: Equipment) {
    this.router.navigate(['./inventory/equipments/edit-equipment', equipment.equipmentId]);
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
