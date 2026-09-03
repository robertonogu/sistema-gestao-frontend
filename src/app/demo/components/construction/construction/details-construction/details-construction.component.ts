import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Component, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';
import { CashflowMonth } from 'src/app/demo/api/cashflowMonth';
import { ConstructionCalendarEvent } from 'src/app/demo/api/constructionCalendarEvent';
import { ConstructionDetails } from 'src/app/demo/api/constructionDetails';
import { ItemCost } from 'src/app/demo/api/itemCost';
import { MessageService } from 'primeng/api';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';

interface CostBucket { budgeted: number; actual: number; }

interface CostsByItemSplit {
  budgetItemId: number;
  name: string;
  materials: CostBucket;
  workLog: CostBucket;
  externalServices: CostBucket;
}

interface CatItem { name: string; value: number; }

type SourceKey = 'materials' | 'workLog' | 'externalServices';

@Component({
  templateUrl: './details-construction.component.html',
  providers: [MessageService],
  styles: [`
  :host {
  --bg: #ffffff;
  --surface-2: #fafbfc;
  --border: #e6e8ec;
  --text: #1a1d23;
  --text-2: #555a63;
  --text-3: #8a8f99;
  --accent: oklch(0.62 0.13 250);
  --accent-soft: oklch(0.96 0.025 250);
  --success: oklch(0.55 0.13 155);
  --danger:  oklch(0.62 0.18 25);
  --radius: 10px;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  display: block;
}

.obra-header {
  display: flex;
  gap: 0;
  align-items: stretch;
}

// ===== Foto (encostada à caixa branca) =====
.obra-photo {
  position: relative;
  width: 130px;
  flex-shrink: 0;
  border-radius: var(--radius) 0 0 var(--radius);
  overflow: hidden;
  background: var(--surface-2);

  img { width: 100%; height: 100%; object-fit: cover; }
}
.obra-photo-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-3);
  background-image:
    repeating-linear-gradient(-45deg,
      oklch(0.96 0.005 250),
      oklch(0.96 0.005 250) 8px,
      oklch(0.94 0.01 250)  8px,
      oklch(0.94 0.01 250)  16px);
  font-family: var(--font-mono);
  font-size: 10px;
}

// ===== Caixa branca (nome, status, morada, progresso, meta) =====
.obra-card {
  flex: 1;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 0 var(--radius) var(--radius) 0;
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: center;
  min-width: 0;
}

.obra-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.obra-id {
  display: flex; gap: 8px; align-items: center;
  font-size: 12px; color: var(--text-2);
}

.obra-name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
  line-height: 1.2;
}

.obra-morada {
  color: var(--text-2);
  font-size: 13px;
}

// ===== Progresso =====
.obra-progress { margin-top: 4px; }

.progress-head {
  display: flex; justify-content: space-between;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-3);
  margin-bottom: 6px;
}

.progress-track {
  position: relative;
  height: 6px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 999px;
  overflow: hidden;
}
.progress-fill {
  position: absolute; inset: 0 auto 0 0;
  background: var(--accent);
  border-radius: 999px;
  transition: width 0.3s;
}

// ===== Meta lateral =====
.obra-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 28px;
  padding-left: 20px;
  border-left: 1px solid var(--border);
}
.meta-row {
  display: flex; flex-direction: column;
  gap: 2px;
}
.meta-label {
  color: var(--text-3); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.meta-value { color: var(--text); font-size: 13px; font-weight: 600; }
.meta-value.success { color: var(--success); }

// ===== Helpers =====
.muted { color: var(--text-3); }
.mono  { font-family: var(--font-mono); }

// ===== Responsivo =====
@media (max-width: 900px) {
  .obra-header { flex-direction: column; }
  .obra-card   { grid-template-columns: 1fr; }
  .obra-meta   { padding-left: 0; border-left: none; border-top: 1px solid var(--border); padding-top: 12px; }
}
   :host {
  --bg: #f7f8fa;
  --surface: #ffffff;
  --surface-2: #fafbfc;
  --border: #e6e8ec;
  --text: #1a1d23;
  --text-2: #555a63;
  --text-3: #8a8f99;
  --danger: oklch(0.62 0.18 25);
  --success: oklch(0.55 0.13 155);
  --radius: 10px;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  display: block;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
}

.dash { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.muted { color: var(--text-3); }
.mono  { font-family: var(--font-mono); }

// ===== Header =====
.dash-header {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
  h1 { margin: 4px 0 2px; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
  .header-actions { display: flex; gap: 8px; align-items: center; }
}

// ===== KPIs =====
.kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.kpi-grid .card { position: relative; }

.obra-edit-lupa {
  position: absolute;
  top: 10px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  color: var(--text-3);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover { background: var(--surface-2); color: var(--accent); }
  i { font-size: 13px; }
}

// ===== Execução financeira =====
:host ::ng-deep .exec-card .p-card-body { padding: 16px; }
.exec-head { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; }
.seg-bar {
  display: flex; height: 20px; border-radius: 6px; overflow: hidden;
  background: var(--surface-2); border: 1px solid var(--border);
  .seg { transition: width 0.3s; }
}
.seg-legend {
  display: flex; gap: 20px; flex-wrap: wrap; margin-top: 10px; font-size: 12px;
  .legend-item { display: inline-flex; gap: 6px; align-items: center; }
  .dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
}

// ===== Layout rows =====
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.source-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: stretch; }

.section-title {
  font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--text-3); margin: 8px 0 0 0;
  display: flex; align-items: center; gap: 8px;
  &::before { content: ''; width: 3px; height: 14px; background: oklch(0.62 0.13 250); border-radius: 2px; }
}

// ===== Card titles =====
.card-title {
  display: flex; gap: 8px; align-items: center;
  font-weight: 600; font-size: 13px; padding: 14px 16px 0;
  i { color: var(--text-3); }
}
:host ::ng-deep .p-card {
  border: 1px solid var(--border) !important;
  box-shadow: 0 1px 2px rgba(15,20,30,0.04) !important;
  border-radius: var(--radius) !important;
}
:host ::ng-deep .p-card .p-card-body { padding: 14px 16px; }

// ===== Source columns =====
.source-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px 4px;
  .source-title { display: flex; gap: 8px; align-items: center; font-weight: 600; }
  .swatch { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
  .source-actions { display: flex; align-items: center; gap: 8px; }
}
.export-materials-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px;
  border: none; background: transparent;
  color: var(--text-3); cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
  &:hover:not(:disabled) { background: var(--surface-2); color: oklch(0.55 0.13 155); }
  &:disabled { cursor: default; opacity: 0.6; }
  i { font-size: 13px; }
}
.source-totals {
  display: flex; justify-content: space-between;
  padding: 0 16px 12px;
  font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.04em;
  strong { font-size: 13px; color: var(--text); margin-left: 4px; }
  strong.over { color: var(--danger); }
}

.bars { display: flex; flex-direction: column; gap: 12px; }
.bar-row-head {
  display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 4px;
  .bar-name-wrap { display: flex; align-items: baseline; gap: 4px; min-width: 0; }
  .bar-name { font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .bar-pct  { font-family: var(--font-mono); font-size: 10px; color: var(--text-3); font-weight: 600; flex-shrink: 0; }
  .bar-pct.over { color: var(--danger); }
}
.bar-lupa {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; flex-shrink: 0;
  color: var(--text-3); cursor: pointer; border-radius: 4px;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s, color 0.15s;
  &:hover { background: var(--surface-2); color: var(--text); }
  &:focus-visible { opacity: 1; }
  i { font-size: 10px; }
}
.bar-row:hover .bar-lupa { opacity: 1; }
.bar-track {
  position: relative; height: 14px; background: var(--surface-2);
  border-radius: 4px; overflow: hidden;
  .bar-orcado { position: absolute; inset: 0 auto 0 0; border-radius: 4px; }
  .bar-real   { position: absolute; top: 3px; bottom: 3px; left: 0; border-radius: 3px; }
}
.bar-foot {
  display: flex; justify-content: space-between; font-size: 10px; color: var(--text-3); margin-top: 3px;
  .over { color: var(--danger); }
}

// ===== Payments =====
.month-block + .month-block { margin-top: 14px; }
.month-label { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.pay-row {
  display: grid; grid-template-columns: 80px 1fr auto; gap: 12px; align-items: center;
  padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px;
  &:last-child { border-bottom: none; }
  .pay-date   { color: var(--text-3); font-size: 11px; }
  .pay-amount { font-weight: 600; }
  &.in  .pay-amount { color: var(--success); }
  &.out .pay-amount { color: var(--danger); }
}

// ===== Charts =====
.chart-host { height: 240px; padding: 8px 16px 16px; }
.chart-host.sm { height: 180px; }
  `]
})
export class DetailsConstructionComponent implements OnInit {

