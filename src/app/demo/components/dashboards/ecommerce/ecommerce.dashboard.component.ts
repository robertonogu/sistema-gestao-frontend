import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { DashboardService } from 'src/app/demo/service/dashboard/dashboardService';
import { CategoryCost } from 'src/app/demo/api/categoryCost';
import { CategoryType } from 'src/app/demo/data/enum/categoryType';

@Component({
    templateUrl: './ecommerce.dashboard.component.html',
})
export class EcommerceDashboardComponent implements OnInit, OnDestroy {
    knobValue: number = 90;

    selectedWeek: any;

    weeks: any[] = [];

    barData: any;

    barOptions: any;

    pieData: any;

    pieOptions: any;

    products: Product[] = [];

    subscription: Subscription;

    cols: any[] = [];

    revenuesValue: number = 0;
    expensesValue: number = 0;
    debtsValue: number = 0;
    balance: number = 0;
    revenuesPerMonth: number[] = [];
    expensesPerMonth: number[] = [];
    categoryCosts: CategoryCost[] = [];
    CategoryType = CategoryType;

    constructor(
        private productService: ProductService,
        private layoutService: LayoutService,
        private dashboardService: DashboardService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initCharts();
            });
    }

    getCategoriesName(): string[] {
        console.log(this.categoryCosts.map(item => item.categoryType as CategoryType))
        
        //console.log(this.categoryCosts.map(item => CategoryType[CategoryType[item.categoryType]]));
        return this.categoryCosts.map(item => item.categoryType);
    }
    
    getCategoriesValues() {
        return this.categoryCosts.map(item => item.value);
    }

    ngOnInit(): void {
        this.dashboardService.getDashboardData().subscribe((dashboardData) => {
            console.log(dashboardData)
            this.revenuesValue = dashboardData.revenuesValue;
            this.expensesValue = dashboardData.expensesValue;
            this.debtsValue = dashboardData.debtsValue;
            this.balance = dashboardData.balance;
            this.revenuesPerMonth = dashboardData.revenuesPerMonth;
            this.expensesPerMonth = dashboardData.expensesPerMonth;
            this.categoryCosts = dashboardData.categoryCosts;
            this.initCharts();
        });

        this.weeks = [
            {
                label: 'Last Week',
                value: 0,
                data: [
                    [65, 59, 80, 81, 56, 55, 40],
                    [28, 48, 40, 19, 86, 27, 90],
                ],
            },
            {
                label: 'This Week',
                value: 1,
                data: [
                    [35, 19, 40, 61, 16, 55, 30],
                    [48, 78, 10, 29, 76, 77, 10],
                ],
            },
            {
                label: 'This Weekwekewkekwkekwksk',
                value: 1,
                data: [
                    [35, 19, 40, 61, 16, 55, 30],
                    [48, 78, 10, 29, 76, 77, 10],
                ],
            },
        ];

        this.selectedWeek = this.weeks[0];

        this.productService
            .getProductsSmall()
            .then((data) => (this.products = data));

        this.cols = [
            { header: 'Name', field: 'name' },
            { header: 'Category', field: 'category' },
            { header: 'Price', field: 'price' },
            { header: 'Status', field: 'inventoryStatus' },
        ];
    }

    async initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.barData = {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            datasets: [
                {
                    label: 'Receitas',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    barThickness: 12,
                    borderRadius: 12,
                    data: this.revenuesPerMonth,
                },
                {
                    label: 'Despesas',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    barThickness: 12,
                    borderRadius: 12,
                    data: this.expensesPerMonth,
                },
            ],
        };

        this.pieData = {
            labels: this.getCategoriesName(),
            datasets: [
                {
                    data: this.getCategoriesValues(),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--primary-700'),
                        documentStyle.getPropertyValue('--primary-400'),
                        documentStyle.getPropertyValue('--primary-100'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--primary-600'),
                        documentStyle.getPropertyValue('--primary-300'),
                        documentStyle.getPropertyValue('--primary-200'),
                    ],
                },
            ],
        };

        this.barOptions = {
            animation: {
                duration: 0,
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: 700,
                        },
                        padding: 28,
                    },
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ': ';
                            }

                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR',
                                }).format(context.parsed.y);
                            }
                            return label;
                        },
                    },
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };

        this.pieOptions = {
            animation: {
                duration: 0,
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: 700,
                        },
                        padding: 15,
                    },
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            let label = context.label || '';

                            if (label) {
                                label += ': ';
                            }

                            if (context.parsed !== null) {
                                label += new Intl.NumberFormat('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR',
                                }).format(context.parsed);
                            }
                            return label;
                        },
                    },
                }
            },
        };
    }

    onWeekChange() {
        let newBarData = { ...this.barData };
        newBarData.datasets[0].data = this.selectedWeek.data[0];
        newBarData.datasets[1].data = this.selectedWeek.data[1];
        this.barData = newBarData;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
