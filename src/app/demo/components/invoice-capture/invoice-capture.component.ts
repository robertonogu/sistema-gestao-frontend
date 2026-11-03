import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InvoiceCapture } from 'src/app/demo/api/invoiceCapture';
import { InvoiceCaptureService } from 'src/app/demo/service/transactions/invoiceCapture.service';

type PageState = 'loading' | 'blocked' | 'ready' | 'sending' | 'done' | 'error' | 'invalid';

@Component({
  selector: 'app-invoice-capture',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './invoice-capture.component.html'
})
export class InvoiceCaptureComponent implements OnInit, OnDestroy {

  token = '';
  state: PageState = 'loading';
  message = '';
  previewUrl: string | null = null;
  capture: InvoiceCapture | null = null;
  private pollTimer: any = null;

  constructor(private route: ActivatedRoute, private invoiceCaptureService: InvoiceCaptureService) { }

  ngOnInit(): void {
    const tokenFromQr = this.route.snapshot.params['token'];
    if (tokenFromQr) this.invoiceCaptureService.storeSession(tokenFromQr);
    const token = tokenFromQr ?? this.invoiceCaptureService.storedSessionToken();
    if (!token) {
      this.state = 'invalid';
      return;
    }
    this.token = token;
    this.refresh();
    this.pollTimer = setInterval(() => this.refresh(), 3000);
  }

  ngOnDestroy(): void {
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  }

  private refresh(): void {
    if (this.state === 'sending' || this.state === 'invalid') return;
    this.invoiceCaptureService.get(this.token).subscribe({
      next: (capture) => this.applyPcState(capture),
      error: (err) => {
        if (err?.status === 0) return;
        this.state = 'invalid';
        if (this.pollTimer) clearInterval(this.pollTimer);
      }
    });
  }

  private applyPcState(capture: InvoiceCapture): void {
    if (this.state === 'sending' || this.state === 'invalid') return;
    if (capture.pcWaiting) {
      if (this.state === 'loading' || this.state === 'blocked' || this.state === 'done') {
        this.state = 'ready';
        this.capture = null;
        if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = null;
      }
    } else if (this.state === 'loading' || this.state === 'ready' || this.state === 'error') {
      this.state = 'blocked';
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.state = 'sending';
    this.message = 'A preparar a fotografia…';
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

    const { blob, name } = await this.invoiceCaptureService.prepareFile(file);
    this.message = 'A ler a fatura… pode demorar alguns segundos.';
    this.invoiceCaptureService.upload(this.token, blob, name).subscribe({
      next: (capture) => {
        this.capture = capture;
        if (capture.status === 'READY') {
          this.state = 'done';
        } else {
          this.state = 'error';
          this.message = capture.errorMessage ?? 'Não foi possível ler a fatura.';
        }
      },
      error: (err) => {
        this.state = 'error';
        this.message = err?.error?.message ?? 'Não foi possível enviar a fotografia. Verifique a ligação e tente de novo.';
      }
    });
  }
}
