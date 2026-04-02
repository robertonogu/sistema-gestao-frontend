import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Construction } from 'src/app/demo/api/construction';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';

@Component({
  templateUrl: './list-constructions.component.html',
  providers: [MessageService]
})

export class ListConstructionsComponent implements OnInit {

  isFirstLoad: boolean = true;

  favouriteConstructions!: Construction[];

  loading!: boolean;
  totalRecords: number = 0;
  constructions!: Construction[];
  
  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private constructionService: ConstructionService, 
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.isFirstLoad) {
      this.loading = true;

      this.constructionService.getConstructions(this.currentPage, this.pageSize).subscribe((constructions) => {
        this.constructions = constructions.objectList;
        this.totalRecords = constructions.totalElements;
        this.favouriteConstructions = this.constructions.filter(construction => construction.favourite);
        console.log(this.favouriteConstructions.length)
        this.loading = false;
        this.isFirstLoad = false;
      });
    }
  }

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.constructionService.getConstructions(this.currentPage, this.pageSize).subscribe((constructions) => {
      this.constructions = constructions.objectList;
      this.totalRecords = constructions.totalElements;
      this.loading = false;
    });
  }

  newConstruction() {
    this.router.navigate(['./constructions/create-construction']);
  }

  addFavorite(construction: Construction) {
    if (this.favouriteConstructions.length == 4 && !construction.favourite) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Máximo de obras favoritas atingidas.' });
    }
    else {
      this.constructionService.markAsFavourite(construction.constructionId, !construction.favourite).subscribe((constructionMarked) => {
        if (constructionMarked != null) {
          construction = constructionMarked;
          if (construction.favourite) {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Obra adicionada aos favoritos.' });
            this.favouriteConstructions.push(construction);
          }
          else {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Obra removida dos favoritos.' });
            //this.favouriteConstructions.
          }
        }
      });
    }
  }

  onRowSelect(event: any) {
    let constructionId = event.data.constructionId;
    this.router.navigate(['constructions/details/' + constructionId]);
  }

}
