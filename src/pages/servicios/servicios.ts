import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,PopoverController,Loading,
  LoadingController,ToastController, Platform , IonicApp} from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ServicioPage } from '../servicio/servicio';
import {PopoverFiltroPage} from '../popover-filtro/popover-filtro';
import {Global} from '../../app/global';
import { HomePage } from '../home/home';

/**
 * Generated class for the ServiciosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-servicios',
  templateUrl: 'servicios.html',
})
export class ServiciosPage {
  services //varible para cargar los datos de servicio
 ServicePage;
 loading: Loading;
 busqueda :string ="";
 inf = [];
 in=[];
 url;
 mostrar;
 mascota;
 estrellasAmarillas=[];
 estrellasGrises=[];
 load;


  constructor(public navCtrl: NavController, public navParams: NavParams, public api:ApiProvider,
    private popoverCtr : PopoverController,public loadingCtrl: LoadingController,private toastCtrl:ToastController,
    private global : Global, private platform : Platform , private app : IonicApp) {

      this.url = this.global.apiUrl;
      this.mostr();
      this.mostrar = this.navParams.get('vacio');
      this.mascota = this.navParams.get('mascota');
      
      
      // console.log(this.mascota);
      // console.log(this.mostrar);

      


  }



  mostr(){
    this.services = this.navParams.get('servicios');
    console.log(this.services);
    
  }

  ionViewDidLoad() {
    // this.servicios();
    // this.calificacion();
  }

  ionViewCanLeave(){

    const overlayView = this.app._overlayPortal._views[0];
    if (overlayView && overlayView.dismiss) {
    overlayView.dismiss();// cerrará los modales, alertas, etc
    } 
   
  }

getItems(ev: any) {
  // Reset items back to all of the items
  this.mostr();

  // set val to the value of the searchbar
  const val = ev.target.value;

  // if the value is an empty string don't filter the items
  if (val && val.trim() != '') {
    
    this.services = this.services.filter((servicio) => {
     
      return (servicio.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1  || servicio.descripcion.toLowerCase().indexOf(val.toLowerCase()) > -1);
    })
  }
}




cancel(ev:any){
  this.inf=[];
  this.mostr();
 }

  
  goToServicio(servicio)
  {
    // console.log(this.mascota);
    this.navCtrl.push(ServicioPage,{servicio:servicio , mascota : this.mascota})
  }

  popover(event){
    let popover = this.popoverCtr.create(PopoverFiltroPage,{mascota:this.mascota});
    popover.present({ev : event});
    popover.onDidDismiss((data)=>{
     
      if(!data)
      {
        // console.log("No hay datos");
      }else{
        // this.loading = this.loadingCtrl.create({
        //       spinner: 'hide',
        //       content: "Espera un momento<br>estamos cargando información... ",
             
        //     });
        //     this.loading.present();
        this.load = true;

        this.api.getBusqueda(data.municipio,data.categoria).subscribe((res)=>{
          let a = res[0].vacio;
          if (a === true){
            this.inf = [];
            // this.loading.dismiss();
            this.load = false;
            this.mostrar = true;
          }else{
            this.mostrar = false;
            this.inf = [];
            // this.loading.dismiss();
            this.load = false;
            this.services = res;
            console.log(this.services);
          }

        },(err)=>{
          this.load = false;
          this.presentToast("Error en la conexión, intentalo más tarde.");
          // console.log(err);
        });
      }




    });
  } 

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}

  // calificacion(){

  //   let calificacion:number = 4;

  //   let resultado =  5  - calificacion;
    
  //   // console.log(resultado);
    
  //   for(let i = 0; i < calificacion ; i++){
  //     let id = "amarilla";
  //     this.estrellasAmarillas.push({id:id});
  //   }

  //   if(resultado >= 1){
  //     for(let i = 0; i < resultado ; i++){
  //       let id = "gris";
  //       this.estrellasGrises.push({id:id});
  //     }
  //   }
    
  // }

  
  // servicios(){
  //   this.loading = this.loadingCtrl.create({
  //     spinner: 'hide',
  //     content: "Espera un momento<br>estamos cargando información... ",
  //     duration: 3000
  //   });
  //   this.loading.present();
  //   this.api.getServicios().subscribe((data)=>{
  //     this.services=data;
  //     // console.log(this.services);
  //     this.info();
  //     this.loading.dismiss();
      
  //   },(error)=>{
  //     this.loading.dismiss();
  //     this.presentToast("Error en la conexión intentalo más tarde")
  //     console.log(error);
  //   });
  // }

  // info(){

   
  //   // console.log(this.services);
  //   for(var i = 0; i < this.services.length; i ++){
     
  //     let categoria = this.services[i].categoria;
  //     let duracion = this.services[i].duracion;
  //     let descuento = this.services[i].descuento;
  //     let nombre = this.services[i].nombre;
  //     let precio = this.services[i].precio;
  //     let descripcion = this.services[i].descripcion;
  //     let fot = this.services[i];
  //     let id_servicios = this.services[i].id_servicios;
  //     let id_provedores = this.services[i].id_provedores;
  //     let precio_cliente_prevenir = this.services[i].precio_cliente_prevenir;
  //     let video = this.services[i].video;
  //     let fotos = this.services[i].foto;
  //     let direccion = this.services[i].direccion;
      
  //     fot = fot.foto[0];
  //     fot = this.url+fot.ruta;
  //     // console.log(fot.ruta);
      
  //     this.inf.push({categoria:categoria,descuento:descuento,nombre:nombre,descripcion:descripcion,foto:fot,
  //                     id_servicio:id_servicios,id_provedores:id_provedores, duracion:duracion,precio:precio,
  //                     precio_cliente_prevenir:precio_cliente_prevenir, video:video, fotos:fotos , direccion:direccion });
  //   }
  //   console.log(this.inf);
  //   this.in = this.inf;
  // }



     
//   getItems(ev: any) {

//      this.initializeItems();
//      const val = ev.target.value;
//      if (val && val.trim() != '') {
//       this.inf = this.inf.filter((servicio) => {
//        return (servicio.nombre.toLowerCase() && servicio.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
//      }
//      );
//     }
// }
