import { Location } from '@angular/common';
import { Component } from '@angular/core';
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

  constructor(
    private _location: Location,
    private messageService: MessageService,
    private vehicleService: VehicleService) { }

  ngOnInit(): void {
  }

  back() {
    this._location.back();
  }

  newVehicle() {
    console.log(this.selectedInsurancePeriodicity)
    this.vehicle = { vehicleType: this.selectedVehicleType, registration: this.registration, registrationDate: this.registrationDate, inspectionDate: this.inspectionDate, insuranceDate: this.insuranceDate, insurancePeriodicity: this.selectedInsurancePeriodicity, valueKilometer: this.valueKilometer } as VehicleCreation;

    if (this.vehicle != null) {
      this.vehicleService.createVehicle(this.vehicle).subscribe(newVehicleCost => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Veículo adicionado com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
