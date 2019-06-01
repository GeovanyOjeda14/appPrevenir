import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CitasPage } from '../pages/citas/citas';
import { ContactenosPage } from '../pages/contactenos/contactenos';
import { HomePage } from '../pages/home/home';
import { ServiciosPage } from '../pages/servicios/servicios';
import { TerminosPage } from '../pages/terminos/terminos';
import {UserPage} from '../pages/user/user';
import { SacarCitaPage } from '../pages/sacar-cita/sacar-cita';
import { WelcomePage } from '../pages/welcome/welcome';
import {BeneficiariosPage} from '../pages/beneficiarios/beneficiarios';
import {BlancoPage} from '../pages/blanco/blanco';
import {ListadoPublicacionesPage} from '../pages/listado-publicaciones/listado-publicaciones';
import {Global} from './global';
import { Storage } from '@ionic/storage';
import {PublicarServicioPage} from '../pages/publicar-servicio/publicar-servicio';
import { ServicioPage } from '../pages/servicio/servicio';
import {ApiProvider} from '../providers/api/api';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { MedicosPage } from '../pages/medicos/medicos';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav : Nav;
  rootPage : any;
  pages : Array<{titulo:string, component:any, icon:string}>;
  // servicios : Array<{nombre:string, component:any, descripcion:string, duracion:string}>;
 


  constructor(public platform: Platform,public  statusBar: StatusBar,public splashScreen: SplashScreen,
     public global:Global, public alertCtrl: AlertController, private api:ApiProvider) {
    
    this.rootPage = BlancoPage;

   
  // this.split = this.id_usuario.split('"');
  // console.log(this.split);


    // this.pages = [
    // { titulo:'Servicios', component:ServiciosPage, icon:'medkit'  },
    // { titulo:'Historial de citas', component:CitasPage, icon:'clipboard'  },
    // { titulo:'Terminos y condiciones', component:TerminosPage, icon:'book'  },
    // { titulo:'Contactenos', component:ContactenosPage, icon:'call'  },

    
    // ];
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.platform.registerBackButtonAction(() => {
        
        console.log(this.nav._views);
        if(this.nav._views.length == 1) {
          let alert = this.alertCtrl.create({
            title: 'Confirmación',
            message: '¿Desea salir de la aplicación?',
            buttons: [{
              text: 'Aceptar',
              handler: () => this.platform.exitApp()
            }, {
              text: 'Cancelar',
              role: 'cancel'
            }]
          });

          alert.present();
        } else {
          this.nav.pop();
        }
      });
    });

  }



 goToUser(){
   this.nav.push(UserPage);
 }

 goToService(){
   this.nav.push(ServiciosPage);
 }
 goToHistorial(){
   this.nav.push(CitasPage);
 }

 goToPage(page){
   this.nav.setRoot(page);
 }

 pubicar(){
   this.nav.push(ListadoPublicacionesPage);
 }
 beneficiarios(){
   this.nav.push(BeneficiariosPage)
 }
 goToTerminos(){
   this.nav.push(TerminosPage);
 }
 goToContactenos(){
   this.nav.push(ContactenosPage);
 }
 goToMedicos(){
   this.nav.push(MedicosPage);
 }

 logOut(){
  localStorage.clear();
  this.global.infoPerfil={};
  this.global.login = false;
  this.global.foto=null;
  this.global.nombre=null;
  this.global.id_usuario = null;
  this.global.medico = false;
  // console.log(this.global);
  this.nav.setRoot(WelcomePage);

 }

}
