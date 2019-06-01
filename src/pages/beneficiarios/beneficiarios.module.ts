import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeneficiariosPage } from './beneficiarios';

@NgModule({
  declarations: [
    BeneficiariosPage,
  ],
  imports: [
    IonicPageModule.forChild(BeneficiariosPage),
  ],
})
export class BeneficiariosPageModule {}
