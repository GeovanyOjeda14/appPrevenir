import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Loading,
  LoadingController } from 'ionic-angular';
import { SacarCitaPage } from '../sacar-cita/sacar-cita';
import { PublicacionesProveedorPage } from '../publicaciones-proveedor/publicaciones-proveedor';
import {ApiProvider} from '../../providers/api/api';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import {Global} from '../../app/global';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { normalizeURL } from 'ionic-angular';
import { MedicosPage } from '../medicos/medicos';



// @Pipe({
//   name: 'youtube',
// })
// export class YoutubePipe implements PipeTransform {
//   /**
//    * Takes a value and makes it lowercase.
//    */

//    constructor(private dom:DomSanitizer){

//    }
//   transform(value) {
//    return this.dom.bypassSecurityTrustResourceUrl(value);
//   }
// }

/**
 * Generated class for the ServicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
})
export class ServicioPage {
 
 public video;
 servicio : any;
 public id_prov;
 public prov;
//  public pv;
 public categoria;
 public nombre;
 public nit;
 public descripcion;
 public logo;
 public id;
 private datos : FormGroup;
 public usr;
 service;
 fotos = [];
 nombreUser;
 correoUser;
 correoProv;
 asunt;
 loading: Loading;
 mascota;
 id_categoria;
 estrellasAmarillas=[];
 estrellasGrises=[];
 cita;
 comentario=[];
 masPublicaciones:boolean=false;
 infoMedico;
 nombresMedico;
 esAdmin:boolean;
 load;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private api:ApiProvider,private formBuilder: FormBuilder,private global : Global,
    private toastCtrl:ToastController,public loadingCtrl: LoadingController) {
      // this.user();
      this.servicio = navParams.get('servicio');
      this.mascota = this.navParams.get('mascota');
      this.cita = this.navParams.get('cita');
      this.masPublicaciones = this.navParams.get('masPublicaciones');
      
      if(this.global.admin === true && this.global.medico === false){
        this.esAdmin = false;
      }else if (this.global.admin === false && this.global.medico === true){
        this.esAdmin = false;
      }else if (this.global.admin === false && this.global.medico === false){
        this.esAdmin = true;
      }

      console.log(this.servicio);


      if(this.cita){
        this.servicio = this.servicio[0];
        // console.log(this.servicio);
      }

      
      this.getProveedor();
      this.getFotos();
      this.getMedico();

    this.datos = this.formBuilder.group({                 
      descripcion: ['',[Validators.required,Validators.minLength(15)]],    
    });
    if(!this.servicio.video){
      this.video = "https://www.youtube.com/embed/4Z4TxFh1tO8";
    }
    else{
      this.video= "https://www.youtube.com/embed/"+this.servicio.video;
    }
   
    
  }

  medicoPerfil(){
    // console.log("medico perfil" , this.servicio.medico_id);
    this.navCtrl.push(MedicosPage,{medico:this.infoMedico});
  }

  getMedico(){

    this.api.getInfoMedico(this.servicio.medico_id).subscribe((data)=>{
      
      this.infoMedico = data[0];
      console.log(this.infoMedico);
      this.nombresMedico = this.infoMedico.nombres + " " + this.infoMedico.apellidos;
    },(err)=>{

    });
  }

 
  getFotos(){
    
      let fotos = this.servicio.fotos;
      // console.log("AQUIIIIIIIIIIIIIII");
      // console.log(fotos.length);
      for(var i = 0; i< fotos.length; i++)
      {
        let foto = fotos[i].ruta;
        foto = this.global.apiUrl+foto;
        this.fotos.push({foto:foto});
      }
      // console.log(this.fotos)
  }

  goToMasPerfil(){
    this.navCtrl.pop();
  }

  user(){
      this.load = true;
      this.api.getUser(this.global.id_usuario).subscribe((data)=>{
        this.usr = data;
        this.load = false;
        // console.log(this.usr);
      },
      (err)=>{
        this.load = false;
        // console.log(err);
      });
  }

  ionViewDidLoad() {
    // this.api.getServicio(this.servicio.id_servicio).subscribe((data)=>{
    //   this.service = data;
    //   this.service = this.service[0];
    // },(err)=>{

    // });
    this.nombreUser = this.global.nombre;
    this.correoUser = this.global.infoPerfil;
    this.correoUser = this.correoUser.correo;
    // this.calificacion();
    this.comentarios();

  }

  comentarios(){
    // console.log(this.servicio.coment);
    for(let i = 0; i < this.servicio.coment.length; i++){
      
      let fecha = this.servicio.coment[i].CreatedAt;

      fecha = moment(fecha).format('DD/M/YYYY');
      let nombre = this.servicio.coment[i].nombre;
      let comentario_med = this.servicio.coment[i].comentario_med;
      let coment = this.servicio.coment[i].comentario;
      let calificacion = this.servicio.coment[i].calificacion;
      let avatar = this.servicio.coment[i].avatar;
      var estrellasAmarillasComent = [];


      for(let j = 0; j < calificacion;j++){
        let id = "amarilla";
        estrellasAmarillasComent.push({id:id});
      }

      // let resultado = 5 - calificacion;
      // if(resultado >= 1){
      //   var estrellasGrisesComent = [];
      //   for(let h = 0; h < resultado ; h++){
      //     let id = "gris";
      //     estrellasGrisesComent.push({id:id});
      //   }
      // }

      this.comentario.push({comentario_med:comentario_med, avatar:avatar, fecha:fecha, nombre:nombre, coment:coment , estrellasAmarillas:estrellasAmarillasComent });
    }

    console.log(this.comentario);
  }

  getProveedor(){
    this.load = true;
    this.api.getProovedor(this.servicio.id_provedores).subscribe((data)=>{
      this.prov=data;
      // console.log(this.prov);
      
      this.nombre = this.prov.nombre;
      this.nit = this.prov.nit;
      this.descripcion = this.prov.descripcion;
      this.logo = this.global.apiUrl +this.prov.avatar;
      this.id = this.prov.id_provedor;
      this.correoProv = this.prov.correo;

      // console.log(this.descripcion);
      this.load = false;
    },(error)=>{
      this.load = false;
      // console.log(error);
    });
  }


sacarCita(idProduct,id_categoria)
{
  console.log(idProduct,'  -  ',id_categoria);
  this.navCtrl.push(SacarCitaPage,{id_servicio:idProduct,mascota:this.mascota,id_categoria:id_categoria});

}

goToMaspublicaciones(){
  // console.log(this.id);
  this.navCtrl.push(PublicacionesProveedorPage,{provedor:this.prov});
}

asunto(ev){
  this.asunt = ev;
}


mensaje(){
  
  this.correoUser;
  this.correoProv;
  let mensaje = this.datos.value.descripcion + ". Correo enviado por :  " + this.correoUser;

  if(!this.asunt){
    this.presentToast("Debes elegir un asunto antes de enviar el mensaje");
  }
  else{
    let correo = {remitente: this.nombreUser, destino:this.correoProv , texto:mensaje , asunto:this.asunt };
    // console.log(correo);
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos enviando tu mensaje... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.enviarMensaje(correo).then((data)=>{
      // console.log(data);
      if(data === true){
        this.datos.reset();
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Su mensaje ha sido enviado con exito");
      }else{
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("El mensaje no ha sido enviado, intentalo mas tarde");
      }
      
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error al enviar el mensaje, intentalo mas tarde");
    });
  }


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
