import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicarServicioPage } from './publicar-servicio';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PublicarServicioPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicarServicioPage),
    PipesModule
  ],
  exports: [
    PublicarServicioPage
  ]
})
export class PublicarServicioPageModule {}
