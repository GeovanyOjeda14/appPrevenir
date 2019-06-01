import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController,ModalController,
IonicApp,Loading,
LoadingController } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {Global} from '../../app/global';
import * as moment from 'moment';
import {CitasProvedorPage} from '../citas-provedor/citas-provedor';
import {ModalCitaUserPage} from '../modal-cita-user/modal-cita-user';
import {PublicacionesProveedorPage} from '../publicaciones-proveedor/publicaciones-proveedor';
import { TerminosPage } from '../terminos/terminos';

/**
 * Generated class for the CitasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-citas',
  templateUrl: 'citas.html',
})
export class CitasPage {
  usuario_id;
  citas;
  inf = [];
  infBeneficiarios = [];
  mascotas;
  infMascotas=[];
  servicio = [];
  servicios;
  url;
  foto;
  res;
  mostrar:boolean=false;
  mostrarBene:boolean=false;
  loading: Loading;
  mymodel;
  beneficiarios;
  mostrarMascota:boolean=false;ç
  infMedico;
  load;
 

  constructor(public navCtrl: NavController, public navParams: NavParams, private api : ApiProvider,
    private global:Global, private toastCtrl:ToastController,private alertCtrl: AlertController,private modalCtrl: ModalController,
    public app : IonicApp, public loadingCtrl: LoadingController) {
    this.usuario_id = this.global.id_usuario;
    this.usuario_id = parseInt(this.usuario_id);
    this.url = this.global.apiUrl;
   
    if(this.global.admin === true && this.global.medico === false){
         this.getServicios();        
    }else if (this.global.admin === false && this.global.medico === false){
         console.log("es Usuario");
         this.getCitas();
         this.mymodel = "segment1";
      // this.obtenerHistorial();
    } else if(this.global.admin === false && this.global.medico === true) {
         console.log("es Medico");
         this.getProvedores();
    }
    
  }

  goToHistorial(rol){
    // console.log(rol);
    this.navCtrl.push(PublicacionesProveedorPage,{rol:rol});
  }

  ionViewDidLoad() {
    
  }

  ionViewCanLeave(){
    
    let activeModal=this.app._modalPortal.getActive();
    
       if(activeModal){
        activeModal.dismiss();
        
    }
   }
 
   getProvedores(){
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos procesando la solicitud... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.getProvedoresMedico(this.global.id_usuario).subscribe((data)=>{
      console.log(data);
      this.infMedico=data;
      // this.loading.dismiss();
      this.load = false;
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      console.log(err);
    });

   }

   toggleSection(i) {
    this.infMedico[i].open = !this.infMedico[i].open;
  }

  // toggleSection2(i) {
  //   this.tarde[i].open = !this.tarde[i].open;
  // }
 
  toggleItem(i, j) {
    // this.maniana[i].children[j].open = !this.maniana[i].children[j].open;
  }

  getServicios(){
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos procesando la solicitud... ",
    // });
    // this.loading.present();
    this.load = true;

    let id = parseInt(this.global.id_usuario);
    this.api.getPublicacionesProveedor(id).subscribe((data)=>{
      

      let a = data[0].servicios;
      // console.log(a);
      if(a === false){
        // this.loading.dismiss();
        this.load = false;
        this.mostrar = true;
      }else{
        // this.loading.dismiss();
        this.load = false;
        this.mostrar = false;
        this.servicios = data;
        
        this.getFoto();
        
      }
      


    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      // console.log(err);
      this.presentToast("Error en la conexión, intentalo más tarde");
    });
  }

  verCita(info){
    let nombre = info.nombre;
    let id_servicios = info.id_servicios;
    let id_categoria = info.categoria_idcategoria;

    this.navCtrl.push(CitasProvedorPage,{nombre:nombre, id_servicios : id_servicios , id_categoria : id_categoria , medico : true});
  }

  verCitas(id,nombre,id_categoria){
    //  console.log(id_categoria);
      this.navCtrl.push(CitasProvedorPage,{id_servicios:id, nombre:nombre , id_categoria : id_categoria});
    }


  getCitas(){
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos procesando la solicitud... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.getCitasUsuario(this.usuario_id).subscribe((data)=>{
      this.citas = data;
      // console.log(this.citas);
      // this.loading.dismiss();
      this.load = false;
      this.getBeneficiarios();
      this.getMascotas();
      this.info();

    },(err)=>{
      // console.log(err);
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexión, intentalo más tarde");
    });
  }

  getBeneficiarios(){
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos procesando la solicitud... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.getCitasBeneficiarios(this.global.id_usuario).subscribe((data)=>{
      this.beneficiarios = data;
      // console.log(this.beneficiarios);

      if(this.beneficiarios.length == 0){
        this.mostrarBene = true;
        // this.loading.dismiss();
        this.load = false;
      }else{

        console.log(this.beneficiarios);
        for(let i = 0 ; i < this.beneficiarios.length ; i++){

          let fecha = this.beneficiarios[i].start;
          let hora = moment(fecha).format('hh:mm a');
          fecha = moment(fecha).format('DD-M-YYYY');
          let nombres = this.beneficiarios[i].nombreU;
          let nombre = this.beneficiarios[i].nombre;
          let id_servicio = this.beneficiarios[i].servicios_idservicios;
          let nombreU = this.beneficiarios[i].nombreU;
          let id_eventos = this.beneficiarios[i].id_eventos;
          let usuarios_id = this.beneficiarios[i].usuarios_id;
          let direccion = this.beneficiarios[i].direccion;
  
          this.infBeneficiarios.push({ nombre : nombre , fecha : fecha , hora : hora ,
          id_servicio: id_servicio , nombreU : nombreU , id_eventos : id_eventos , usuarios_id : usuarios_id , direccion:direccion});
        }

        // this.loading.dismiss();
        this.load = false;
      }
      
    },(err)=>{
      this.presentToast("Error en la conexión, intentalo más tarde");
      // this.loading.dismiss();
      this.load = false;
    });

  }

  getMascotas(){

  //   this.loading = this.loadingCtrl.create({
  //     spinner: 'hide',
  //     content: "Espera un momento<br>estamos procesando la solicitud... ",
  //   });
  //   this.loading.present();
  this.load = true;
    
    this.api.getCitasMascota(this.global.id_usuario).subscribe((data)=>{
      // this.loading.dismiss();
      this.load = false;
      //   this.mostrarMascota = true;
      
      this.mascotas = data;
      

      // let length = ;
      // console.log(length);

      if(this.mascotas.length <= 0){
        this.mostrarMascota = true;
      }else{

        for(let i = 0; i < this.mascotas.length; i++){

          let fecha = this.mascotas[i].start;
          let hora = moment(fecha).format('hh:mm a');
          fecha = moment(fecha).format('DD-M-YYYY');
          let nombre = this.mascotas[i].nombre;
          let nombreU = this.mascotas[i].nombreU;
          let id_eventos = this.mascotas[i].id_eventos;
          let id_servicio = this.mascotas[i].id_servicios;
          let direccion = this.mascotas[i].direccion;

          this.infMascotas.push({fecha : fecha , hora : hora , nombre : nombre,
          id_eventos: id_eventos ,id_servicio : id_servicio, direccion:direccion, nombreU:nombreU});
        }

        // console.log(this.infMascotas);
      }
      
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexión, intentalo más tarde");
    });

  }

  getFoto(){
    // console.log(this.servicios);

    for(var i = 0 ; i < this.servicios.length; i++)
    {
      let categoria = this.servicios[i].id_categoria;
      let foto = this.servicios[i].foto;
      let f = this.servicios[i];
      let nombre = this.servicios[i].nombre;
      let id = this.servicios[i].id_servicios;
      let descripcion = this.servicios[i].descripcion;
      // let id_categoria = this.servicio[i].id_categoria;
      // f = f.foto[0];
      // f = this.url+f.ruta;
      // this.foto = f;
      // this.servicio.push({id_servicios:id, nombre:nombre, foto:f, descripcion:descripcion});
      this.servicio.push({id_servicios:id, nombre:nombre,  descripcion:descripcion, categoria:categoria });
    }
    // console.log(this.servicio);
  }
  
  info(){
   
    if(this.citas.length == 0)
    {
      // console.log("AQUI");
      this.mostrar = true;
    }else{

      // console.log(this.citas);
      for(var i = 0; i < this.citas.length; i ++){
      
        let p = this.citas[i];
        p = moment(p.start).format('DD-M-YYYY hh:mm a');
        p = p.split(' ');
        let p1 = p[0];
        let p2 = p[1];
        p2 = p2 +" "+ p[2];
        let id_servicio = this.citas[i].servicios_idservicios;
        let nombre = this.citas[i].nombre;
        let id_eventos = this.citas[i].id_eventos;
        let direccion = this.citas[i].direccion;

        this.inf.push({fecha:p1, hora: p2, id_servicio:id_servicio,nombre:nombre,id_eventos:id_eventos,direccion:direccion});
  
      }
    }
    
     
    // console.log(this.inf);
    }

    eliminar(id,mascota){

      
      if(mascota === true){

        let alert = this.alertCtrl.create({
          title: 'Confirmación',
          message: '¿ Estas seguro que deseas eliminar esta cita?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
               
              }
            },
            {
              text: 'Confirmar',
              handler: () => {
                // this.loading = this.loadingCtrl.create({
                //   spinner: 'hide',
                //   content: "Espera un momento<br>estamos procesando la solicitud... ",
                // });
                // this.loading.present();
                this.load = true;
  
                
                this.api.dltCita(id,mascota).then((data)=>{
                  this.res = data;
          
                  if(this.res.borrado === true){
                    this.presentToast("Su cita fue eliminada con exito");
                    // this.loading.dismiss();
                    this.load = false;
                    this.navCtrl.pop();
  
                    
                  }else{
                    // this.loading.dismiss();
                    this.load = false;
                    this.presentToast("No puedes eliminar una cita 24 horas antes");
                  }
          
                },
                (err)=>{
                  // this.loading.dismiss();
                  this.load = false;
                  this.presentToast("Error en la conexión, intentalo más tarde");
                                  // console.log(err)
                });
  
              }
            }
          ]
        });
        alert.present();


      }else{

        let alert = this.alertCtrl.create({
          title: 'Confirmación',
          message: '¿ Estas seguro que deseas eliminar esta cita?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
               
              }
            },
            {
              text: 'Confirmar',
              handler: () => {
                // this.loading = this.loadingCtrl.create({
                //   spinner: 'hide',
                //   content: "Espera un momento<br>estamos procesando la solicitud... ",
                // });
                // this.loading.present();
                this.load = true;
  
                
                this.api.dltCita(id,false).then((data)=>{
                  this.res = data;
          
                  if(this.res.borrado === true){
                    this.presentToast("Su cita fue eliminada con exito");
                    // this.loading.dismiss();
                    this.load = false;
                    this.navCtrl.pop();
  
                    
                  }else{
                    // this.loading.dismiss();
                    this.load = false;
                    this.presentToast("No puedes eliminar una cita 24 horas antes");
                  }
          
                },
                (err)=>{
                  // this.loading.dismiss();
                  this.load = false;
                  this.presentToast("Error en la conexión, intentalo más tarde");
                                  // console.log(err)
                });
  
              }
            }
          ]
        });
        alert.present();
      }
    }


    ver(info){
      // console.log(info);

    
      let modal = this.modalCtrl.create(ModalCitaUserPage,{info:info});
        modal.present();

        modal.onDidDismiss((data)=>{
          // console.log(data);
        });
   
    }

    
    verComentarios(info){
      this.navCtrl.push(TerminosPage,{info:info});
    }

    presentToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000
      });
      toast.present();
    }
  
}
