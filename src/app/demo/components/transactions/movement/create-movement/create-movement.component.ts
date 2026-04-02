import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ObjectName } from 'src/app/demo/api/objectName';
import { MovementCreation } from 'src/app/demo/data/model/movement.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { MovementService } from 'src/app/demo/service/transactions/movementService';

@Component({
  templateUrl: './create-movement.component.html',
  providers: [MessageService]
})
export class CreateMovementComponent {

  accountNames!: ObjectName[];

  date!: Date;
  value!: number;
  selectedOriginAccount!: number;
  selectedTargetAccount!: number;

  movement!: MovementCreation;

  constructor(
    private accountService: AccountService, 
    private movementService: MovementService,
    private messageService: MessageService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.accountService.getAccountNames().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });
  }

  back() {
    this._location.back();
  }

  newMovement() {
    if (this.selectedOriginAccount == this.selectedTargetAccount) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'As contas não podem ser iguais.' });
    }
    else {
      this.movement = new MovementCreation(this.date, this.value, this.selectedOriginAccount, this.selectedTargetAccount);

      if (this.movementService != null) {
        this.movementService.createMovement(this.movement).subscribe(newMovement => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Movimento adicionado com sucesso.' });
        })      
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
      }
    }
  }
}
