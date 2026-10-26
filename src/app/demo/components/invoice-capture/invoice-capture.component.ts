import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InvoiceCapture } from 'src/app/demo/api/invoiceCapture';
import { InvoiceCaptureService } from 'src/app/demo/service/transactions/invoiceCapture.service';

type PageState = 'loading' | 'ready' | 'sending' | 'done' | 'error' | 'invalid';

// Página do telemóvel aberta pelo QR mostrado no PC (Nova Despesa > Ler fatura): fotografa a fatura e envia-a.
// O PC está a consultar a mesma leitura e preenche a despesa assim que os dados ficam prontos.
@Component({
  selector: 'app-invoice-capture',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './invoice-capture.component.html'
})
export class InvoiceCaptureComponent implements OnInit {

  token = '';
  state: PageState = 'loading';
  message = '';
  previewUrl: string | null = null;
  capture: InvoiceCapture | null = null;

  constructor(private route: ActivatedRoute, private invoiceCaptureService: InvoiceCaptureService) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
    this.invoiceCaptureService.get(this.token).subscribe({
      next: (capture) => {
        this.capture = capture;
        if (capture.status === 'READY') {
          this.state = 'done';
        } else {
          this.state = 'ready';
        }
      },
      error: () => this.state = 'invalid'
    });
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
