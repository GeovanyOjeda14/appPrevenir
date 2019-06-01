import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormularioRegistroAdminPage } from './formulario-registro-admin';

@NgModule({
  declarations: [
    FormularioRegistroAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(FormularioRegistroAdminPage),
  ],
})
export class FormularioRegistroAdminPageModule {}
