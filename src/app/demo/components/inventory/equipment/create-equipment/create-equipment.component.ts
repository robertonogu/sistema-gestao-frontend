import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { EquipmentImage } from 'src/app/demo/api/equipment';
import { EquipmentCategory } from 'src/app/demo/data/enum/equipmentCategory';
import { EquipmentStatus } from 'src/app/demo/data/enum/equipmentStatus';
import { EquipmentCreation } from 'src/app/demo/data/model/equipmentCreation.model';
import { EquipmentService } from 'src/app/demo/service/inventory/equipment.service';

@Component({
  templateUrl: './create-equipment.component.html',
  providers: [MessageService],
  styles: [`
    :host ::ng-deep .upload-plain.p-fileupload .p-fileupload-buttonbar,
    :host ::ng-deep .upload-plain.p-fileupload .p-fileupload-content {
      background: transparent;
      border: 0;
      padding-left: 0;
      padding-right: 0;
    }
    :host ::ng-deep .upload-plain.p-fileupload .p-progressbar {
      display: none;
    }
  `]
})
export class CreateEquipmentComponent {

  equipmentStatus = EquipmentStatus;
  equipmentCategory = EquipmentCategory;

  code!: string;
  name!: string;
  brand!: string;
  model!: string;
  serialNumber!: string;
  purchaseDate!: Date;
  purchaseValue!: number;
  warrantyStart!: Date;
  warrantyEnd!: Date;
  power!: string;
  selectedStatus!: EquipmentStatus;
  selectedCategory: any = 'INDUSTRIAL';

  equipment!: EquipmentCreation;

  editingEquipmentId: number | null = null;
  viewMode = false;

  purchaseDocumentUrl: string | null = null;
  images: EquipmentImage[] = [];
  pendingDocument: File | null = null;

  @ViewChild('documentUpload') documentUpload?: FileUpload;
  @ViewChild('imagesUpload') imagesUpload?: FileUpload;

  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private equipmentService: EquipmentService) { }

  ngOnInit(): void {
    const equipmentId = Number(this.route.snapshot.params['equipmentId']);
    this.viewMode = this.route.snapshot.data['mode'] === 'view';
    if (equipmentId) {
      this.editingEquipmentId = equipmentId;
      this.equipmentService.getEquipment(equipmentId).subscribe(equipment => {
        this.code = equipment.code;
        this.name = equipment.name;
        this.brand = equipment.brand;
        this.model = equipment.model;
        this.serialNumber = equipment.serialNumber;
        this.purchaseDate = this.toDate(equipment.purchaseDate);
        this.purchaseValue = equipment.purchaseValue;
        this.warrantyStart = this.toDate(equipment.warrantyStart);
        this.warrantyEnd = this.toDate(equipment.warrantyEnd);
        this.power = equipment.power;
        this.selectedStatus = equipment.status;
        this.selectedCategory = equipment.category;
        this.purchaseDocumentUrl = equipment.purchaseDocumentUrl ?? null;
      });
      this.equipmentService.getImages(equipmentId).subscribe(images => this.images = images);
    }
  }

  onDocumentSelect(event: { currentFiles: File[] }): void {
    const file = event.currentFiles?.[0];
    if (!file) {
      return;
    }
    if (!this.editingEquipmentId) {
      this.pendingDocument = file;
      return;
    }
    this.equipmentService.uploadPurchaseDocument(this.editingEquipmentId, file).subscribe({
      next: equipment => {
        this.purchaseDocumentUrl = equipment.purchaseDocumentUrl ?? null;
        this.documentUpload?.clear();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Documento de compra guardado.' });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível enviar o documento.' })
    });
  }

  removeDocument(): void {
    if (!this.editingEquipmentId) {
      return;
    }
    this.equipmentService.deletePurchaseDocument(this.editingEquipmentId).subscribe(() => {
      this.purchaseDocumentUrl = null;
    });
  }

  formatSize(bytes: number): string {
    if (!bytes) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + units[i];
  }

  uploadImages(event: { files: File[] }): void {
    if (!this.editingEquipmentId || !event.files.length) {
      return;
    }
    this.equipmentService.addImages(this.editingEquipmentId, event.files).subscribe({
      next: images => {
        this.images = images;
        this.imagesUpload?.clear();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Imagens guardadas.' });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível enviar as imagens.' })
    });
  }

  removeImage(image: EquipmentImage): void {
    this.equipmentService.deleteImage(image.equipmentId, image.equipmentImageId).subscribe(() => {
      this.images = this.images.filter(i => i.equipmentImageId !== image.equipmentImageId);
    });
  }

  private uploadPendingFiles(equipmentId: number): void {
    if (this.pendingDocument) {
      this.equipmentService.uploadPurchaseDocument(equipmentId, this.pendingDocument).subscribe();
    }
    const images = this.imagesUpload?.files ?? [];
    if (images.length) {
      this.equipmentService.addImages(equipmentId, images).subscribe();
    }
    this.pendingDocument = null;
    this.documentUpload?.clear();
    this.imagesUpload?.clear();
  }

  private toDate(value: any): Date {
    return value ? new Date(value) : undefined as any;
  }

  edit() {
    this.router.navigate(['./inventory/equipments/edit-equipment', this.editingEquipmentId]);
  }

  back() {
    this._location.back();
  }

  newEquipment() {
    if (!this.editingEquipmentId && this.code && !/^\d{4}\.\d{5}$/.test(this.code.trim())) {
      this.messageService.add({ severity: 'error', summary: 'Código inválido', detail: 'O código deve ter o formato AAAA.NNNNN (ex.: 2026.00001).' });
      return;
    }

    this.equipment = {
      code: this.code,
      name: this.name,
      brand: this.brand,
      model: this.model,
      serialNumber: this.serialNumber,
      purchaseDate: this.purchaseDate,
      purchaseValue: this.purchaseValue,
      warrantyStart: this.warrantyStart,
      warrantyEnd: this.warrantyEnd,
      power: this.power,
      status: this.selectedStatus,
      category: this.selectedCategory
    } as EquipmentCreation;

    if (this.editingEquipmentId) {
      const equipmentId = this.editingEquipmentId;
      this.equipmentService.updateEquipment(equipmentId, this.equipment).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Equipamento atualizado com sucesso.' });
        const pendingImages = this.imagesUpload?.files ?? [];
        if (pendingImages.length) {
          this.uploadImages({ files: pendingImages });
        }
      });
      return;
    }

    if (this.equipment != null) {
      this.equipmentService.createEquipment(this.equipment).subscribe(created => {
        this.uploadPendingFiles(created.equipmentId);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Equipamento adicionado com sucesso.' });
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
    this.serialNumber = undefined as any;
    this.purchaseDate = undefined as any;
    this.purchaseValue = undefined as any;
    this.warrantyStart = undefined as any;
    this.warrantyEnd = undefined as any;
    this.power = undefined as any;
    this.selectedStatus = undefined as any;
    this.selectedCategory = 'INDUSTRIAL';
  }
}
