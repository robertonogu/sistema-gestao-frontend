import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../../api/auth';
import { AuthService } from './auth.service';

// Sem sessão vai para o login (e volta depois à mesma página); com o perfil errado vai para a sua área
function requireRole(role: UserRole): CanActivateFn {
    return (_route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const session = authService.session;
        if (!session) return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
        if (session.role !== role) return router.parseUrl(authService.homeRoute());
        return true;
    };
}

// Backoffice
export const adminGuard = requireRole('ADMIN');

// App do funcionário
export const employeeGuard = requireRole('EMPLOYEE');
