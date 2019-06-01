import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormularioRegistroPage } from './formulario-registro';

@NgModule({
  declarations: [
    FormularioRegistroPage,
  ],
  imports: [
    IonicPageModule.forChild(FormularioRegistroPage),
  ],
})
export class FormularioRegistroPageModule {}