  get itemsSplit(): CostsByItemSplit[] {
    if (!this.constructionDetails) return [];

    const byName = new Map<string, CostsByItemSplit>();
    const ensure = (name: string, budgetItemId: number): CostsByItemSplit => {
      let entry = byName.get(name);
      if (!entry) {
        entry = {
          budgetItemId,
          name,
          materials: { budgeted: 0, actual: 0 },
          workLog: { budgeted: 0, actual: 0 },
          externalServices: { budgeted: 0, actual: 0 },
        };
        byName.set(name, entry);
      }
      return entry;
    };

    for (const item of this.constructionDetails.articlesItemsCost ?? []) {
      ensure(item.name, item.budgetItemId).materials = { budgeted: item.budgetValue, actual: item.value };
    }
    for (const item of this.constructionDetails.workItemsCost ?? []) {
      ensure(item.name, item.budgetItemId).workLog = { budgeted: item.budgetValue, actual: item.value };
    }
    for (const item of this.constructionDetails.externalServiceItemsCost ?? []) {
      ensure(item.name, item.budgetItemId).externalServices = { budgeted: item.budgetValue, actual: item.value };
    }

    return Array.from(byName.values());
  }

  constructionDetails!: ConstructionDetails;
  cashflowChartData: any;
  cashflowChartOptions: any;

