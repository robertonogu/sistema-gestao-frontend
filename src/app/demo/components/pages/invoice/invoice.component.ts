import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Expense } from 'src/app/demo/api/expense';
import { ExternalService } from 'src/app/demo/api/externalService';

@Component({
    templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit { 

    constructor(private route: ActivatedRoute) { }
  
    expense!: Expense;
    externalServiceList!: ExternalService[];
    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['expense']) {
              this.externalServiceList = JSON.parse(params['expense'].externalServiceList);
            }
        });
        console.log(this.externalServiceList)
    }

}
