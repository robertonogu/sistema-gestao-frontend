import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Movement } from 'src/app/demo/api/movement';
import { ObjectName } from 'src/app/demo/api/objectName';
import { MovementType } from 'src/app/demo/data/enum/movementType';
import { MovementCreation } from 'src/app/demo/data/model/movement.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { MovementService } from 'src/app/demo/service/transactions/movementService';

@Component({
  templateUrl: './list-movements.component.html',
  providers: [MessageService]
})
export class ListMovementsComponent implements OnInit {

  loading: boolean = true;
  totalRecords: number = 0;
  movements!: Movement[];

  currentPage: number = 0;
  pageSize: number = 20;

  MovementType = MovementType;

  accountNames: ObjectName[] = [];

  movementDialog: boolean = false;
  submitted: boolean = false;
  movement: Partial<Movement> = {};

  constructor(
    private movementService: MovementService,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.accountService.getAccountNames().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });
  }

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    this.movementService.getMovements(this.currentPage, this.pageSize).subscribe((movements) => {
      this.movements = movements.objectList;
      this.totalRecords = movements.totalElements;
      this.loading = false;
    });
  }

  openNew() {
    this.movement = {};
    this.submitted = false;
    this.movementDialog = true;
  }

  editMovement(movement: Movement) {
    this.movement = { ...movement, date: new Date(movement.date) };
    this.movementDialog = true;
  }

  hideDialog() {
    this.movementDialog = false;
    this.submitted = false;
  }

  saveMovement() {
    this.submitted = true;

    const { movementId, date, value, originAccountId, targetAccountId } = this.movement;

    if (!date || !value || !originAccountId || !targetAccountId) {
      return;
    }

    if (originAccountId === targetAccountId) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'As contas não podem ser iguais.' });
      return;
    }

    const movementCreation = new MovementCreation(date, value, originAccountId, targetAccountId);

    if (movementId) {
      this.movementService.updateMovement(movementId, movementCreation).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimento atualizado com sucesso.' });
        this.movementDialog = false;
        this.movement = {};
        this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
      });
    } else {
      this.movementService.createMovement(movementCreation).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimento adicionado com sucesso.' });
        this.movementDialog = false;
        this.movement = {};
        this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
      });
    }
  }
}
