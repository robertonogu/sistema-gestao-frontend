import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, forkJoin } from 'rxjs';
import { EquipmentCategory } from 'src/app/demo/data/enum/equipmentCategory';
import { EquipmentStatus } from 'src/app/demo/data/enum/equipmentStatus';
import { SubCategoryType } from 'src/app/demo/data/enum/subCategoryType';
import { EquipmentService } from 'src/app/demo/service/inventory/equipment.service';
import { parseLocalDate } from 'src/app/demo/service/localDate.interceptor';
import { EquipmentExpense, EquipmentExpenseService } from 'src/app/demo/service/queries/equipmentExpenseService';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

interface ExpenseGroup {
  key: string;
  label: string;
  color: string;
  icon: string;
  types: string[];
}

interface DashboardExpense extends EquipmentExpense {
  day: Date | undefined;
  subCategoryLabel: string;
  groupKey: string;
}

interface GroupSummary {
  group: ExpenseGroup;
  total: number;
  count: number;
  share: number;
}

const PURCHASE_TYPES = ['EQUIPMENTS_PURCHASE', 'EQUIPMENTS_PURCHASE_PORTABLE', 'EQUIPMENTS_PURCHASE_FURNITURE', 'OFFICE_EQUIPMENT_ACQUISITION'];

const GROUPS: ExpenseGroup[] = [
  { key: 'MAINTENANCE', label: 'Manutenção', color: '--orange-500', icon: 'pi pi-wrench', types: ['EQUIPMENTS_MAINTENANCE'] },
  { key: 'CONSUMABLES', label: 'Consumíveis', color: '--blue-500', icon: 'pi pi-box', types: ['EQUIPMENT_CONSUMABLES'] },
  { key: 'OTHER', label: 'Outros', color: '--gray-400', icon: 'pi pi-ellipsis-h', types: [] }
];

const STATUS_SEVERITY: Record<string, 'success' | 'warning' | 'danger' | 'secondary'> = {
  ACTIVE: 'success',
  IN_MAINTENANCE: 'warning',
  BROKEN: 'danger',
  DECOMMISSIONED: 'secondary',
  SOLD: 'secondary'
};

@Component({
  templateUrl: './equipment-dashboard.component.html'
})
export class EquipmentDashboardComponent implements OnInit, OnDestroy {

  loading = true;
  notFound = false;

  equipment: any;
  statusLabel = '';
  statusSeverity: 'success' | 'warning' | 'danger' | 'secondary' = 'secondary';
  categoryLabel = '';
  purchaseDate: Date | undefined;
  warrantyEnd: Date | undefined;

  expenses: DashboardExpense[] = [];
  tableRows: DashboardExpense[] = [];
  selectedGroup: string | null = null;
  first = 0;

  groups = GROUPS;
  groupSummaries: GroupSummary[] = [];

  totalSpent = 0;
  yearSpent = 0;
  monthlyAverage = 0;
  currentYear = new Date().getFullYear();

