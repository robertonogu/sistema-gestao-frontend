import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Absence } from 'src/app/demo/api/absence';
import { AbsenceType } from 'src/app/demo/data/enum/absenceType';
import { AbsenceService } from 'src/app/demo/service/people/absence.service';

@Component({
  templateUrl: './list-absences.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ListAbsencesComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  absences!: Absence[];

  currentPage: number = 0;
  pageSize: number = 5;

  AbsenceType: any = AbsenceType;

  constructor(
    private absenceService: AbsenceService, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.absenceService.getAbsences(this.currentPage, this.pageSize).subscribe((absences) => {
      this.absences = absences.objectList;
      this.totalRecords = absences.totalElements;
      this.loading = false;
    });
  }

  newAbsence() {
    this.router.navigate(['./people/create-absence']);
  }

  deleteAbsence(absence: Absence) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.absenceService.deleteAbsence(absence.absenceId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ausência eliminada com sucesso.' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada-', life: 3000 });
      }
    });
  }
}
