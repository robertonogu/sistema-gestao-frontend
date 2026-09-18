import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AccountName } from 'src/app/demo/api/accountName';
import { Movement } from 'src/app/demo/api/movement';
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

  accountNames: AccountName[] = [];

  @ViewChild('dt') table?: Table;

  movementDialog: boolean = false;
  submitted: boolean = false;
  movement: Partial<Movement> = {};

  constructor(
    private movementService: MovementService,
    private accountService: AccountService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.accountService.getAccountNamesWithType().subscribe((accountNames) => {
      this.accountNames = accountNames;

      if (this.route.snapshot.queryParamMap.get('new') === 'true') {
        this.openNew();
      }
    });
  }

  private get cashAccountId(): number | undefined {
    return this.accountNames.find(account => account.cashBox)?.objectId;
  }

  private filterValue(filters: any, field: string) {
    const meta = Array.isArray(filters?.[field]) ? filters[field][0] : filters?.[field];
    return meta?.value ?? undefined;
  }

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    const filters = event.filters ?? this.table?.filters ?? {};
    const dateRange = this.filterValue(filters, 'date');
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;
    if (Array.isArray(dateRange) && dateRange[0]) {
      dateFrom = dateRange[0];
      dateTo = dateRange[1] ?? dateRange[0];
    }

    this.movementService.getMovements(this.currentPage, this.pageSize, dateFrom, dateTo).subscribe((movements) => {
      this.movements = movements.objectList;
      this.totalRecords = movements.totalElements;
      this.loading = false;
    });
  }

  openNew() {
    this.movement = { targetAccountId: this.cashAccountId };
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
