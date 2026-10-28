import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { PrimeNGConfig } from 'primeng/api';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(private primengConfig: PrimeNGConfig, private swUpdate: SwUpdate) {}

    ngOnInit(): void {
        this.primengConfig.ripple = true;

        // PWA: com uma versão nova publicada, pergunta antes de recarregar (pode haver um formulário a meio)
        if (this.swUpdate.isEnabled) {
            this.swUpdate.versionUpdates
                .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
                .subscribe(() => {
                    if (confirm('Há uma versão nova da aplicação. Atualizar agora?')) document.location.reload();
                });
        }
    }
}
