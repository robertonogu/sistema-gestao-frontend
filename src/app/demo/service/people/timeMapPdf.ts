import jsPDF from 'jspdf';
import autoTable, { CellInput, RowInput } from 'jspdf-autotable';

export type Rgb = [number, number, number];

export interface TimeMapPdfCell {
    text: string;
    colSpan?: number;
    fill?: Rgb;
    color?: Rgb;
    bold?: boolean;
    missingDay?: boolean;
    firstMissingDay?: boolean;
}

export interface TimeMapPdfVacation {
    year: number;
    carriedOverDays: number;
    carriedOverUsed: number;
    carriedOverRemaining: number;
    entitledDays: number;
    currentUsed: number;
    currentRemaining: number;
    totalUsed: number;
    maxDaysPerYear: number;
}

export interface TimeMapPdf {
    title: string;
    employeeName: string;
    year: number;
    months: string[];
    daysPerMonth: number[];
    rows: TimeMapPdfCell[][];
    footRows: { label: string; values: (string | number)[] }[];
    vacation: TimeMapPdfVacation | null;
    totals: { label: string; value: string | number }[];
    fileName: string;
}

const MARGIN = 10;
const DAY_COLUMN_WIDTH = 16;
const LINE = 0.1;
const MONTH_LINE = 0.5;

export function exportTimeMapPdf(data: TimeMapPdf): void {
    const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(data.title, pageWidth / 2, 13, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(data.employeeName, MARGIN, 13);
    doc.text(String(data.year), pageWidth - MARGIN, 13, { align: 'right' });

    const monthColumnWidth = (pageWidth - 2 * MARGIN - DAY_COLUMN_WIDTH) / (data.months.length * 3);
    const columnStyles: { [key: number]: any } = { 0: { cellWidth: DAY_COLUMN_WIDTH, fontStyle: 'bold' } };
    for (let i = 1; i <= data.months.length * 3; i++) columnStyles[i] = { cellWidth: monthColumnWidth };

    const head: RowInput[] = [
        [{ content: 'Dia', rowSpan: 2 }, ...data.months.map(month => ({ content: month, colSpan: 3 }))],
        data.months.flatMap(() => ['H.T', 'H.E', 'H.F']),
    ];

    const body: RowInput[] = data.rows.map((cells, index) => [
        String(index + 1),
        ...cells.map(cell => toCellInput(cell)),
    ]);

    const openMonths = monthsMissingLastDay(data.rows[data.rows.length - 1] ?? []);
    const foot: RowInput[] = data.footRows.map((row, rowIndex) => [
        row.label,
        ...row.values.map((value, month) => ({
            content: String(value),
            colSpan: 3,
            styles: rowIndex === 0 && openMonths.has(month) ? { lineWidth: { top: 0, right: LINE, bottom: LINE, left: LINE } } : {},
        })),
    ]);

    autoTable(doc, {
        startY: 18,
        margin: { left: MARGIN, right: MARGIN },
        theme: 'grid',
        styles: {
            fontSize: 5.5, halign: 'center', valign: 'middle', textColor: 0, lineColor: 120, lineWidth: LINE,
            cellPadding: { top: 0.8, bottom: 0.8, left: 0.3, right: 0.3 }, overflow: 'ellipsize',
        },
        headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
        footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
        columnStyles,
        head,
        body,
        foot,
        showHead: 'everyPage',
        showFoot: 'lastPage',
        didParseCell: (hook) => {
            const column = hook.column.index - 1;
            if (column < 0 || hook.section === 'foot') return;
            const sides = toSides(hook.cell.styles.lineWidth);
            if (column % 3 === 0) sides.left = MONTH_LINE;
            if (column + hook.cell.colSpan >= data.months.length * 3) sides.right = MONTH_LINE;
            if (hook.section === 'head' && hook.row.index === 0) {
                sides.top = MONTH_LINE;
                sides.bottom = MONTH_LINE;
            }
            if (hook.section === 'body' && hook.row.index + 1 === data.daysPerMonth[Math.floor(column / 3)]) sides.bottom = MONTH_LINE;
            hook.cell.styles.lineWidth = sides;
        },
    });

    let y = (doc as any).lastAutoTable.finalY + 6;
    const summaryHeight = 28;
    if (y + summaryHeight > pageHeight - MARGIN) {
        doc.addPage();
        y = 15;
    }
    drawSummary(doc, data, y, pageWidth);

    doc.save(data.fileName + '.pdf');
}

function monthsMissingLastDay(cells: TimeMapPdfCell[]): Set<number> {
    const months = new Set<number>();
    let column = 0;
    cells.forEach(cell => {
        if (cell.missingDay) months.add(Math.floor(column / 3));
        column += cell.colSpan ?? 1;
    });
    return months;
}

function toCellInput(cell: TimeMapPdfCell): CellInput {
    const styles: any = {};
    if (cell.fill) styles.fillColor = cell.fill;
    if (cell.color) styles.textColor = cell.color;
    if (cell.bold) styles.fontStyle = 'bold';
    if (cell.missingDay) {
        styles.fillColor = [255, 255, 255];
        styles.lineWidth = { top: 0, right: LINE, bottom: 0, left: LINE };
    }
    return { content: cell.text, colSpan: cell.colSpan ?? 1, styles };
}

function drawSummary(doc: jsPDF, data: TimeMapPdf, y: number, pageWidth: number): void {
    const halfWidth = (pageWidth - 2 * MARGIN - 10) / 2;
    const rightX = MARGIN + halfWidth + 10;
    const tableStyles = {
        fontSize: 8, textColor: 0, lineColor: 120, lineWidth: LINE,
        cellPadding: { top: 0.8, bottom: 0.8, left: 1.5, right: 1.5 },
    } as const;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Resumo de Férias', MARGIN, y);
    doc.text('Totais do Ano', rightX, y);

    const v = data.vacation;
    const vacationBody: RowInput[] = v
        ? [
            ['Dias', v.carriedOverDays, v.entitledDays],
            ['Utilizadas', v.carriedOverUsed, v.currentUsed],
            ['Por utilizar', v.carriedOverRemaining, v.currentRemaining],
        ]
        : [[{ content: 'Sem dados de férias.', colSpan: 3 }]];

    autoTable(doc, {
        startY: y + 2,
        margin: { left: MARGIN },
        tableWidth: halfWidth,
        theme: 'grid',
        styles: { ...tableStyles, halign: 'center' },
        headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
        columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
        head: [['', `Transporte do ano anterior (${data.year - 1})`, `Ano atual (${data.year})`]],
        body: vacationBody,
    });

    autoTable(doc, {
        startY: y + 2,
        margin: { left: rightX },
        tableWidth: halfWidth,
        theme: 'grid',
        styles: tableStyles,
        columnStyles: { 0: { fontStyle: 'bold' }, 1: { halign: 'right' } },
        body: data.totals.map(total => [total.label, String(total.value)]),
    });
}

function toSides(lineWidth: any): { top: number; right: number; bottom: number; left: number } {
    if (typeof lineWidth === 'number') return { top: lineWidth, right: lineWidth, bottom: lineWidth, left: lineWidth };
    return { top: lineWidth?.top ?? 0, right: lineWidth?.right ?? 0, bottom: lineWidth?.bottom ?? 0, left: lineWidth?.left ?? 0 };
}

export function hexToRgb(hex: string): Rgb {
    const value = parseInt(hex.replace('#', ''), 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
