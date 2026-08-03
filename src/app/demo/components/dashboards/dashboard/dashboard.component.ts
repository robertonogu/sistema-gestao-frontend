import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { DashboardService } from 'src/app/demo/service/dashboard/dashboardService';
import { CategoryCost } from 'src/app/demo/api/categoryCost';
import { ExpenseInDebt } from 'src/app/demo/api/expenseInDebt';
import { CategoryType } from 'src/app/demo/data/enum/categoryType';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    knobValue: number = 90;

    selectedYear: number = new Date().getFullYear();

    years: number[] = [];

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
    expensesInDebt: ExpenseInDebt[] = [];
    CategoryType: any = CategoryType;

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

        const currentYear = new Date().getFullYear();
        this.years = Array.from({ length: 7 }, (_, i) => currentYear + 1 - i);
    }

    getCategoriesName(): string[] {
        return this.categoryCosts.map(item => this.CategoryType[item.categoryType] ?? item.categoryType);
    }

    getCategoriesValues() {
        return this.categoryCosts.map(item => item.value);
    }

    buildSparklinePath(values: number[], width: number = 258, height: number = 96): string {
        if (!values || values.length === 0) return '';

        const max = Math.max(...values, 0);
        const min = Math.min(...values, 0);
        const range = max - min || 1;
        const stepX = width / (values.length - 1 || 1);

        const points = values.map((value, i) => ({
            x: i * stepX,
            y: height - ((value - min) / range) * height,
        }));

        let path = `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const midX = ((p0.x + p1.x) / 2).toFixed(2);
            path += ` C${midX},${p0.y.toFixed(2)} ${midX},${p1.y.toFixed(2)} ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`;
        }

        return path;
    }

    ngOnInit(): void {
        this.loadDashboardData();

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

    loadDashboardData(): void {
        this.dashboardService.getDashboardData(this.selectedYear).subscribe((dashboardData) => {
            this.revenuesValue = dashboardData.revenuesValue;
            this.expensesValue = dashboardData.expensesValue;
            this.debtsValue = dashboardData.debtsValue;
            this.balance = dashboardData.balance;
            this.revenuesPerMonth = dashboardData.revenuesPerMonth;
            this.expensesPerMonth = dashboardData.expensesPerMonth;
            this.categoryCosts = dashboardData.categoryCosts;
            this.expensesInDebt = dashboardData.expensesInDebt;
            this.initCharts();
        });
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

    onYearChange() {
        this.loadDashboardData();
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
