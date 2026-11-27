import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AccountLog } from '../../api/accountLogs';
import { MovementType } from '../../data/enum/movementType';
import { registerPdfFont } from '../pdfFont';
import { loadLogo } from '../pdfLogo';

export interface AccountLogExport {
    title: string;
    accountName?: string;
    fileName: string;
    dateFrom?: Date;
    dateTo?: Date;
    logs: AccountLog[];
    openingBalance: number;
}

const HEADERS =['Data', 'Tipo', 'Origem', 'Documento', 'Crédito', 'Débito', 'Saldo'];

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
    return `${formatDate(dateFrom)} a ${formatDate(dateTo)}`;
}

function effectivePeriodLabel(dateFrom: Date | undefined, dateTo: Date | undefined, logs: AccountLog[]): string {
    if (dateFrom) return periodLabel(dateFrom, dateTo);
    const times = logs.filter(log => log.date).map(log => new Date(log.date).getTime());
    if (times.length === 0) return 'Sem movimentos';
    return periodLabel(new Date(Math.min(...times)), new Date(Math.max(...times)));
}

function chronological(logs: AccountLog[]): AccountLog[] {
    return [...logs].reverse();
}

function prepare(data: AccountLogExport): { logs: AccountLog[]; openingBalance: number } {
    const logs = chronological(data.logs);
    if (logs.length > 0 && logs[0].movementType === 'FIRST_INTERACTION') {
        return { logs: logs.slice(1), openingBalance: logs[0].balance };
    }
    return { logs, openingBalance: data.openingBalance };
}

function totals(logs: AccountLog[], openingBalance: number) {
    const credit = logs.reduce((sum, log) => sum + (log.credit || 0), 0);
    const debt = logs.reduce((sum, log) => sum + (log.debt || 0), 0);
    const finalBalance = logs.length > 0 ? logs[logs.length - 1].balance : openingBalance;
    return { credit, debt, finalBalance };
}

export async function exportAccountLogsPdf(data: AccountLogExport): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait', format: 'a4', compress: true });
    const font = await registerPdfFont(doc);
    const { logs, openingBalance } = prepare(data);
    const { credit, debt, finalBalance } = totals(logs, openingBalance);

    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();
    const logo = await loadLogo();
    const titleY = logo ? 38 : 15;
    const startY = titleY + (data.accountName ? 10 : 5);
    const period = effectivePeriodLabel(data.dateFrom, data.dateTo, data.logs);

    const drawHeader = () => {
        doc.setTextColor(0, 0, 0);
        if (logo) {
            const logoHeight = 22;
            doc.addImage(logo.dataUrl, 'PNG', 14, 8, logoHeight * logo.width / logo.height, logoHeight);
        }

        doc.setFont(font, 'bold');
        doc.setFontSize(14);
        doc.text(data.title, 14, titleY);

        doc.setFontSize(9);
        doc.text(period, pageWidth - 14, titleY, { align: 'right' });

        if (data.accountName) {
            doc.setFont(font, 'normal');
            doc.setFontSize(10);
            doc.text(data.accountName, 14, titleY + 5);
        }
    };

    autoTable(doc, {
        startY,
        margin: { top: startY, bottom: 16, left: 14, right: 14 },
        didDrawPage: drawHeader,
        head: [HEADERS],
        body: [
            [{ content: `Saldo transportado: ${formatEUR(openingBalance)}`, colSpan: HEADERS.length, styles: { halign: 'center', fontStyle: 'bold' } }],
            ...logs.map(log => [
                formatDate(log.date),
                movementLabel(log.movementType),
                log.origin ?? '',
                log.documentNumber ?? '',
                log.credit ? formatEUR(log.credit) : '',
                log.debt ? formatEUR(log.debt) : '',
                formatEUR(log.balance),
            ]),
        ],
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
                const transport = hook.row.index === 0;
                const first = hook.row.index === 1;
                const last = hook.row.index === hook.table.body.length - 1;
                if (transport) {
                    hook.cell.styles.cellPadding = { top: 3, bottom: 3, left: 1.5, right: 1.5 };
                    hook.cell.styles.lineColor = 0;
                    hook.cell.styles.lineWidth = { bottom: 0.5 };
                } else if (first || last) {
                    hook.cell.styles.cellPadding = { top: first ? 3 : 1.5, bottom: last ? 3 : 1.5, left: 1.5, right: 1.5 };
                }
            }
            if (hook.section === 'head') hook.cell.styles.halign = hook.column.index < 4 ? 'left' : 'right';
            if (hook.section === 'foot' && hook.column.index < 4) hook.cell.styles.halign = 'left';
        },
        styles: { font, fontSize: 8, cellPadding: 1.5, textColor: 0, overflow: 'ellipsize' },
    });

    const totalPages = doc.getNumberOfPages();
    for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);
        doc.setFont(font, 'normal');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text(`${page}/${totalPages}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
    }

    doc.save(`${data.fileName}.pdf`);
}

export async function exportAccountLogsExcel(data: AccountLogExport): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Movimentos');
    const { logs, openingBalance } = prepare(data);
    const { credit, debt, finalBalance } = totals(logs, openingBalance);

    sheet.addRow([data.title]).font = { bold: true, size: 14 };
    sheet.addRow([effectivePeriodLabel(data.dateFrom, data.dateTo, data.logs)]);
    sheet.addRow([]);

    const header = sheet.addRow(HEADERS);
    header.font = { bold: true };
    header.eachCell((cell, col) => {
        cell.alignment = { horizontal: col <= 4 ? 'left' : 'right', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6E8EC' } };
        cell.border = { bottom: { style: 'thin' } };
    });

    const transport = sheet.addRow([`Saldo transportado: ${formatEUR(openingBalance)}`]);
    sheet.mergeCells(transport.number, 1, transport.number, HEADERS.length);
    transport.font = { bold: true };
    transport.alignment = { horizontal: 'center' };
    transport.getCell(1).border = { bottom: { style: 'thin' } };

    logs.forEach(log => {
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
