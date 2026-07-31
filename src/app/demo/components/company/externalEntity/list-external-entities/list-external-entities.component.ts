import { Component } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ExternalEntity } from 'src/app/demo/api/externalEntity';
import { ExternalEntityCreation } from 'src/app/demo/data/model/externalEntityCreation.model';
import { ExternalEntityService } from 'src/app/demo/service/company/externalEntityService';

@Component({
  templateUrl: './list-external-entities.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ListExternalEntitiesComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  externalEntities!: ExternalEntity[];

  currentPage: number = 0;
  pageSize: number = 5;

  externalEntityDialog: boolean = false;
  submitted: boolean = false;
  externalEntity: Partial<ExternalEntity> = {};

  constructor(
    private externalEntityService: ExternalEntityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    this.externalEntityService.getExternalEntities(this.currentPage, this.pageSize).subscribe((externalEntities) => {
      this.externalEntities = externalEntities.objectList;
      this.totalRecords = externalEntities.totalElements;
      this.loading = false;
    });
  }

  openNew() {
    this.externalEntity = {};
    this.submitted = false;
    this.externalEntityDialog = true;
  }

  editExternalEntity(externalEntity: ExternalEntity) {
    this.externalEntity = { ...externalEntity };
    this.externalEntityDialog = true;
  }

  hideDialog() {
    this.externalEntityDialog = false;
    this.submitted = false;
  }

  saveExternalEntity() {
    this.submitted = true;

    if (this.externalEntity.name?.trim()) {
      const externalEntityCreation = { name: this.externalEntity.name, nif: this.externalEntity.nif } as ExternalEntityCreation;

      if (this.externalEntity.originId) {
        this.externalEntityService.updateExternalEntity(this.externalEntity.originId, externalEntityCreation).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Entidade Externa atualizada com sucesso.' });
          this.externalEntityDialog = false;
          this.externalEntity = {};
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      } else {
        this.externalEntityService.createExternalEntity(externalEntityCreation).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Entidade Externa adicionada com sucesso.' });
          this.externalEntityDialog = false;
          this.externalEntity = {};
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      }
    }
  }

  deleteExternalEntity(externalEntity: ExternalEntity) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.externalEntityService.deleteExternalEntity(externalEntity.originId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Entidade Externa eliminada com sucesso.' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
