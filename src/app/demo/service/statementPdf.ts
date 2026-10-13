import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

// PDF de listagens/extratos: A4 vertical, tudo a preto sobre branco, título a negrito à esquerda e período à
// direita; tabela sem linhas exceto a linha preta por baixo do cabeçalho (cabeçalho e totais a negrito).
export interface StatementPdf {
    title: string;
    period?: string;
    head: string[];
    body: RowInput[];
    foot?: RowInput[];
    rightAlignedColumns?: number[];
    fileName: string;
}

const MARGIN = 14;

export function exportStatementPdf(data: StatementPdf): void {
    const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(data.title, MARGIN, 15);

    if (data.period) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(data.period, pageWidth - MARGIN, 15, { align: 'right' });
    }

    const columnStyles: { [key: number]: any } = {};
    (data.rightAlignedColumns ?? []).forEach(index => columnStyles[index] = { halign: 'right' });

    autoTable(doc, {
        startY: 20,
        margin: { left: MARGIN, right: MARGIN },
        theme: 'plain',
        // Letra 9; 0,8 mm de margem vertical por célula (≈ 4,8 mm por linha)
        styles: { fontSize: 9, textColor: 0, fillColor: 255, cellPadding: { top: 0.8, bottom: 0.8, left: 1.2, right: 1.2 } },
        headStyles: { fontStyle: 'bold', textColor: 0, fillColor: 255, lineColor: 0, lineWidth: { bottom: 0.3 },
            cellPadding: { top: 1, bottom: 1, left: 1.2, right: 1.2 } },
        // Totais por baixo das colunas, separados por uma linha preta
        footStyles: { fontStyle: 'bold', textColor: 0, fillColor: 255, lineColor: 0, lineWidth: { top: 0.3 },
            cellPadding: { top: 1, bottom: 1, left: 1.2, right: 1.2 } },
        columnStyles,
        head: [data.head],
        body: data.body,
        foot: data.foot,
        showFoot: 'lastPage',
        // Cabeçalhos e totais das colunas alinhadas à direita também ficam à direita (por baixo dos valores)
        didParseCell: (hook) => {
            if ((hook.section === 'head' || hook.section === 'foot') && data.rightAlignedColumns?.includes(hook.column.index)) {
                hook.cell.styles.halign = 'right';
            }
        }
    });

    doc.save(data.fileName + '.pdf');
}

// "dd/mm/aaaa a dd/mm/aaaa" entre a data mais antiga e a mais recente dos registos exportados
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
