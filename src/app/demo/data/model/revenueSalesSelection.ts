import { SaleForRevenue } from '../../api/saleForRevenue';

export interface RevenueSaleLine {
    saleId: number;
    documentNumber?: string;
    value: number;
}

// Vendas do cliente que uma receita pode liquidar (como as faturas num pagamento): seleção, valor por venda
// e repartição de um valor total pelas vendas da mais antiga para a mais recente.
export class RevenueSalesSelection {

    sales: SaleForRevenue[] = [];
    selected: SaleForRevenue[] = [];
    values: number[] = [];
    total: number = 0;

    // Carrega as vendas pendentes do cliente; em edição, as linhas já existentes ficam selecionadas com o seu valor
    load(sales: SaleForRevenue[], lines: RevenueSaleLine[] = []) {
        this.sales = [...sales].sort((a, b) => a.saleId - b.saleId);
        this.values = this.sales.map(sale => lines.find(line => line.saleId === sale.saleId)?.value ?? 0);
        this.selected = this.sales.filter((_, i) => this.values[i] > 0);
        this.updateTotal();
    }

    clear() {
        this.sales = [];
        this.selected = [];
        this.values = [];
        this.total = 0;
    }

    get totalPending(): number {
        return this.round(this.sales.reduce((sum, sale) => sum + sale.pendingValue, 0));
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

    // Reparte o valor pelas vendas pendentes, da mais antiga para a mais recente
    distribute(input: number | string | null) {
        let remaining = Math.min(input == null || input === '' ? 0 : Number(input), this.totalPending);
        this.values = this.sales.map(sale => {
            const amount = this.round(Math.max(0, Math.min(remaining, sale.pendingValue)));
            remaining = this.round(remaining - amount);
            return amount;
        });
        this.selected = this.sales.filter((_, i) => this.values[i] > 0);
        this.updateTotal();
    }

    updateTotal() {
        this.total = this.round(this.values.reduce((sum, value) => sum + (value ?? 0), 0));
    }

    // Taxa de IVA comum às vendas selecionadas (undefined se forem diferentes)
    get commonIvaRate(): number | undefined {
        const rates = new Set(this.sales.filter((_, i) => this.values[i] > 0).map(sale => sale.ivaRate));
        return rates.size === 1 ? [...rates][0] : undefined;
    }

    // Linhas a enviar à API; devolve uma mensagem de erro se algum valor exceder o pendente
    lines(): { lines: RevenueSaleLine[]; error?: string } {
        const lines: RevenueSaleLine[] = [];
        for (let i = 0; i < this.sales.length; i++) {
            const value = this.values[i] ?? 0;
            if (value > this.sales[i].pendingValue + 0.005) {
                return { lines: [], error: 'O valor recebido da venda ' + this.sales[i].documentNumber + ' excede o valor pendente.' };
            }
            if (value > 0) lines.push({ saleId: this.sales[i].saleId, value });
        }
        return { lines };
    }

    private round(value: number): number {
        return Math.round(value * 100) / 100;
    }
}
