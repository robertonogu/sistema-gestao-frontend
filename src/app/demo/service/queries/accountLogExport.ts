import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AccountLog } from '../../api/accountLogs';
import { MovementType } from '../../data/enum/movementType';
import { registerPdfFont } from '../pdfFont';

export interface AccountLogExport {
    title: string;
    accountName?: string;
    fileName: string;
    dateFrom?: Date;
    dateTo?: Date;
    logs: AccountLog[];
}

const HEADERS = ['Data', 'Tipo', 'Origem', 'Documento', 'Crédito', 'Débito', 'Saldo'];

function movementLabel(movementType: string): string {
    return (MovementType as any)[movementType] ?? movementType;
}

function formatDate(date?: Date | string | null): string {
    return date ? new Date(date).toLocaleDateString('pt-PT') : '';
}

function formatEUR(value: number): string {
    return value.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
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

export async function exportAccountLogsPdf(data: AccountLogExport): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });
    const font = await registerPdfFont(doc);
    const { credit, debt, finalBalance } = totals(data.logs);

    doc.setTextColor(0, 0, 0);
    doc.setFont(font, 'normal');
    doc.setFontSize(9);
    doc.text('ALVEDA GOLD, LDA', 14, 15);

    doc.setFont(font, 'bold');
    doc.setFontSize(14);
    doc.text(data.title, 14, 22);
    if (data.accountName) {
        doc.setFont(font, 'normal');
        doc.setFontSize(10);
        doc.text(data.accountName, doc.internal.pageSize.getWidth() - 14, 22, { align: 'right' });
    }
    let startY = 27;
    if (data.dateFrom) {
        doc.setFont(font, 'normal');
        doc.setFontSize(9);
        doc.text(periodLabel(data.dateFrom, data.dateTo), 14, 27);
        startY = 32;
    }

    autoTable(doc, {
        startY,
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
        foot: [['Total', '', '', '', formatEUR(credit), formatEUR(debt), formatEUR(finalBalance)]],
        columnStyles: {
            0: { cellWidth: 17, overflow: 'ellipsize' },
            1: { cellWidth: 22, overflow: 'ellipsize' },
            2: { cellWidth: 46, overflow: 'ellipsize' },
            3: { cellWidth: 31, overflow: 'ellipsize' },
            4: { cellWidth: 22, halign: 'right' },
            5: { cellWidth: 22, halign: 'right' },
            6: { cellWidth: 22, halign: 'right' },
        },
        theme: 'plain',
        showFoot: 'lastPage',
        headStyles: { halign: 'center', fontStyle: 'bold', textColor: 0, lineColor: 0, lineWidth: { bottom: 0.5 }, cellPadding: { top: 1.5, bottom: 3, left: 1.5, right: 1.5 } },
        footStyles: { halign: 'right', fontStyle: 'bold', textColor: 0, lineColor: 0, lineWidth: { top: 0.5 }, cellPadding: { top: 3, bottom: 1.5, left: 1.5, right: 1.5 } },
        didParseCell: (hook) => {
            if (hook.section === 'body') {
                const first = hook.row.index === 0;
                const last = hook.row.index === hook.table.body.length - 1;
                if (first || last) {
                    hook.cell.styles.cellPadding = { top: first ? 3 : 1.5, bottom: last ? 3 : 1.5, left: 1.5, right: 1.5 };
                }
            }
            if (hook.section === 'foot' && hook.column.index < 4) hook.cell.styles.halign = 'left';
        },
        styles: { font, fontSize: 8, cellPadding: 1.5, textColor: 0, overflow: 'ellipsize' },
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
    header.alignment = { horizontal: 'center', vertical: 'middle' };
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
    [12, 16, 44, 24, 18, 18, 18].forEach((width, i) => sheet.getColumn(i + 1).width = width);

    sheet.eachRow(row => row.eachCell(cell => {
        cell.font = { ...cell.font, name: 'Calibri' };
    }));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.fileName}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
}