  calendarYear: number = new Date().getFullYear();
  calendarMonth: number = new Date().getMonth();
  calendarWeeks: (number | null)[][] = [];

  activeTab: 'item' | 'source' = 'item';

  readonly WEEK_DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
  readonly MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  constructionId = -1;
  exportingMaterials = false;

  private readonly materialsTemplateUrl = 'assets/Mapa Materiais - Template.xlsx';
  private readonly materialsTemplateSheet = 'Mapa de materiais';
  private readonly materialsTemplateFirstDataRow = 4;

  constructor(
    private constructionService: ConstructionService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.constructionId = Number(this.route.snapshot.params['constructionId']);
    this.constructionService.getConstructionDetails(this.constructionId).subscribe((data) => {
      this.constructionDetails = data;
          console.log(data)
    });
    console.log(this.constructionDetails)
  }

  private ms(iso: string): number { return new Date(iso).getTime(); }
  private hoje(): number { return Date.now(); }

  back(): void { this.location.back(); }

  exportMaterials(): void {
    this.exportingMaterials = true;

    forkJoin({
      materials: this.constructionService.getMaterialsExport(this.constructionId),
      template: this.http.get(this.materialsTemplateUrl, { responseType: 'arraybuffer' })
    }).subscribe({
      next: ({ materials, template }) => {
        this.exportingMaterials = false;

        if (!materials.length) {
          this.messageService.add({ severity: 'info', summary: 'Sem materiais', detail: 'Não há materiais para exportar nesta obra.' });
          return;
        }

        const workbook = XLSX.read(template, { type: 'array' });
        const worksheet = workbook.Sheets[this.materialsTemplateSheet];
        if (!worksheet) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O template de Excel não tem a folha esperada.' });
          return;
        }

        const rows = materials.map(m => ([
          m.date ? new Date(m.date).toLocaleDateString('pt-PT') : '',
          m.supplier,
          m.documentNumber,
          m.description,
          m.quantity,
          m.unit,
          m.netValue,
          m.rubrica,
          m.item ?? ''
        ]));

        this.writeRowsPreservingStyle(worksheet, rows, this.materialsTemplateFirstDataRow);

        const constructionLabel = this.constructionDetails?.constructionNumber || this.constructionId;
        XLSX.writeFile(workbook, `materiais_obra_${constructionLabel}.xlsx`);
      },
      error: () => {
        this.exportingMaterials = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível exportar os materiais.' });
      }
    });
  }

  // Escreve valores célula a célula, preservando o objeto de célula existente do template
  // (estilo, formato, borders, etc.) em vez de o substituir por completo — o que é o que
  // XLSX.utils.sheet_add_aoa/json_to_sheet fazem por omissão.
  private writeRowsPreservingStyle(worksheet: XLSX.WorkSheet, rows: (string | number)[][], firstDataRow: number): void {
    let maxRow = firstDataRow - 1;
    let maxCol = 0;

    rows.forEach((row, rowIndex) => {
      const rowNumber = firstDataRow + rowIndex;
      row.forEach((value, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowNumber - 1, c: colIndex });
        const existing = worksheet[cellRef] || {};
        const type = typeof value === 'number' ? 'n' : 's';

        worksheet[cellRef] = { ...existing, v: value, t: type };
        delete worksheet[cellRef].w; // texto formatado em cache, fica desatualizado
        delete worksheet[cellRef].r; // rich text em cache
        delete worksheet[cellRef].h;

        maxCol = Math.max(maxCol, colIndex);
      });
      maxRow = Math.max(maxRow, rowNumber);
    });

    const currentRange = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
    const newRange: XLSX.Range = {
      s: { r: Math.min(currentRange.s.r, 0), c: Math.min(currentRange.s.c, 0) },
      e: { r: Math.max(currentRange.e.r, maxRow - 1), c: Math.max(currentRange.e.c, maxCol) }
    };
    worksheet['!ref'] = XLSX.utils.encode_range(newRange);
  }

  readonly sourceCols: { key: SourceKey; title: string; icon: string; color: string; soft: string }[] = [
    { key: 'materials',        title: 'Materiais',         icon: 'pi pi-box',    color: 'oklch(0.62 0.13 250)', soft: 'oklch(0.92 0.03 250)' },
    { key: 'workLog',          title: 'Mão-de-obra',       icon: 'pi pi-users',  color: 'oklch(0.55 0.13 155)', soft: 'oklch(0.92 0.04 155)' },
    { key: 'externalServices', title: 'Serviços externos', icon: 'pi pi-wrench', color: 'oklch(0.55 0.15 75)',  soft: 'oklch(0.94 0.04 75)'  },
  ];

  // ===== Computados =====
  pctFaturado = computed(() => Math.round((this.constructionDetails.invoicedNetValue / this.constructionDetails.initialBudget) * 100));
  pctPago     = computed(() => Math.round((this.constructionDetails.paymentValue     / this.constructionDetails.initialBudget)  * 100));

  kpis = computed(() => [
    { label: 'Orçamento',    value: this.fmtEUR(this.constructionDetails.initialBudget), accent: 'oklch(0.85 0.07 250)', sub: 'valor adjudicado' },
    { label: 'Faturado',     value: this.fmtEUR(this.constructionDetails.invoicedNetValue),  accent: 'oklch(0.65 0.13 250)', sub: `${this.pctFaturado()}% do orçamentado`,  delta:  12, deltaLabel: 'vs. mês ant.' },
    { label: 'Pago',         value: this.fmtEUR(this.constructionDetails.paymentValue),      accent: 'oklch(0.5 0.13 155)',  sub: `${this.pctPago()}% do faturado`,    delta:   8, deltaLabel: 'vs. mês ant.' },
    { label: 'Custos reais', value: this.fmtEUR(this.constructionDetails.costValueWorks),    accent: 'oklch(0.62 0.18 25)',  sub: 'acumulado',                          delta:  -3, deltaLabel: 'abaixo do plano' },
    { label: 'Lucro',        value: this.fmtEUR(this.constructionDetails.profit),       accent: 'oklch(0.55 0.15 75)',  sub: `margem ${((this.constructionDetails.profit / this.constructionDetails.initialBudget) * 100).toFixed(1)}%`, delta: 14, deltaLabel: 'vs. estimado' },
  ]);

  execSegments = computed(() => {
    const pago        = this.constructionDetails.paymentValue;
    const naoPago     = this.constructionDetails.invoicedNetValue - this.constructionDetails.paymentValue;
    const porFaturar  = this.constructionDetails.initialBudget - this.constructionDetails.invoicedNetValue;
    const max         = this.constructionDetails.initialBudget || 1;
    return [
      { label: 'Pago',              value: pago,       color: 'oklch(0.5 0.13 155)',  pct: (pago       / max) * 100 },
      { label: 'Faturado não pago', value: naoPago,    color: 'oklch(0.65 0.13 250)', pct: (naoPago    / max) * 100 },
      { label: 'Por faturar',       value: porFaturar, color: 'oklch(0.92 0.03 250)', pct: (porFaturar / max) * 100 },
    ];
  });

  paymentsByMonth = computed(() => {
    /*const map = new Map<string, typeof this.payments>();
    for (const p of this.payments) {
      const k = p.data.slice(0, 7);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(p);
    }
    return Array.from(map.entries()).map(([month, items]) => ({ month, items }));*/
  });

  // ===== Charts =====
  cashflowData = computed(() => ({
    /*labels: this.cashflow.map(c => c.month),
    datasets: [
      { label: 'Faturado', data: this.cashflow.map(c => c.faturado), borderColor: 'oklch(0.65 0.13 250)', backgroundColor: 'oklch(0.92 0.03 250 / 0.6)', tension: 0.35, fill: true },
      { label: 'Pago',     data: this.cashflow.map(c => c.pago),     borderColor: 'oklch(0.5 0.13 155)',  backgroundColor: 'transparent', tension: 0.35 },
      { label: 'Custos',   data: this.cashflow.map(c => c.custos),   borderColor: 'oklch(0.62 0.18 25)',  backgroundColor: 'transparent', borderDash: [4, 4], tension: 0.35 },
    ],*/
  }));

  cashflowOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } },
    scales: {
      y: { ticks: { callback: (v: any) => (Number(v) / 1000) + 'k', font: { size: 10 } }, grid: { color: '#eef0f3' } },
      x: { ticks: { font: { size: 10 } }, grid: { display: false } },
    },
  };

  // ===== Helpers usados no template =====
  fmtEUR(n: number): string {
    const abs = Math.abs(n || 0).toLocaleString('pt-PT', { maximumFractionDigits: 0 });
    return abs + ' €';
  }

  pctOf(actual: number, budgeted: number): number {
    return budgeted ? Math.round((actual / budgeted) * 100) : 0;
  }

  isOverrun(actual: number, budgeted: number): boolean {
    return actual > budgeted;
  }

  bucket(item: CostsByItemSplit, key: SourceKey): CostBucket {
    return item[key];
  }

  widthPct(value: number, max: number): number {
    return max ? Math.min((value / max) * 100, 100) : 0;
  }

  realWidthPct(item: CostsByItemSplit, key: SourceKey): number {
    const { budgeted, actual } = this.bucket(item, key);
    return this.widthPct(actual, budgeted);
  }

  totalBudgeted(key: SourceKey): number {
    return this.itemsSplit.reduce((s, it) => s + it[key].budgeted, 0);
  }

  totalActual(key: SourceKey): number {
    return this.itemsSplit.reduce((s, it) => s + it[key].actual, 0);
  }
}
