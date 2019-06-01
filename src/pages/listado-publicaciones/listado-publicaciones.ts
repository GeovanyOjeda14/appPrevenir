import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController , ToastController,Loading,
  LoadingController} from 'ionic-angular';
import{PublicarServicioPage} from '../publicar-servicio/publicar-servicio';
import {ApiProvider} from '../../providers/api/api';
import {Global} from '../../app/global';
import {ServicioPage} from '../servicio/servicio';
import {MedicosPage} from '../medicos/medicos';
 
/**
 * Generated class for the ListadoPublicacionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-publicaciones',
  templateUrl: 'listado-publicaciones.html',
})
export class ListadoPublicacionesPage {

  public publicaciones;
  public res;
  public token;
  loading: Loading;
  public inf=[];
  public url;
  mostrar:boolean;
  // info;
  imgs;
  horarios;
  infMedicos;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api : ApiProvider,
    private global:Global,private alertCtrl: AlertController,private toastCtrl:ToastController,
    public loadingCtrl: LoadingController) {
      
      this.url = global.apiUrl;
  }

  ionViewDidLoad() {
    
  
  }

  ionViewWillEnter() {
    this.inf=[];
    this.getPublicaciones();
    // this.imgs={};
    }

  
  
  getPublicaciones(){
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando información... ",
    // });
    // this.loading.present();
    this.load = true;
    let id = this.global.id_usuario;
    this.api.getPublicacionesProveedor(id).subscribe((res)=>{
      // console.log(res);
      // this.loading.dismiss();
      this.load = false;
     
      let a = res[0].vacio;
      
      if(a === true){
        this.inf=[];
        this.mostrar = true;
      }else{
        this.mostrar = false;
        this.publicaciones = res;
        console.log(this.publicaciones);
        
         for(var i = 0; i < this.publicaciones.length; i ++){
     
        // let categoria = this.publicaciones[i].categoria;
        // let duracion = this.publicaciones[i].duracion;
        // let descuento = this.publicaciones[i].descuento;
        // let nombre = this.publicaciones[i].nombre;
        // let precio = this.publicaciones[i].precio;
        // let descripcion = this.publicaciones[i].descripcion;
        // let fot = this.publicaciones[i];
        // let id_servicios = this.publicaciones[i].id_servicios;
        // let id_provedores = this.publicaciones[i].id_provedores;
        // let precio_cliente_prevenir = this.publicaciones[i].precio_cliente_prevenir;
        // let video = this.publicaciones[i].video;
        // let fotos = this.publicaciones[i].foto;
        
        // fot = fot.fotos[0];
        // fot = this.url+fot.ruta;
        // console.log(fot);

        let categoria =this.publicaciones[i].categoria;
            let createdAt=this.publicaciones[i].createdAt;
            let createdupdate = this.publicaciones[i].createdupdate;
            let descripcion = this.publicaciones[i].descripcion;
            let descuento = this.publicaciones[i].descuento;
            let direccion = this.publicaciones[i].direccion;
            let duracion = this.publicaciones[i].duracion;
            let foto = this.publicaciones[i].foto;
            let fotos = this.publicaciones[i].fotos;
            let id_categoria = this.publicaciones[i].id_categoria;
            let id_provedores = this.publicaciones[i].id_provedores;
            let id_servicios = this.publicaciones[i].id_servicios;
            let locked = this.publicaciones[i].locked;
            let max_citas_ves = this.publicaciones[i].max_citas_ves;
            let municipio_id_municipio = this.publicaciones[i].municipio_id_municipio;
            let nombre = this.publicaciones[i].nombre;
            let precio = this.publicaciones[i].precio;
            let precio_cliente_prevenir = this.publicaciones[i].precio_cliente_prevenir;
            let promedio = this.publicaciones[i].promedio;
            let video = this.publicaciones[i].video;
            let medico_id = this.publicaciones[i].medico_id;
            let coment = this.publicaciones[i].coment;
            var estrellasAmarillas = [];
            for(let j = 0; j < promedio;j++){
              let id = "amarilla";
              estrellasAmarillas.push({id:id});
            }

            let resultado = 5 - promedio;
            if(resultado >= 1){
              var estrellasGrises = [];
              for(let h = 0; h < resultado ; h++){
                let id = "gris";
                estrellasGrises.push({id:id});
              }
            }


        this.inf.push({categoria:categoria, createdAt:createdAt, createdupdate:createdupdate, descripcion:descripcion,descuento:descuento,
          direccion:direccion,duracion:duracion,foto:foto, fotos:fotos, id_categoria:id_categoria, id_provedores:id_provedores,id_servicios:id_servicios,
          locked:locked, max_citas_ves:max_citas_ves, municipio_id_municipio:municipio_id_municipio, nombre:nombre, precio:precio,
          precio_cliente_prevenir:precio_cliente_prevenir,promedio:promedio, video:video, estrellasAmarillas:estrellasAmarillas,estrellasGrises:estrellasGrises, coment : coment , medico_id : medico_id });
      }
      // console.log(this.inf);
      }
     
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexión intentalo más tarde");
      // console.log(err);
    });
  }

  updateService(id){
    // console.log(id);

    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando información... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.getInfoEditar(id).subscribe((data)=>{
    // this.loading.dismiss();
    this.load = false;
    console.log(data);
    this.navCtrl.push(PublicarServicioPage,{info: data});
     
  },(err)=>{
    // this.loading.dismiss();
    this.load = false;
    this.presentToast("Error en la conexión, intentalo más tarde.");
  });
    
    
  }

  

 



  viewService(servicio){
    console.log(servicio);

    // let categoria = servicio.categoria;
    // let duracion = servicio.duracion;
    // let descuento = servicio.descuento;
    // let nombre = servicio.nombre;
    // let precio = servicio.precio;
    // let descripcion = servicio.descripcion;
    // let fot = servicio;
    // let id_servicios = servicio.id_servicios;
    // let id_provedores = servicio.id_provedores;
    // let precio_cliente_prevenir = servicio.precio_cliente_prevenir;
    // let video = servicio.video;
    // let fotos = servicio.foto;
    
    // fot = fot.foto[0];
    // fot = this.url+fot.ruta;
    
    // let info =[];
    // info.push({categoria:categoria,descuento:descuento,nombre:nombre,descripcion:descripcion,foto:fot,
    //                 id_servicio:id_servicios,id_provedores:id_provedores, duracion:duracion,precio:precio,
    //                 precio_cliente_prevenir:precio_cliente_prevenir, video:video, fotos:fotos });

    // let a = info;
    // a = a[0];
    this.inf=[];
    this.navCtrl.push(ServicioPage,{servicio:servicio});
    
  
    
  }

  presentConfirm(id) {
    
    let alert = this.alertCtrl.create({
      title: 'Confirmación',
      message: '¿Esta seguro que desea eliminar esta publciación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Eliminar',
          handler: () => { 

            // this.loading = this.loadingCtrl.create({
            //   spinner: 'hide',
            //   content: "Espera un momento<br>estamos procesando tu solicitud... ",
            // });
            // this.loading.present();

              this.load = true;
              this.api.dltService(id).then((data)=>{
              this.res = data;
              // console.log("AQUIIIIIIII")
              // console.log(this.res);
              this.inf = [];
              if(this.res === false){
                this.presentToast("No se puede eliminar el servicio, existen citas agendadas");
              }else{
                this.presentToast("La publicación se ha eliminado exitosamente");
              }
              // this.loading.dismiss();
              this.load = false;
              this.getPublicaciones();
              
            },(err)=>{
              // console.log(err);
              // this.loading.dismiss();
              this.load = false;
              this.presentToast("Error al eliminar intentalo mas tarde");
            });

          
          }
        }
      ]
    });
    alert.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  crearPublicacion(){
    this.load = true;
    this.inf=[];
    this.api.getMedicosProvedor(this.global.id_usuario).subscribe((data)=>{
      this.load = false;
      console.log(data);
      this.infMedicos = data;

      if(this.infMedicos.length <= 0){

        let alert = this.alertCtrl.create({
          title: 'Confirmar',
          message: 'Aún no tienes un medico agregado, ¿Deseas agregar uno?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
              
              }
            },
            {
              text: 'Aceptar',
              handler: () => {
                this.navCtrl.push(MedicosPage);
              }
            }
          ]
        });
        alert.present();
      
      }else{
        this.navCtrl.push(PublicarServicioPage,{medicos:this.infMedicos});
      }

    },(err)=>{
      this.load = false;
      this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión")
    });
    
  }
}
