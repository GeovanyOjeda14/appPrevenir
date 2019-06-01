import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCitaUserPage } from './modal-cita-user';

@NgModule({
  declarations: [
    ModalCitaUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCitaUserPage),
  ],
})
export class ModalCitaUserPageModule {}
