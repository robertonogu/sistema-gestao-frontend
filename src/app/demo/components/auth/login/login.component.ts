import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/demo/service/auth/auth.service';

// Login: o administrador vai para o backoffice (ou para a página onde estava), o funcionário para a app (#/app)
@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    username = '';
    password = '';
    loading = false;
    error: string | null = null;
    expired = false;

    constructor(private layoutService: LayoutService, private authService: AuthService,
                private router: Router, private route: ActivatedRoute) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    ngOnInit(): void {
        this.expired = !!this.route.snapshot.queryParams['expired'];
        if (this.authService.session) this.router.navigateByUrl(this.authService.homeRoute());
    }

    login(): void {
        if (!this.username.trim() || !this.password) {
            this.error = 'Indique o utilizador e a palavra-passe.';
            return;
        }
        this.loading = true;
        this.error = null;
        this.authService.login(this.username.trim(), this.password).subscribe({
            next: (session) => {
                this.loading = false;
                const returnUrl: string | undefined = this.route.snapshot.queryParams['returnUrl'];
                // O endereço de onde veio só serve se for da área deste perfil
                const fitsRole = returnUrl && returnUrl.startsWith('/app') === (session.role === 'EMPLOYEE');
                this.router.navigateByUrl(fitsRole ? returnUrl : this.authService.homeRoute());
            },
            error: (err) => {
                this.loading = false;
                this.error = err?.status === 0
                    ? 'Sem ligação ao servidor. Verifique a internet e tente de novo.'
                    : err?.error?.message ?? 'Não foi possível entrar. Tente de novo.';
            }
        });
    }
}
