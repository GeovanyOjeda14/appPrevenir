import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalBeneficiarioPage } from './modal-beneficiario';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ModalBeneficiarioPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalBeneficiarioPage),
    PipesModule
  ],
  exports: [
    ModalBeneficiarioPage
  ]
})
export class ModalBeneficiarioPageModule {}
