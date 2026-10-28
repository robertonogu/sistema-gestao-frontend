import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OriginType } from 'src/app/demo/api/originType';
import { CurrentAccountLogService, OriginBalance } from 'src/app/demo/service/queries/currentAccountLogService';

// Títulos das linhas de grupo da tabela
const GROUP_LABELS: Record<OriginType, string> = {
  EMPLOYEE: 'Funcionários',
  CREDITOR: 'Credores',
  FINANCER: 'Financiadores',
  SUPPLIER: 'Fornecedores',
  CLIENT: 'Clientes',
  EXTERNAL_ENTITY: 'Entidades externas'
};

// Saldo da conta corrente de todas as origens, agrupadas por tipo: funcionários, credores, financiadores, fornecedores,
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

  groupLabel(type: OriginType | null): string {
    return type ? GROUP_LABELS[type] : 'Outros';
  }

  openStatement(balance: OriginBalance): void {
    this.router.navigate(['/queries/currentAccounts'], { queryParams: { originId: balance.originId } });
  }
}
