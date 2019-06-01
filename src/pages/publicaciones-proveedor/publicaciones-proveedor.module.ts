import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicacionesProveedorPage } from './publicaciones-proveedor';

@NgModule({
  declarations: [
    PublicacionesProveedorPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicacionesProveedorPage),
  ],
})
export class PublicacionesProveedorPageModule {}
