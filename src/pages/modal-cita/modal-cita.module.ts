import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCitaPage } from './modal-cita';

@NgModule({
  declarations: [
    ModalCitaPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCitaPage),
  ],
})
export class ModalCitaPageModule {}
