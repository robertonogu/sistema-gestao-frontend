import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ObjectName } from 'src/app/demo/api/objectName';
import { Origin } from 'src/app/demo/api/origin';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { RevenueType } from 'src/app/demo/data/enum/revenueType';
import { RevenueCreation } from 'src/app/demo/data/model/revenueCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { RevenueService } from 'src/app/demo/service/transactions/revenueService';

@Component({
  templateUrl: './edit-revenue.component.html',
  providers: [MessageService]
})
export class EditRevenueComponent implements OnInit {

  revenueTypes = RevenueType;
  origins!: Origin[];
  accountNames!: ObjectName[];
  paymentMethods = PaymentMethod;
  validIvaRates!: number[];

  loading = true;
  revenueId!: number;

  date!: Date;
  selectedRevenueType!: RevenueType;
  documentNumber!: string;
  selectedOrigin!: number;
  selectedAccount!: number;
  selectedPaymentMethod!: PaymentMethod;
  iva!: number;
  totalValue!: number;
  selectedSale!: number;

  revenue!: RevenueCreation;

  constructor(
    private originService: OriginService,
    private accountService: AccountService,
    private messageService: MessageService,
    private revenueService: RevenueService,
    private route: ActivatedRoute,
    private _location: Location
  ) {
    this.validIvaRates = [0, 6, 13, 23];
  }

  ngOnInit(): void {
    this.revenueId = Number(this.route.snapshot.params['revenueId']);

    this.accountService.getAccountNames().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });

    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;

      this.revenueService.getRevenue(this.revenueId).subscribe({
        next: (revenue) => {
          this.date = new Date(revenue.date);
          this.selectedRevenueType = revenue.revenueType;
          this.documentNumber = revenue.documentNumber;
          this.selectedOrigin = revenue.originId;
          this.selectedAccount = revenue.accountId;
          this.selectedPaymentMethod = revenue.paymentMethod;
          this.totalValue = revenue.totalValue;
          this.iva = revenue.netValue > 0 ? Math.round((revenue.iva / revenue.netValue) * 100) : 0;
          this.selectedSale = revenue.saleId ?? (undefined as any);

          this.loading = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar a receita.' });
          this.loading = false;
        }
      });
    });
  }

  back() {
    this._location.back();
  }

  saveRevenue() {
    this.revenue = new RevenueCreation(this.date, this.selectedRevenueType, this.documentNumber, this.selectedOrigin, this.selectedAccount, this.selectedPaymentMethod, this.totalValue, this.iva, this.selectedSale);

    if (this.revenue != null) {
      this.revenueService.updateRevenue(this.revenueId, this.revenue).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Receita atualizada com sucesso.' });
        },
        error: (err) => {
          const detail = err?.error?.message || 'Existem campos por preencher.';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail });
        }
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
