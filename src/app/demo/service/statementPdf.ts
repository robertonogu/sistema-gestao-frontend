import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { registerPdfFont } from './pdfFont';

export interface StatementPdf {
    title: string;
    period?: string;
    head: string[];
    body: RowInput[];
    foot?: RowInput[];
    rightAlignedColumns?: number[];
    columnWidths?: { [index: number]: number };
    company?: string;
    fontSize?: number;
    singleLine?: boolean;
    fileName: string;
}

const MARGIN = 14;

export async function exportStatementPdf(data: StatementPdf): Promise<void> {
    const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });
    const font = await registerPdfFont(doc);
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setTextColor(0, 0, 0);
    let titleY = 15;
    if (data.company) {
        doc.setFont(font, 'normal');
        doc.setFontSize(9);
        doc.text(data.company, MARGIN, titleY);
        titleY += 7;
    }
    doc.setFont(font, 'bold');
    doc.setFontSize(data.company ? 14 : 11);
    doc.text(data.title, MARGIN, titleY);

    if (data.period) {
        doc.setFont(font, 'normal');
        doc.setFontSize(10);
        doc.text(data.period, pageWidth - MARGIN, titleY, { align: 'right' });
    }

    const columnStyles: { [key: number]: any } = {};
    (data.rightAlignedColumns ?? []).forEach(index => columnStyles[index] = { halign: 'right' });
    Object.entries(data.columnWidths ?? {}).forEach(([index, width]) => {
        columnStyles[+index] = { ...columnStyles[+index], cellWidth: width };
    });

    autoTable(doc, {
        startY: titleY + 5,
        margin: { left: MARGIN, right: MARGIN },
        theme: 'plain',
        styles: { font, fontSize: data.fontSize ?? 9, textColor: 0, overflow: data.singleLine ? 'ellipsize' : 'linebreak', cellPadding: { top: 0.8, bottom: 0.8, left: 1.2, right: 1.2 } },
        headStyles: { fontStyle: 'bold', textColor: 0, lineColor: 0, lineWidth: { bottom: 0.5 },
            cellPadding: { top: 1, bottom: 2.2, left: 1.2, right: 1.2 } },
        footStyles: { fontStyle: 'bold', textColor: 0, lineColor: 0, lineWidth: { top: 0.5 },
            cellPadding: { top: 2.2, bottom: 1, left: 1.2, right: 1.2 } },
        columnStyles,
        head: [data.head],
        body: data.body,
        foot: data.foot,
        showFoot: 'lastPage',
        didParseCell: (hook) => {
            if (hook.section === 'body') {
                const first = hook.row.index === 0;
                const last = hook.row.index === hook.table.body.length - 1;
                if (first || last) {
                    hook.cell.styles.cellPadding = { top: first ? 2.2 : 0.8, bottom: last && data.foot ? 2.2 : 0.8, left: 1.2, right: 1.2 };
                }
            }
            if ((hook.section === 'head' || hook.section === 'foot') && data.rightAlignedColumns?.includes(hook.column.index)) {
                hook.cell.styles.halign = 'right';
            }
        }
    });

    doc.save(data.fileName + '.pdf');
}

export function periodLabel(dates: (Date | undefined | null)[]): string | undefined {
    const valid = dates.filter((date): date is Date => !!date && !isNaN(date.getTime()));
    if (valid.length === 0) return undefined;
    const times = valid.map(date => date.getTime());
    const format = (time: number) => new Date(time).toLocaleDateString('pt-PT');
    return `${format(Math.min(...times))} a ${format(Math.max(...times))}`;
}

export function euros(value: number | null | undefined): string {
    return (value ?? 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
