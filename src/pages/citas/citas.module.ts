import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CitasPage } from './citas';

@NgModule({
  declarations: [
    CitasPage,
  ],
  imports: [
    IonicPageModule.forChild(CitasPage),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class CitasPageModule {}
