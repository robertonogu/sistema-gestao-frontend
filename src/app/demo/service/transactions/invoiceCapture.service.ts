import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InvoiceCapture } from '../../api/invoiceCapture';

// Fotografias maiores são reduzidas no browser antes de enviar (rede móvel); o QR e a IA leem bem a este tamanho
const MAX_IMAGE_SIDE = 2400;

@Injectable({
    providedIn: 'root'
})
export class InvoiceCaptureService {

    private invoiceCapturesUrl = `${environment.apiUrl}/invoiceCaptures`;

    constructor(private http: HttpClient) { }

    create(): Observable<InvoiceCapture> {
        return this.http.post<InvoiceCapture>(this.invoiceCapturesUrl, {});
    }

    get(token: string): Observable<InvoiceCapture> {
        return this.http.get<InvoiceCapture>(`${this.invoiceCapturesUrl}/${token}`);
    }

    upload(token: string, file: Blob, fileName: string): Observable<InvoiceCapture> {
        const form = new FormData();
        form.append('file', file, fileName);
        return this.http.post<InvoiceCapture>(`${this.invoiceCapturesUrl}/${token}/file`, form);
    }

    // Imagem PNG com o QR que abre a página do telemóvel para esta leitura
    qrImageUrl(token: string): string {
        return `${this.invoiceCapturesUrl}/qr?url=${encodeURIComponent(this.capturePageUrl(token))}`;
    }

    capturePageUrl(token: string): string {
        return `${window.location.origin}${window.location.pathname}#/capture/${token}`;
    }

    // PDFs seguem como estão; imagens grandes são reduzidas e enviadas em JPEG
    async prepareFile(file: File): Promise<{ blob: Blob, name: string }> {
        if (file.type === 'application/pdf' || !file.type.startsWith('image/')) return { blob: file, name: file.name };

        const bitmap = await createImageBitmap(file).catch(() => null);
        if (!bitmap) return { blob: file, name: file.name };
        const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
        if (scale === 1 && (file.type === 'image/jpeg' || file.type === 'image/png')) return { blob: file, name: file.name };

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
        return blob ? { blob, name: 'fatura.jpg' } : { blob: file, name: file.name };
    }
}
