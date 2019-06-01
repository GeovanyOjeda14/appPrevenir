import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPage } from './user';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    UserPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPage),
    PipesModule
  ],
  exports: [
    UserPage
  ]
})
export class UserPageModule {}
