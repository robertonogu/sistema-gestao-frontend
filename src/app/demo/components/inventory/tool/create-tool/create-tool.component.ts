import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Origin } from 'src/app/demo/api/origin';
import { ToolStatus } from 'src/app/demo/data/enum/toolStatus';
import { ToolCreation } from 'src/app/demo/data/model/toolCreation.model';
import { OriginService } from 'src/app/demo/service/company/originService';
import { ToolService } from 'src/app/demo/service/inventory/tool.service';

@Component({
  templateUrl: './create-tool.component.html',
  providers: [MessageService]
})
export class CreateToolComponent {

  toolStatus = ToolStatus;

  code!: string;
  name!: string;
  brand!: string;
  model!: string;
  purchaseDate!: Date;
  purchaseValue!: number;
  location!: string;
  selectedStatus!: ToolStatus;
  documentNumber!: string;
  selectedOrigin!: number;

  origins!: Origin[];

  // Comprada numa despesa: documento e fornecedor vêm da despesa e não se editam aqui
  fromExpense: boolean = false;

  tool!: ToolCreation;

  editingToolId: number | null = null;

  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private toolService: ToolService,
    private originService: OriginService) { }

  ngOnInit(): void {
    this.originService.getOriginsGrouped().subscribe(origins => {
      this.origins = origins;
    });

    const toolId = Number(this.route.snapshot.params['toolId']);
    if (toolId) {
      this.editingToolId = toolId;
      this.toolService.getTool(toolId).subscribe(tool => {
        this.code = tool.code;
        this.name = tool.name;
        this.brand = tool.brand;
        this.model = tool.model;
        this.purchaseDate = tool.purchaseDate ? new Date(tool.purchaseDate) : undefined as any;
        this.purchaseValue = tool.purchaseValue;
        this.location = tool.location;
        this.selectedStatus = tool.status;
        this.documentNumber = tool.documentNumber as string;
        this.selectedOrigin = tool.originId as number;
        this.fromExpense = tool.fromExpense;
      });
    }
  }

  back() {
    this._location.back();
  }

  newTool() {
    this.tool = { code: this.code, name: this.name, brand: this.brand, model: this.model, purchaseDate: this.purchaseDate, purchaseValue: this.purchaseValue, location: this.location, status: this.selectedStatus,
      documentNumber: this.documentNumber, originId: this.selectedOrigin ?? undefined } as ToolCreation;

    if (this.editingToolId) {
      this.toolService.updateTool(this.editingToolId, this.tool).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ferramenta atualizada com sucesso.' });
      });
      return;
    }

    if (this.tool != null) {
      this.toolService.createTool(this.tool).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ferramenta adicionada com sucesso.' });
        this.resetForm();
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

  private resetForm(): void {
    this.code = undefined as any;
    this.name = undefined as any;
    this.brand = undefined as any;
    this.model = undefined as any;
    this.purchaseDate = undefined as any;
    this.purchaseValue = undefined as any;
    this.location = undefined as any;
    this.selectedStatus = undefined as any;
    this.documentNumber = undefined as any;
    this.selectedOrigin = undefined as any;
  }
}
