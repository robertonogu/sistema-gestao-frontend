import { SaleForRevenue } from '../../api/saleForRevenue';

export interface RevenueSaleLine {
    saleId: number;
    documentNumber?: string;
    value: number;
}

export class RevenueSalesSelection {

    sales: SaleForRevenue[] = [];
    selected: SaleForRevenue[] = [];
    values: number[] = [];
    total: number = 0;

    load(sales: SaleForRevenue[], lines: RevenueSaleLine[] = []) {
        this.sales = [...sales].sort((a, b) => a.saleId - b.saleId);
        this.values = this.sales.map(sale => lines.find(line => line.saleId === sale.saleId)?.value ?? 0);
        this.selected = this.sales.filter((_, i) => this.values[i] !== 0);
        this.updateTotal();
    }

    clear() {
        this.sales = [];
        this.selected = [];
        this.values = [];
        this.total = 0;
    }

    isCredit(sale: SaleForRevenue): boolean {
        return sale.pendingValue < 0;
    }

    get totalPending(): number {
        return this.round(this.sales.filter(sale => !this.isCredit(sale)).reduce((sum, sale) => sum + sale.pendingValue, 0));
    }

    get totalCredit(): number {
        return this.round(-this.sales.filter(sale => this.isCredit(sale)).reduce((sum, sale) => sum + sale.pendingValue, 0));
    }

    private get creditUsed(): number {
        return this.round(-this.sales.reduce((sum, sale, i) => sum + (this.isCredit(sale) ? (this.values[i] ?? 0) : 0), 0));
    }

    isSelected(sale: SaleForRevenue): boolean {
        return this.selected.includes(sale);
    }

    onSelect(sale: SaleForRevenue) {
        this.values[this.sales.indexOf(sale)] = sale.pendingValue;
        this.updateTotal();
    }

    onUnselect(sale: SaleForRevenue) {
        this.values[this.sales.indexOf(sale)] = 0;
        this.updateTotal();
    }

    selectAll(checked: boolean) {
        this.values = this.sales.map(sale => checked ? sale.pendingValue : 0);
        this.updateTotal();
    }

    distribute(input: number | string | null) {
        let remaining = Math.min((input == null || input === '' ? 0 : Number(input)) + this.creditUsed, this.totalPending);
        this.values = this.sales.map((sale, i) => {
            if (this.isCredit(sale)) return this.values[i] ?? 0;
            const amount = this.round(Math.max(0, Math.min(remaining, sale.pendingValue)));
            remaining = this.round(remaining - amount);
            return amount;
        });
        this.selected = this.sales.filter((_, i) => this.values[i] !== 0);
        this.updateTotal();
    }

    updateTotal() {
        this.total = this.round(this.values.reduce((sum, value) => sum + (value ?? 0), 0));
    }

    get commonIvaRate(): number | undefined {
        const rates = new Set(this.sales.filter((_, i) => this.values[i] !== 0).map(sale => sale.ivaRate));
        return rates.size === 1 ? [...rates][0] : undefined;
    }

    lines(): { lines: RevenueSaleLine[]; error?: string } {
        const lines: RevenueSaleLine[] = [];
        for (let i = 0; i < this.sales.length; i++) {
            const value = this.values[i] ?? 0;
            const sale = this.sales[i];
            if (!this.isCredit(sale) && (value < 0 || value > sale.pendingValue + 0.005)) {
                return { lines: [], error: 'O valor recebido da venda ' + sale.documentNumber + ' tem de estar entre 0 e o valor pendente.' };
            }
            if (this.isCredit(sale) && (value > 0 || value < sale.pendingValue - 0.005)) {
                return { lines: [], error: 'O crédito usado de ' + sale.documentNumber + ' tem de estar entre ' + sale.pendingValue + ' € e 0.' };
            }
            if (value !== 0) lines.push({ saleId: sale.saleId, value });
        }
        return { lines };
    }

    private round(value: number): number {
        return Math.round(value * 100) / 100;
    }
}
