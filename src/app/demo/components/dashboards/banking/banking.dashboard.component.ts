import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { Sale } from 'src/app/demo/api/sale';
import { SaleService } from 'src/app/demo/service/transactions/saleService';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { TableLazyLoadEvent } from 'primeng/table';
interface MonthlyPayment {
    name?: string;
    amount?: number;
    paid?: boolean;
    date?: string;
}

@Component({
    templateUrl: './banking.dashboard.component.html',
    providers: [ConfirmationService, MessageService]
})
export class BankingDashboardComponent implements OnInit, OnDestroy {
    chartData: any;

    chartOptions: any;

    payments: MonthlyPayment[] = [];

    subscription: Subscription;

    loading: boolean = true;
  totalRecords: number = 0;
  sales!: Sale[];

  currentPage: number = 0;
  pageSize: number = 5;

    constructor(private layoutService: LayoutService,  private confirmationService: ConfirmationService,
        private messageService: MessageService, 
        private router: Router,
        private saleService: SaleService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    nextPage(event: any) {
        this.loading = true;
        
        this.currentPage = event.first / event.rows;
        this.pageSize = event.rows;
        
        this.saleService.getSales(this.currentPage, this.pageSize).subscribe((sales) => {
          this.sales = sales.objectList;
          this.totalRecords = sales.totalElements;
          this.loading = false;
        });
      }

    ngOnInit() {
        this.initChart();

        this.payments = [
            {
                name: 'Electric Bill',
                amount: 75.6,
                paid: true,
                date: '06/04/2022',
            },
            {
                name: 'Water Bill',
                amount: 45.5,
                paid: true,
                date: '07/04/2022',
            },
            { name: 'Gas Bill', amount: 45.2, paid: false, date: '12/04/2022' },
            {
                name: 'Internet Bill',
                amount: 25.9,
                paid: true,
                date: '17/04/2022',
            },
            {
                name: 'Streaming',
                amount: 40.9,
                paid: false,
                date: '20/04/2022',
            },
        ];
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'Income',
                    data: [6500, 5900, 8000, 8100, 5600, 5500, 4000],
                    fill: false,
                    tension: 0.4,
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                },
                {
                    label: 'Expenses',
                    data: [1200, 5100, 6200, 3300, 2100, 6200, 4500],
                    fill: true,
                    borderColor: '#6366f1',
                    tension: 0.4,
                    backgroundColor: 'rgba(99,102,220,0.2)',
                },
            ],
        };

        this.chartOptions = {
            animation: {
                duration: 0,
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ': ';
                            }

                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(context.parsed.y);
                            }
                            return label;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
