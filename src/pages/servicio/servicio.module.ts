import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicioPage } from './servicio';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [
    ServicioPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicioPage),
    PipesModule
  ],
  exports: [
  ServicioPage
]
})
export class ServicioPageModule {}
