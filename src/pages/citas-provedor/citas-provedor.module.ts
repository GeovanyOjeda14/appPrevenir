import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CitasProvedorPage } from './citas-provedor';
import { CalendarModule } from 'ionic3-calendar-en';

@NgModule({
  declarations: [
    CitasProvedorPage,
  ],
  imports: [
    IonicPageModule.forChild(CitasProvedorPage),
    CalendarModule
  ],
})
export class CitasProvedorPageModule {}
