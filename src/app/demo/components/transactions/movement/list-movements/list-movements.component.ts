import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Movement } from 'src/app/demo/api/movement';
import { MovementType } from 'src/app/demo/data/enum/movementType';
import { MovementService } from 'src/app/demo/service/transactions/movementService';

@Component({
  templateUrl: './list-movements.component.html',
})
export class ListMovementsComponent {
  
  loading: boolean = true;
  totalRecords: number = 0;
  movements!: Movement[];

  currentPage: number = 0;
  pageSize: number = 5;

  MovementType = MovementType;

  constructor(
    private movementService: MovementService, 
    private router: Router
  ) {}
  
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

  newMovement() {
    this.router.navigate(['./transactions/movements/create-movement']);
  }

}
