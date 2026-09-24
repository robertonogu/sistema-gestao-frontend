import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/demo/api/vehicle';
import { InsurancePeriodicity } from 'src/app/demo/data/enum/insurancePeriodicity';
import { VehicleType } from 'src/app/demo/data/enum/vehicleType';
import { VehicleCreation } from 'src/app/demo/data/model/vehicleCreation.model';
import { VehicleService } from 'src/app/demo/service/inventory/vehicle.service';

@Component({
  templateUrl: './create-vehicle.component.html',
  providers: [MessageService]
})
export class CreateVehicleComponent {

  insurancePeriodicity = InsurancePeriodicity;
  vehicleType = VehicleType;

  selectedVehicleType!: VehicleType;
  registration!: string;
  registrationDate!: Date;
  inspectionDate!: Date;
  insuranceDate!: Date;
  selectedInsurancePeriodicity!: InsurancePeriodicity;
  valueKilometer!: number;

  vehicle!: VehicleCreation;

  editingVehicleId: number | null = null;

  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private vehicleService: VehicleService) { }

  ngOnInit(): void {
    const vehicleId = Number(this.route.snapshot.params['vehicleId']);
    if (vehicleId) {
      this.editingVehicleId = vehicleId;
      this.vehicleService.getVehicle(vehicleId).subscribe(vehicle => {
        this.selectedVehicleType = vehicle.vehicleType;
        this.registration = vehicle.registration;
        this.registrationDate = this.toDate(vehicle.registrationDate);
        this.inspectionDate = this.toDate(vehicle.inspectionDate);
        this.insuranceDate = this.toDate(vehicle.insuranceDate);
        this.selectedInsurancePeriodicity = vehicle.insurancePeriodicity;
        this.valueKilometer = vehicle.valueKilometer;
      });
    }
  }

  private toDate(value: any): Date {
    return value ? new Date(value) : undefined as any;
  }

  back() {
    this._location.back();
  }

  newVehicle() {
    this.vehicle = { vehicleType: this.selectedVehicleType, registration: this.registration, registrationDate: this.registrationDate, inspectionDate: this.inspectionDate, insuranceDate: this.insuranceDate, insurancePeriodicity: this.selectedInsurancePeriodicity, valueKilometer: this.valueKilometer } as VehicleCreation;

    if (this.editingVehicleId) {
      this.vehicleService.updateVehicle(this.editingVehicleId, this.vehicle).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Viatura atualizada com sucesso.' });
      });
      return;
    }

    if (this.vehicle != null) {
      this.vehicleService.createVehicle(this.vehicle).subscribe(newVehicleCost => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Veículo adicionado com sucesso.' });
        this.resetForm();
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

  private resetForm(): void {
    this.selectedVehicleType = undefined as any;
    this.registration = undefined as any;
    this.registrationDate = undefined as any;
    this.inspectionDate = undefined as any;
    this.insuranceDate = undefined as any;
    this.selectedInsurancePeriodicity = undefined as any;
    this.valueKilometer = undefined as any;
  }
}
