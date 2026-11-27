import { Component, OnInit } from '@angular/core';
import { SubCategoryType } from 'src/app/demo/data/enum/subCategoryType';
import { parseLocalDate } from 'src/app/demo/service/localDate.interceptor';
import { VehicleExpense, VehicleExpenseService } from 'src/app/demo/service/queries/vehicleExpenseService';
import { euros, exportStatementPdf, periodLabel } from 'src/app/demo/service/statementPdf';

interface VehicleExpenseRow extends VehicleExpense {
  day: Date | undefined;
  vehicleLabel: string;
  subCategoryLabel: string;
}

interface SubCategoryTotal {
  key: string;
  label: string;
  total: number;
  count: number;
}

const NO_VEHICLE = -1;

@Component({
  templateUrl: './list-vehicle-expenses.component.html'
})
export class ListVehicleExpensesComponent implements OnInit {

  loading = true;
  allRows: VehicleExpenseRow[] = [];
  rows: VehicleExpenseRow[] = [];

  vehicleOptions: { label: string; value: number }[] = [];
  subCategoryOptions: { label: string; value: string }[] = [];

  selectedVehicle: number | null = null;
  selectedSubCategories: string[] = [];
  dateRange: Date[] | null = null;

  totalValue = 0;
  subCategoryTotals: SubCategoryTotal[] = [];

  constructor(private vehicleExpenseService: VehicleExpenseService) { }

  ngOnInit(): void {
    this.vehicleExpenseService.getVehicleExpenses().subscribe({
      next: (expenses) => {
        this.allRows = expenses.map(expense => this.toRow(expense));
        this.vehicleOptions = this.buildVehicleOptions(this.allRows);
        this.subCategoryOptions = this.buildSubCategoryOptions(this.allRows);
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilters(): void {
    const from = this.dateRange?.[0] ? this.startOfDay(this.dateRange[0]) : null;
    const to = this.dateRange?.[1] ? this.startOfDay(this.dateRange[1]) : from;

    this.rows = this.allRows.filter(row => {
      if (this.selectedVehicle !== null) {
        const rowVehicle = row.vehicleId ?? NO_VEHICLE;
        if (rowVehicle !== this.selectedVehicle) return false;
      }
      if (this.selectedSubCategories.length && !this.selectedSubCategories.includes(row.subCategoryType)) return false;
      if (from && (!row.day || row.day < from)) return false;
      if (to && (!row.day || row.day > to)) return false;
      return true;
    });

    this.totalValue = this.rows.reduce((sum, row) => sum + row.totalValue, 0);
    this.subCategoryTotals = this.buildSubCategoryTotals(this.rows);
  }

  clearFilters(): void {
    this.selectedVehicle = null;
    this.selectedSubCategories = [];
    this.dateRange = null;
    this.applyFilters();
  }

  exportPdf(): void {
    const vehicleName = this.selectedVehicle === null
      ? 'Todos os veículos'
      : this.vehicleOptions.find(option => option.value === this.selectedVehicle)?.label ?? '';

    exportStatementPdf({
      title: 'Despesas de Veículos - ' + vehicleName,
      period: periodLabel(this.rows.map(row => row.day)),
      company: 'ALVEDA GOLD, LDA',
      fontSize: 8,
      singleLine: true,
      head: ['Data', 'Veículo', 'Tipo', 'Descrição', 'Documento', 'Valor'],
      columnWidths: { 0: 19, 1: 24, 2: 38, 3: 48, 4: 30, 5: 23 },
      body: this.rows.map(row => [
        row.day?.toLocaleDateString('pt-PT') ?? '',
        row.vehicleLabel,
        row.subCategoryLabel,
        row.name ?? '',
        row.documentNumber ?? '',
        euros(row.totalValue)
      ]),
      foot: [['Total', '', '', '', '', euros(this.totalValue)]],
      rightAlignedColumns: [5],
      fileName: 'despesas-veiculos'
    });
  }

  private toRow(expense: VehicleExpense): VehicleExpenseRow {
    return {
      ...expense,
      day: expense.date instanceof Date ? expense.date : parseLocalDate(expense.date as string),
      vehicleLabel: expense.registration ?? 'Sem veículo',
      subCategoryLabel: (SubCategoryType as Record<string, string>)[expense.subCategoryType] ?? expense.subCategoryType
    };
  }

  private buildVehicleOptions(rows: VehicleExpenseRow[]): { label: string; value: number }[] {
    const vehicles = new Map<number, string>();
    let hasUnlinked = false;
    for (const row of rows) {
      if (row.vehicleId == null) hasUnlinked = true;
      else vehicles.set(row.vehicleId, row.vehicleLabel);
    }
    const options = [...vehicles.entries()]
      .map(([value, label]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (hasUnlinked) options.push({ label: 'Sem veículo associado', value: NO_VEHICLE });
    return options;
  }

  private buildSubCategoryOptions(rows: VehicleExpenseRow[]): { label: string; value: string }[] {
    const subCategories = new Map<string, string>();
    rows.forEach(row => subCategories.set(row.subCategoryType, row.subCategoryLabel));
    return [...subCategories.entries()]
      .map(([value, label]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private buildSubCategoryTotals(rows: VehicleExpenseRow[]): SubCategoryTotal[] {
    const totals = new Map<string, SubCategoryTotal>();
    for (const row of rows) {
      const entry = totals.get(row.subCategoryType) ?? { key: row.subCategoryType, label: row.subCategoryLabel, total: 0, count: 0 };
      entry.total += row.totalValue;
      entry.count++;
      totals.set(row.subCategoryType, entry);
    }
    return [...totals.values()].sort((a, b) => b.total - a.total);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
