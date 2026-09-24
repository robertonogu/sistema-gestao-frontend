import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AccountLog } from '../../api/accountLogs';
import { MovementType } from '../../data/enum/movementType';

// Shared PDF/Excel export for the bank ("Mapa Banco") and cash ("Extrato Caixa") statements.
export interface AccountLogExport {
    title: string;          // e.g. "Mapa Banco - Conta X"
    fileName: string;       // without extension
    dateFrom?: Date;
    dateTo?: Date;
    logs: AccountLog[];     // newest first, as returned by the API
}

const HEADERS = ['Data', 'Tipo de Movimento', 'Origem', 'Número de Documento', 'Crédito', 'Débito', 'Saldo'];

function formatDate(date?: Date | string | null): string {
    return date ? new Date(date).toLocaleDateString('pt-PT') : '';
}

function formatEUR(value: number): string {
    return value.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function movementLabel(movementType: string): string {
    return (MovementType as any)[movementType] ?? movementType;
}

export function periodLabel(dateFrom?: Date, dateTo?: Date): string {
    if (!dateFrom) return 'Todos os movimentos';
    if (!dateTo || formatDate(dateFrom) === formatDate(dateTo)) return `Dia ${formatDate(dateFrom)}`;
    return `De ${formatDate(dateFrom)} a ${formatDate(dateTo)}`;
}

function totals(logs: AccountLog[]) {
    const credit = logs.reduce((sum, log) => sum + (log.credit || 0), 0);
    const debt = logs.reduce((sum, log) => sum + (log.debt || 0), 0);
    const finalBalance = logs.length > 0 ? logs[0].balance : 0;
    return { credit, debt, finalBalance };
}

export function exportAccountLogsPdf(data: AccountLogExport): void {
    const doc = new jsPDF({ orientation: 'landscape' });
    const { credit, debt, finalBalance } = totals(data.logs);

    doc.setFontSize(14);
    doc.text(data.title, 14, 15);
    doc.setFontSize(10);
    doc.text(periodLabel(data.dateFrom, data.dateTo), 14, 21);

    autoTable(doc, {
        startY: 26,
        head: [HEADERS],
        body: data.logs.map(log => [
            formatDate(log.date),
            movementLabel(log.movementType),
            log.origin ?? '',
            log.documentNumber ?? '',
            log.credit ? formatEUR(log.credit) : '',
            log.debt ? formatEUR(log.debt) : '',
            formatEUR(log.balance),
        ]),
        foot: [['', '', '', 'Totais', formatEUR(credit), formatEUR(debt), formatEUR(finalBalance)]],
        columnStyles: { 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' } },
        styles: { fontSize: 9 },
    });

    doc.save(`${data.fileName}.pdf`);
}

export async function exportAccountLogsExcel(data: AccountLogExport): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Movimentos');
    const { credit, debt, finalBalance } = totals(data.logs);

    sheet.addRow([data.title]).font = { bold: true, size: 14 };
    sheet.addRow([periodLabel(data.dateFrom, data.dateTo)]);
    sheet.addRow([]);

    const header = sheet.addRow(HEADERS);
    header.font = { bold: true };
    header.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6E8EC' } };
        cell.border = { bottom: { style: 'thin' } };
    });

    data.logs.forEach(log => {
        sheet.addRow([
            log.date ? new Date(log.date) : null,
            movementLabel(log.movementType),
            log.origin ?? '',
            log.documentNumber ?? '',
            log.credit || null,
            log.debt || null,
            log.balance,
        ]);
    });

    const footer = sheet.addRow(['', '', '', 'Totais', credit, debt, finalBalance]);
    footer.font = { bold: true };

    sheet.getColumn(1).numFmt = 'dd/mm/yyyy';
    [5, 6, 7].forEach(col => sheet.getColumn(col).numFmt = '#,##0.00 €');
    [12, 24, 36, 22, 14, 14, 14].forEach((width, i) => sheet.getColumn(i + 1).width = width);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.fileName}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
}
