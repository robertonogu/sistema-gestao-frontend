import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RowInput } from 'jspdf-autotable';
import { euros, exportStatementPdf } from 'src/app/demo/service/statementPdf';
import { OriginType, originGroupLabel } from 'src/app/demo/api/originType';
import { CurrentAccountLogService, OriginBalance } from 'src/app/demo/service/queries/currentAccountLogService';

@Component({
  templateUrl: './list-balances.component.html'
})
export class ListBalancesComponent implements OnInit {

  loading = true;
  balances: OriginBalance[] = [];

  constructor(private currentAccountLogService: CurrentAccountLogService, private router: Router) { }

  ngOnInit(): void {
    this.currentAccountLogService.getBalances().subscribe({
      next: (balances) => {
        this.balances = balances;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  balanceColor(balance: number): string {
    return balance > 0 ? 'text-red-500' : balance < 0 ? 'text-green-500' : 'text-900';
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  groupLabel(type: OriginType | null): string {
    return originGroupLabel(type);
  }

  exportPdf(): void {
    const body: RowInput[] = [];
    let currentType: OriginType | null | undefined = undefined;
    for (const balance of this.balances) {
      const startsGroup = balance.type !== currentType;
      if (startsGroup) {
        const first = currentType === undefined;
        currentType = balance.type;
        body.push([{ content: this.groupLabel(balance.type), colSpan: 2, styles: {
          fontStyle: 'bold', fillColor: false, lineColor: 0, lineWidth: { bottom: 0.5 },
          cellPadding: { top: first ? 4 : 6, bottom: 1, left: 1.2, right: 1.2 }
        } }]);
      }
      const rowStyles = startsGroup
        ? { fillColor: false as const, cellPadding: { top: 2.5, bottom: 0.8, left: 1.2, right: 1.2 } }
        : { fillColor: false as const };
      body.push([
        { content: balance.name, styles: rowStyles },
        { content: euros(balance.balance), styles: rowStyles }
      ]);
    }
    exportStatementPdf({
      title: 'Saldos das Contas Correntes',
      period: new Date().toLocaleDateString('pt-PT'),
      head: ['Origem', 'Saldo'],
      body,
      rightAlignedColumns: [1],
      fileName: 'saldos-contas-correntes'
    });
  }

  openStatement(balance: OriginBalance): void {
    this.router.navigate(['/queries/currentAccounts'], { queryParams: { originId: balance.originId } });
  }
}
