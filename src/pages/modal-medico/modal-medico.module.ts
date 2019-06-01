import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalMedicoPage } from './modal-medico';

@NgModule({
  declarations: [
    ModalMedicoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalMedicoPage),
  ],
})
export class ModalMedicoPageModule {}
