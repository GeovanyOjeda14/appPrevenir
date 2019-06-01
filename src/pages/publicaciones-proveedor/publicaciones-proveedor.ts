import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,ModalController,IonicApp,Loading,
  LoadingController } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {Global} from '../../app/global';
import {ServicioPage} from '../servicio/servicio';
import * as moment from 'moment';
import {CalificacionPage} from '../calificacion/calificacion';
import {ModalCitaUserPage} from '../modal-cita-user/modal-cita-user';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import {ContactenosPage} from '../contactenos/contactenos';
/**
 * Generated class for the PublicacionesProveedorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-publicaciones-proveedor',
  templateUrl: 'publicaciones-proveedor.html',
})
export class PublicacionesProveedorPage {
public proveedor;
public publicaciones;
public url;
public inf =[];
historial:boolean;
info_historial;
public infoH = [];
rol;
loading: Loading;
mascota;
mostrarHistorial:boolean=false;
avatar;
nombreUser;
correoUser;
asunt;
private datos : FormGroup;
load;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api:ApiProvider,
              private global:Global,private toastCtrl:ToastController, private modalCtrl: ModalController,
              private app : IonicApp,private photoViewer: PhotoViewer,private formBuilder: FormBuilder,public loadingCtrl: LoadingController) {

        this.rol = this.navParams.get('rol');
        //  console.log(this.rol);
         if(!this.rol){
          this.historial = false
          this.proveedor = this.navParams.get('provedor');

          this.datos = this.formBuilder.group({                 
            descripcion: ['',[Validators.required,Validators.minLength(15)]],    
          });

          this.avatar = this.global.apiUrl+this.proveedor.avatar;
          this.getProveedor();

          this.nombreUser = this.global.nombre;
          this.correoUser = this.global.infoPerfil;
          this.correoUser = this.correoUser.correo;

         }else{
           
          this.historial = true;
         
         }

        
    
  }
  goToService(servicio){
    this.navCtrl.push(ServicioPage,{servicio:servicio})
  }

  goToMasPublicaciones(){
    this.navCtrl.push(ContactenosPage, {id:this.proveedor.id_provedor})
  }

  mensaje(){
  
    this.correoUser;
    // this.correoProv;
    let mensaje = this.datos.value.descripcion + ". Correo enviado por :  " + this.correoUser;
  
    if(!this.asunt){
      this.presentToast("Debes elegir un asunto antes de enviar el mensaje");
    }
    else{
      let correo = {remitente: this.nombreUser, destino:this.proveedor.correo , texto:mensaje , asunto:this.asunt };
      console.log(correo);
      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos enviando tu mensaje... ",
      // });
      // this.loading.present();
  
      // this.api.enviarMensaje(correo).then((data)=>{
      //   // console.log(data);
      //   if(data === true){
      //     this.datos.reset();
      //     this.loading.dismiss();
      //     this.presentToast("Su mensaje ha sido enviado con exito");
      //   }else{
      //     this.loading.dismiss();
      //     this.presentToast("El mensaje no ha sido enviado, intentalo mas tarde");
      //   }
        
      // },(err)=>{
      //   this.loading.dismiss();
      //   this.presentToast("Error al enviar el mensaje, intentalo mas tarde");
      // });
    }
  
  
  }

  verImg(foto){
    this.photoViewer.show(foto, '', {share: false});
  }

  ionViewWillEnter() {
    
    if(this.historial){
      this.infoH = [];
      switch(this.rol){
           
        case(this.rol = "user"): 
        this.obtenerHistorial();
        break;

        case(this.rol = "beneficiario"):  
        this.obtenerHistorialBeneficiario();
        break;

        case(this.rol = "mascota"):
        this.obtenerHistorialMascota();
        break;
      }
     }

    }

  ionViewDidLoad() {
  
  }

  ionViewWillLeave(){
    
  }

  asunto(ev){
    this.asunt = ev;
  }

  obtenerHistorialMascota(){
    this.load = true;
    this.api.getHistorialmascotas(this.global.id_usuario).subscribe((data)=>{
      // console.log(data);
      this.info_historial = data;
      this.mascota = true;
      this.infoHistorial();
      this.load = false;
    },(err)=>{
      this.load = false;
      this.presentToast("Error en la conexion, intentalo mas tarde o revisa tu conexion");
    });
  }

  obtenerHistorialBeneficiario(){
    this.load = true;
    this.api.getHistorialBeneficiarios(this.global.id_usuario).subscribe((data)=>{
      // console.log(data);
      this.info_historial = data;
      this.infoHistorial();
      this.load = false;
    },(err)=>{
      this.load = false;
      this.presentToast("Error en la conexion, intentalo mas tarde o revisa tu conexion");
    });
  }

  obtenerHistorial(){
    
    this.load = true;
    this.api.getHistorialUser(this.global.id_usuario).subscribe((data)=>{
      // console.log(data);
      this.info_historial = data;
      this.infoHistorial();

        },(err)=>{
          this.load = false;
            this.presentToast("Error en la conexion, intentalo mas tarde o revisa tu conexion");
        });
  }

    ionViewCanLeave(){
    
      let activeModal=this.app._modalPortal.getActive();
      
         if(activeModal){
          activeModal.dismiss();
          
      }
     }

  infoHistorial(){
    this.load = false;
    if(this.info_historial.length <= 0){
      this.mostrarHistorial = true;
    }
    else{
      // console.log(this.info_historial);
      for(let i = 0; i < this.info_historial.length; i++){
        
        let nombres = this.info_historial[i].nombres;
        let start = this.info_historial[i].start;
        start = moment(start).format('DD-M-YYYY');
        let nombre = this.info_historial[i].servicio;
        let id_servicio = this.info_historial[i].servicios_idservicios;
        let calificada = this.info_historial[i].calificada;
        let id_historial = this.info_historial[i].id_historial;
        let direccion = this.info_historial[i].direccion;

        this.infoH.push({nombres:nombres, start: start, nombre:nombre, id_servicio:id_servicio,
          calificada:calificada, id_historial : id_historial, direccion:direccion});
      }

      // console.log(this.infoH);

    }
  }

  calificar(h){

    this.navCtrl.push(CalificacionPage,{info:h, mascota:this.mascota});
  }

  getProveedor(){

    this.load = true;
    let id = this.proveedor.id_provedor;
    this.api.getPublicacionesProveedor(id).subscribe((res)=>{
      this.publicaciones = res;
      this.load = false;
      this.info();
      // console.log(this.publicaciones);
    },(err)=>{
      this.load = false;
      this.presentToast("Error en la conexion.");
      // console.log(err);
    });
  }

  ver(info){
    // console.log(info);
   
    let modal = this.modalCtrl.create(ModalCitaUserPage,{info:info,calificacion:true});
    modal.present();

    modal.onDidDismiss((data)=>{
       
        
    });

  }



  info(){

    // console.log(this.publicaciones);
    for(var i = 0; i < this.publicaciones.length; i ++){
     
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
              precio_cliente_prevenir:precio_cliente_prevenir,promedio:promedio, video:video, estrellasAmarillas:estrellasAmarillas,estrellasGrises:estrellasGrises, coment : coment });


          }
    // console.log(this.inf);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }



}
