import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoPublicacionesPage } from './listado-publicaciones';

@NgModule({
  declarations: [
    ListadoPublicacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoPublicacionesPage),
  ],
})
export class ListadoPublicacionesPageModule {}
