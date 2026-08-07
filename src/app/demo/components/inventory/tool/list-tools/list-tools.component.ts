import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Tool } from 'src/app/demo/api/tool';
import { ToolStatus } from 'src/app/demo/data/enum/toolStatus';
import { ToolService } from 'src/app/demo/service/inventory/tool.service';

@Component({
  templateUrl: './list-tools.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListToolsComponent {

  toolStatus: any = ToolStatus;

  loading: boolean = true;
  totalRecords: number = 0;
  tools!: Tool[];

  currentPage: number = 0;
  pageSize: number = 20;

  constructor(
    private toolService: ToolService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    this.toolService.getTools(this.currentPage, this.pageSize).subscribe((tools) => {
      this.tools = tools.objectList;
      this.totalRecords = tools.totalElements;
      this.loading = false;
    });
  }

  newTool() {
    this.router.navigate(['./inventory/tools/create-tool']);
  }

  deleteTool(tool: Tool) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.toolService.deleteTool(tool.toolId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ferramenta eliminada com sucesso.' });
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
