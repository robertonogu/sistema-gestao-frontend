import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ExternalEntity } from 'src/app/demo/api/externalEntity';
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

  constructor(
    private externalEntityService: ExternalEntityService, 
    private router: Router,
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

  newExternalEntity() {
    this.router.navigate(['./company/externalEntities/create-externalEntity']);
  }

  deleteExternalEntity(externalEntity: ExternalEntity) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.externalEntityService.deleteExternalEntity(externalEntity.externalEntityId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Entidade Externa eliminada com sucesso.' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
