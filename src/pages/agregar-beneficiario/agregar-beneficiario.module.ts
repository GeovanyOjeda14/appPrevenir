import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgregarBeneficiarioPage } from './agregar-beneficiario';

@NgModule({
  declarations: [
    AgregarBeneficiarioPage,
  ],
  imports: [
    IonicPageModule.forChild(AgregarBeneficiarioPage),
  ],
})
export class AgregarBeneficiarioPageModule {}
