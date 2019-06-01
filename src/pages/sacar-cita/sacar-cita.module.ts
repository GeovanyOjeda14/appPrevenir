import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SacarCitaPage } from './sacar-cita';
import { CalendarModule } from 'ionic3-calendar-en';

@NgModule({
  declarations: [
    SacarCitaPage,
  ],
  imports: [
    IonicPageModule.forChild(SacarCitaPage),
    CalendarModule,
  ],
  
  
})
export class SacarCitaPageModule {}
