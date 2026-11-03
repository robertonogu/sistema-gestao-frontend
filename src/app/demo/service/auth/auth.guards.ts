import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../../api/auth';
import { AuthService } from './auth.service';

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

export const adminGuard = requireRole('ADMIN');

export const employeeGuard = requireRole('EMPLOYEE');
