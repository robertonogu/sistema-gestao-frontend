import { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { WorkLogSubmissionService } from 'src/app/demo/service/people/workLogSubmission.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {

    model: any[] = [];

    pendingSubmissionsItem: any = {
        label: 'Registos por aprovar',
        icon: 'pi pi-fw pi-inbox',
        routerLink: ['/people/worklog-submissions'],
        badge: null
    };

    private subscriptions = new Subscription();

    constructor(private router: Router, private workLogSubmissionService: WorkLogSubmissionService) { }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private refreshPendingCount() {
        this.workLogSubmissionService.countPending().subscribe({
            next: (count) => this.pendingSubmissionsItem.badge = count > 0 ? count : null,
            error: () => this.pendingSubmissionsItem.badge = null
        });
    }

    ngOnInit() {
        this.refreshPendingCount();
        this.subscriptions.add(this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => this.refreshPendingCount()));
        this.subscriptions.add(this.workLogSubmissionService.pendingChanged.subscribe(() => this.refreshPendingCount()));

        this.model = [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/']
            },
            {
                label: "Atalhos",
                icon: 'pi pi-plus',
                items: [
                    {
                        label: 'Nova Venda',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/transactions/sales/create-sale']
                    },
                    {
                        label: 'Nova Receita',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/transactions/revenues/create-revenue']
                    },
                    {
                        label: 'Nova Despesa',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/transactions/expenses/create-expense']
                    },
                    {
                        label: 'Novo Pagamento',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/transactions/payments/create-payment']
                    },
                    {
                        label: 'Novo Movimento',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/transactions/movements'],
                        queryParams: { new: true }
                    },
                    {
                        label: 'Nova Deslocação',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/constructions/vehicleCosts/create-vehicleCost']
                    },
                ]
            },
            {
                label: 'Transações',
                icon: 'pi pi-euro',
                items: [
                    {
                        label: 'Vendas',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/transactions/sales']
                    },
                    {
                        label: 'Receitas',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/transactions/revenues']
                    },
                    {
                        label: 'Despesas',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/transactions/expenses']
                    },
                    {
                        label: 'Pagamentos',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/transactions/payments']
                    },
                    {
                        label: 'Movimentações',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/transactions/movements']
                    }
                ]
            },
            {
                label: 'Consultas',
                icon: 'pi pi-search',
                items: [
                    {
                        label: 'Contas Corrente',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/queries/currentAccounts']
                    },
                    {
                        label: 'Saldos',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/queries/balances']
                    },
                    {
                        label: 'Débitos',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/queries/debts']
                    },
                    {
                        label: 'Extrato de Conta',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/queries/accountLogs']
                    },
                    {
                        label: 'Extrato Caixa',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/queries/cashAccountLogs']
                    },
                ]
            },
            {
                label: 'Obras',
                icon: 'pi pi-building',
                items: [
                    { 
                        label: 'Obras', 
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/constructions'] 
                    },
                    { 
                        label: 'Serviços Externos', 
                        icon: 'pi pi-fw pi-car',
                        routerLink: ['/constructions/externalServices'] 
                    },
                    { 
                        label: 'Deslocações', 
                        icon: 'pi pi-fw pi-car',
                        routerLink: ['/constructions/vehicleCosts'] 
                    },
                    { 
                        label: 'Custo por Hora', 
                        icon: 'pi pi-fw pi-car',
                        routerLink: ['/constructions/costEmployeeHours'] 
                    },
                ]
            },
            {
                label: "Inventário",
                icon: 'pi pi-box',
                items: [
                    {
                        label: 'Artigos',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/inventory/articles']
                    },
                    {
                        label: 'Veículos',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/inventory/vehicles']
                    },
                    {
                        label: 'Equipamentos',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/inventory/equipments']
                    },
                    {
                        label: 'Ferramentas',
                        icon: 'pi pi-fw pi-wrench',
                        routerLink: ['/inventory/tools']
                    }
                ]
            },
            {
                label: "Pessoal",
                icon: 'pi pi-user',
                items: [
                    {
                        label: 'Funcionários',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/people/employees']
                    },
                    {
                        label: 'Ausências',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/people/absences']
                    },
                    {
                        label: 'Mapa de Tempos',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/people/worklogs']
                    },
                    this.pendingSubmissionsItem,
                    {
                        label: 'Mapa de horas',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/people/timemap']
                    },
                    {
                        label: 'Mapa custo por hora',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/auth/access']
                    },
                    {
                        label: 'Utilizadores',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/people/users']
                    }
                ]
            },
            {
                label: "Empresa",
                icon: 'pi pi-briefcase',
                items: [
                    {
                        label: 'Clientes',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/company/clients']
                    },
                    {
                        label: 'Fornecedores',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/company/suppliers']
                    },
                    {
                        label: 'Entidades Externas',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/company/externalEntities']
                    },
                    {
                        label: 'Financiadores',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/company/financers']
                    },
                    {
                        label: 'Credores',
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: ['/company/creditors']
                    },
                    {
                        label: 'Contas',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/company/accounts']
                    },
                    {
                        label: 'Categorias de Despesa',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/company/expenseCategories']
                    }
                ]
            },
        ];
    }
}
