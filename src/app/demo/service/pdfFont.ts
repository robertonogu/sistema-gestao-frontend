import jsPDF from 'jspdf';

export const PDF_FONT = 'calibri';

const FILES: { [style: string]: string } = {
    normal: 'assets/fonts/calibri.ttf',
    bold: 'assets/fonts/calibrib.ttf'
};

const cache: { [style: string]: Promise<string> } = {};

function loadBase64(url: string): Promise<string> {
    if (!cache[url]) {
        cache[url] = fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(blob);
            }));
    }
    return cache[url];
}

/**
 * Regista a fonte Calibri (normal e negrito) no documento jsPDF.
 * Se o carregamento falhar, devolve 'helvetica' para o PDF continuar a ser gerado.
 */
export async function registerPdfFont(doc: jsPDF): Promise<string> {
    try {
        for (const style of Object.keys(FILES)) {
            const base64 = await loadBase64(FILES[style]);
            const fileName = `${PDF_FONT}-${style}.ttf`;
            doc.addFileToVFS(fileName, base64);
            doc.addFont(fileName, PDF_FONT, style);
        }
        return PDF_FONT;
    } catch {
        return 'helvetica';
    }
}
