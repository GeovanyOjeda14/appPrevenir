import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgregarMedicoPage } from './agregar-medico';

@NgModule({
  declarations: [
    AgregarMedicoPage,
  ],
  imports: [
    IonicPageModule.forChild(AgregarMedicoPage),
  ],
})
export class AgregarMedicoPageModule {}
