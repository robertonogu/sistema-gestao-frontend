import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UserRole } from 'src/app/demo/api/auth';
import { ItemName } from 'src/app/demo/api/itemName';
import { AuthService } from 'src/app/demo/service/auth/auth.service';
import { UserService } from 'src/app/demo/service/auth/user.service';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';

// Utilizadores que podem entrar: administradores (backoffice) e funcionários (app de registos de trabalho no telemóvel).
// Não se apagam: desativam-se (deixam logo de conseguir entrar).
@Component({
  templateUrl: './users.component.html',
  providers: [ConfirmationService, MessageService]
})
export class UsersComponent implements OnInit {

  readonly roles: { label: string, value: UserRole }[] = [
    { label: 'Funcionário (app no telemóvel)', value: 'EMPLOYEE' },
    { label: 'Administrador (backoffice)', value: 'ADMIN' }
  ];

  loading = true;
  users: User[] = [];
  employeeNames: ItemName[] = [];

  // ===== Novo utilizador =====
  createDialog = false;
  submitted = false;
  saving = false;
  role: UserRole = 'EMPLOYEE';
  employeeId: number | null = null;
  username = '';
  password = '';

  // ===== Nova palavra-passe =====
  passwordDialog = false;
  passwordUser: User | null = null;
  newPassword = '';

  constructor(private userService: UserService, private employeeService: EmployeeService, public authService: AuthService,
              private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.employeeService.getEmployeeNames().subscribe(names => this.employeeNames = names);
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  roleLabel(role: UserRole): string {
    return role === 'ADMIN' ? 'Administrador' : 'Funcionário';
  }

  openNew(): void {
    this.role = 'EMPLOYEE';
    this.employeeId = null;
    this.username = '';
    this.password = '';
    this.submitted = false;
    this.createDialog = true;
  }

  // Sugere o utilizador a partir do nome do funcionário ("João Silva" → "joao.silva")
  onEmployeeChange(): void {
    if (this.username || !this.employeeId) return;
    const name = this.employeeNames.find(employee => employee.id === this.employeeId)?.name ?? '';
    const parts = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/\s+/).filter(Boolean);
    this.username = parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1]}` : (parts[0] ?? '');
  }

  create(): void {
    this.submitted = true;
    if (!this.username.trim() || this.password.length < 6 || (this.role === 'EMPLOYEE' && !this.employeeId)) return;
    this.saving = true;
    this.userService.createUser({ username: this.username.trim(), password: this.password, role: this.role, employeeId: this.employeeId })
      .subscribe({
        next: (user) => {
          this.saving = false;
          this.createDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Utilizador criado', detail: `Entra com "${user.username}" e a palavra-passe definida.` });
          this.loadUsers();
        },
        error: (err) => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível criar o utilizador.' });
        }
      });
  }

  openPassword(user: User): void {
    this.passwordUser = user;
    this.newPassword = '';
    this.submitted = false;
    this.passwordDialog = true;
  }

  changePassword(): void {
    this.submitted = true;
    if (!this.passwordUser || this.newPassword.length < 6) return;
    this.saving = true;
    this.userService.changePassword(this.passwordUser.userId, this.newPassword).subscribe({
      next: () => {
        this.saving = false;
        this.passwordDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Palavra-passe alterada' });
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível alterar.' });
      }
    });
  }

  toggleActive(user: User): void {
    const activate = !user.active;
    this.confirmationService.confirm({
      header: activate ? 'Ativar utilizador' : 'Desativar utilizador',
      message: activate
        ? `"${user.username}" volta a poder entrar.`
        : `"${user.username}" deixa logo de conseguir entrar (também no telemóvel).`,
      acceptLabel: activate ? 'Ativar' : 'Desativar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.userService.setActive(user.userId, activate).subscribe({
          next: () => this.loadUsers(),
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível alterar.' })
        });
      }
    });
  }
}