  barData: any;
  barOptions: any;
  doughnutData: any;
  doughnutOptions: any;

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private equipmentService: EquipmentService,
    private equipmentExpenseService: EquipmentExpenseService,
    private layoutService: LayoutService
  ) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe(() => this.initCharts());
  }

  ngOnInit(): void {
    const equipmentId = Number(this.route.snapshot.paramMap.get('equipmentId'));
    forkJoin({
      equipment: this.equipmentService.getEquipment(equipmentId),
      expenses: this.equipmentExpenseService.getEquipmentExpenses(equipmentId)
    }).subscribe({
      next: ({ equipment, expenses }) => {
        if (!equipment) {
          this.notFound = true;
          this.loading = false;
          return;
        }
        this.equipment = equipment;
        this.statusLabel = (EquipmentStatus as Record<string, string>)[equipment.status] ?? '';
        this.statusSeverity = STATUS_SEVERITY[equipment.status] ?? 'secondary';
        this.categoryLabel = (EquipmentCategory as Record<string, string>)[equipment.category] ?? '';
        this.purchaseDate = this.toDate(equipment.purchaseDate);
        this.warrantyEnd = this.toDate(equipment.warrantyEnd);
        this.expenses = expenses
          .filter(expense => !PURCHASE_TYPES.includes(expense.subCategoryType))
          .map(expense => this.toExpense(expense));
        this.buildSummaries();
        this.applyTableFilter();
        this.initCharts();
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  back(): void {
    this.router.navigate(['/inventory/equipments']);
  }

  view(): void {
    this.router.navigate(['/inventory/equipments/view-equipment', this.equipment.equipmentId]);
  }

  edit(): void {
    this.router.navigate(['/inventory/equipments/edit-equipment', this.equipment.equipmentId]);
  }

  selectGroup(key: string | null): void {
    this.selectedGroup = this.selectedGroup === key ? null : key;
    this.first = 0;
    this.applyTableFilter();
  }

  groupOf(key: string): ExpenseGroup {
    return GROUPS.find(group => group.key === key) ?? GROUPS[GROUPS.length - 1];
  }

  private applyTableFilter(): void {
    this.tableRows = this.selectedGroup
      ? this.expenses.filter(expense => expense.groupKey === this.selectedGroup)
      : this.expenses;
  }

  private toDate(value: any): Date | undefined {
    if (!value) return undefined;
    return value instanceof Date ? value : parseLocalDate(value as string);
  }

  private toExpense(expense: EquipmentExpense): DashboardExpense {
    const group = GROUPS.find(item => item.types.includes(expense.subCategoryType)) ?? GROUPS[GROUPS.length - 1];
    return {
      ...expense,
      day: this.toDate(expense.date),
      subCategoryLabel: (SubCategoryType as Record<string, string>)[expense.subCategoryType] ?? expense.subCategoryType,
      groupKey: group.key
    };
  }

  private buildSummaries(): void {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    this.totalSpent = this.expenses.reduce((sum, expense) => sum + expense.totalValue, 0);
    this.yearSpent = this.expenses
      .filter(expense => expense.day && expense.day >= yearStart)
      .reduce((sum, expense) => sum + expense.totalValue, 0);

    const lastTwelve = this.expenses
      .filter(expense => expense.day && expense.day >= twelveMonthsAgo)
      .reduce((sum, expense) => sum + expense.totalValue, 0);
    this.monthlyAverage = lastTwelve / 12;

    this.groupSummaries = GROUPS.map(group => {
      const items = this.expenses.filter(expense => expense.groupKey === group.key);
      const total = items.reduce((sum, expense) => sum + expense.totalValue, 0);
      return { group, total, count: items.length, share: this.totalSpent > 0 ? (total / this.totalSpent) * 100 : 0 };
    });
  }

  private initCharts(): void {
    if (!this.equipment) return;
    const style = getComputedStyle(document.documentElement);
    const textColor = style.getPropertyValue('--text-color');
    const textColorSecondary = style.getPropertyValue('--text-color-secondary');
    const surfaceBorder = style.getPropertyValue('--surface-border');
    const colorOf = (group: ExpenseGroup) => style.getPropertyValue(group.color).trim();

    const now = new Date();
    const months: Date[] = Array.from({ length: 12 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 11 + i, 1));
    const monthKey = (date: Date) => date.getFullYear() * 12 + date.getMonth();
    const indexByMonth = new Map(months.map((month, i) => [monthKey(month), i]));

    const visibleGroups = GROUPS.filter(group => this.expenses.some(expense => expense.groupKey === group.key));
    const datasets = visibleGroups.map(group => {
      const data = new Array(12).fill(0);
      this.expenses
        .filter(expense => expense.groupKey === group.key && expense.day)
        .forEach(expense => {
          const index = indexByMonth.get(monthKey(expense.day!));
          if (index !== undefined) data[index] += expense.totalValue;
        });
      return {
        label: group.label,
        data: data.map(value => Math.round(value * 100) / 100),
        backgroundColor: colorOf(group),
        borderRadius: 4,
        maxBarThickness: 36
      };
    });

    this.barData = {
      labels: months.map(month => month.toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' })),
      datasets
    };

    this.barOptions = {
      animation: { duration: 0 },
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, usePointStyle: true, font: { weight: 600 } } },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.dataset.label}: ${this.euros(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: { stacked: true, ticks: { color: textColorSecondary }, grid: { display: false } },
        y: { stacked: true, ticks: { color: textColorSecondary, callback: (value: any) => value + ' €' }, grid: { color: surfaceBorder } }
      }
    };

    const withValue = this.groupSummaries.filter(summary => summary.total > 0);
    this.doughnutData = {
      labels: withValue.map(summary => summary.group.label),
      datasets: [{
        data: withValue.map(summary => Math.round(summary.total * 100) / 100),
        backgroundColor: withValue.map(summary => colorOf(summary.group)),
        borderWidth: 0
      }]
    };

    this.doughnutOptions = {
      animation: { duration: 0 },
      cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true, font: { weight: 600 } } },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.label}: ${this.euros(context.parsed)}`
          }
        }
      }
    };
  }

  private euros(value: number): string {
    return value.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }
}
