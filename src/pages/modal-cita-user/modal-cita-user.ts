import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,Loading,
  LoadingController,ToastController } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {Global} from '../../app/global';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import {ServicioPage} from '../servicio/servicio';

/**
 * Generated class for the ModalCitaUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-cita-user',
  templateUrl: 'modal-cita-user.html',
})
export class ModalCitaUserPage {
info;
infoServicio;
infoProvedor;
avatar;
nombreProvedor;
telefonoProvedor;
// direccionProvedor;
correoProvedor;
loading: Loading;
calificacion;
load;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
    private api:ApiProvider, private global : Global, public loadingCtrl: LoadingController,private toastCtrl:ToastController,
    private photoViewer: PhotoViewer) {

    this.info = this.navParams.get('info');
    this.calificacion = this.navParams.get('calificacion');
    // console.log(this.info);

    // if(!this.calificacion){
    //      this.getServicio();
    //   }
    //   else{
        
    //   }
    // console.log(this.info);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalCitaUserPage');
    this.getServicio();
    
  }

  verServicio(){
    // console.log(this.infoServicio);

            let categoria =this.infoServicio.categoria;
            let createdAt=this.infoServicio.createdAt;
            let createdupdate = this.infoServicio.createdupdate;
            let descripcion = this.infoServicio.descripcion;
            let descuento = this.infoServicio.descuento;
            let direccion = this.infoServicio.direccion;
            let duracion = this.infoServicio.duracion;
            let foto = this.infoServicio.foto;
            let fotos = this.infoServicio.fotos;
            let id_categoria = this.infoServicio.id_categoria;
            let id_provedores = this.infoServicio.id_provedores;
            let id_servicios = this.infoServicio.id_servicios;
            let locked = this.infoServicio.locked;
            let max_citas_ves = this.infoServicio.max_citas_ves;
            let municipio_id_municipio = this.infoServicio.municipio_id_municipio;
            let nombre = this.infoServicio.nombre;
            let precio = this.infoServicio.precio;
            let precio_cliente_prevenir = this.infoServicio.precio_cliente_prevenir;
            let promedio = this.infoServicio.promedio;
            let video = this.infoServicio.video;
            let coment = this.infoServicio.coment;
    
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

    let servicio=[];

      servicio.push({categoria:categoria, createdAt:createdAt, createdupdate:createdupdate, descripcion:descripcion,descuento:descuento,
      direccion:direccion,duracion:duracion,foto:foto, fotos:fotos, id_categoria:id_categoria, id_provedores:id_provedores,id_servicios:id_servicios,
      locked:locked, max_citas_ves:max_citas_ves, municipio_id_municipio:municipio_id_municipio, nombre:nombre, precio:precio,
      precio_cliente_prevenir:precio_cliente_prevenir,promedio:promedio, video:video, estrellasAmarillas:estrellasAmarillas,estrellasGrises:estrellasGrises, coment:coment });

      // console.log(servicio[0]);
      
      this.navCtrl.push(ServicioPage,{servicio:servicio , cita : true , mascota : true});

  }

  verImg(foto){
    this.photoViewer.show(foto, '', {share: false});
  }

  getServicio()
  {
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando la información... ",
    // });
    // this.loading.present();
    this.load = true;
    // console.log(this.info.id_servicio);
    this.api.getServicio(this.info.id_servicio).subscribe((data)=>{
      this.infoServicio = data;
      // console.log(data);
      this.infoServicio = this.infoServicio[0];
      let provedor = this.infoServicio.id_provedores;
      // this.loading.dismiss();
      this.load = false;
      // console.log(provedor);
      this.getProvedor(provedor);
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexion, intentalo más tarde");
      // console.log(err);
    });

    
  }

  getProvedor(id){
    // console.log("AQUII");
    // console.log(id);
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando la información... ",
    // });
    // this.loading.present();
    this.load = true;
    
    this.api.getProovedor(id).subscribe((data)=>{
      this.infoProvedor = data;
      // console.log(this.infoProvedor);
  
      this.avatar = this.global.apiUrl+this.infoProvedor.avatar;
      this.nombreProvedor = this.infoProvedor.nombre;
      this.telefonoProvedor = this.infoProvedor.telefono;
      // this.direccionProvedor = this.infoProvedor.direccion;
      this.correoProvedor = this.infoProvedor.correo;
      // this.loading.dismiss();
      this.load = false;

    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexion, intentalo más tarde");
      // console.log(err);
    });
  }

  close(){
    this.viewCtrl.dismiss();
  }
  save(){
    this.viewCtrl.dismiss();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

}
