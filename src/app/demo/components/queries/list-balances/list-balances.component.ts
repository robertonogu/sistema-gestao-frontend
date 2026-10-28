import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RowInput } from 'jspdf-autotable';
import { euros, exportStatementPdf } from 'src/app/demo/service/statementPdf';
import { OriginType, originGroupLabel } from 'src/app/demo/api/originType';
import { CurrentAccountLogService, OriginBalance } from 'src/app/demo/service/queries/currentAccountLogService';

// Saldo da conta corrente de todas as origens, agrupadas por tipo: pessoal (só funcionários internos), credores, financiadores, fornecedores,
// clientes e entidades externas (por esta ordem, vinda da API). Clicar numa origem abre o extrato dela na Conta Corrente.
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

  // Cor pelo lado da empresa (o saldo é crédito - débito): positivo = a empresa deve (a pagar, vermelho);
  // negativo = devem à empresa (a receber, verde). Vale para clientes e para todos os outros tipos.
  // O valor mostra-se sempre sem sinal: a cor é que diz se é a pagar ou a receber.
  balanceColor(balance: number): string {
    return balance > 0 ? 'text-red-500' : balance < 0 ? 'text-green-500' : 'text-900';
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  groupLabel(type: OriginType | null): string {
    return originGroupLabel(type);
  }

  // PDF com as mesmas linhas de grupo da tabela (Pessoal, Credores…). Sem cores, o saldo vai com sinal
  // (como na conta corrente): positivo = a pagar, negativo = a receber
  exportPdf(): void {
    const body: RowInput[] = [];
    let currentType: OriginType | null | undefined = undefined;
    for (const balance of this.balances) {
      const startsGroup = balance.type !== currentType;
      if (startsGroup) {
        // Título do tipo a negrito com uma linha preta por baixo e espaço por cima (também depois do cabeçalho)
        const first = currentType === undefined;
        currentType = balance.type;
        body.push([{ content: this.groupLabel(balance.type), colSpan: 2, styles: {
          fontStyle: 'bold', fillColor: false, lineColor: 0, lineWidth: { bottom: 0.5 },
          cellPadding: { top: first ? 4 : 6, bottom: 1, left: 1.2, right: 1.2 }
        } }]);
      }
      // Sem fundo: o fundo branco de cada linha tapava metade da linha preta do título por cima.
      // A primeira origem de cada tipo fica afastada da linha do título.
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
