import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,Loading,
  LoadingController, IonicApp, ToastController } from 'ionic-angular';
import {AgregarBeneficiarioPage} from '../agregar-beneficiario/agregar-beneficiario';
import {ApiProvider} from '../../providers/api/api';
import {Global} from '../../app/global';
import * as moment from 'moment';
import {ModalBeneficiarioPage} from '../modal-beneficiario/modal-beneficiario';
/**
 * Generated class for the BeneficiariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-beneficiarios',
  templateUrl: 'beneficiarios.html',
})
export class BeneficiariosPage {
  beneficiarios;
  info = [];
  disabled:boolean=false;
  disabledMascota:boolean=false;
  loading: Loading;
  mymodel;
  mostrar:boolean=false;
  mostrarPeluditos:boolean=false;
  mascotas;
  infoMascotas= [];
  load;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private api:ApiProvider,
    private global:Global,private modalCtrl: ModalController ,  public loadingCtrl: LoadingController,
    public app : IonicApp, private toastCtrl:ToastController ) {

      this.mymodel = "segment1";
      
      
  }

  ionViewDidLoad() {
    
  }

  goToAgregar(){
    this.navCtrl.push(AgregarBeneficiarioPage);
  } 

  ionViewDidEnter(){

    this.info=[];
    this.infoMascotas=[];
    this.obtenerBeneficiarios();
    this.obtenerMascotas();
  }

  ionViewCanLeave(){
    
    let activeModal=this.app._modalPortal.getActive();
    
       if(activeModal){
        activeModal.dismiss();
        
    }
   }

   obtenerMascotas(){
     
     this.api.getMascotasUser(this.global.id_usuario).subscribe((data)=>{
      this.mascotas = data;
      // console.log(this.mascotas);

      if(this.mascotas.length == 0){
        this.mostrarPeluditos = true;
      }else{
        for(let i = 0; i < this.mascotas.length ; i ++){
      
          let fecha = this.mascotas[i].fecha_nacimineto;
          fecha = moment(fecha).format('DD-M-YYYY');
          let avatar = this.mascotas[i].avatar;
          let color = this.mascotas[i].color;
          let dueno = this.mascotas[i].dueño;
          let especie = this.mascotas[i].especie;
          let esterilizado = this.mascotas[i].esterilizado;
          let id_mascotas = this.mascotas[i].id_mascotas;
          let nombre = this.mascotas[i].nombre;
          let raza = this.mascotas[i].raza;
          let sexo = this.mascotas[i].sexo;
          let telefono = this.mascotas[i].telefono;
        
          this.infoMascotas.push({fecha:fecha , avatar:avatar, color:color, dueno:dueno , especie:especie, 
          esterilizado:esterilizado, id_mascotas:id_mascotas, nombres:nombre, raza:raza, sexo:sexo, telefono:telefono});
          
        }
         
        if(this.infoMascotas.length >= 8){
    
          this.disabledMascota = true;
        }
        // console.log(this.infoMascotas);
      }
      

     },(err)=>{
      this.presentToast("Error en la conexion, intentalo mas tarde");
     });
   }

  obtenerBeneficiarios(){
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando beneficiarios... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.getBeneficiarios(this.global.id_usuario).subscribe((data)=>{
      this.beneficiarios = data;
      // this.loading.dismiss();
      this.load = false;
      if(this.beneficiarios.length == 0){
        this.mostrar = true;
      }else{
        for(let i = 0; i < this.beneficiarios.length; i++){
   
          let nombres = this.beneficiarios[i].nombre + " " + this.beneficiarios[i].apellidos;
          let nombre = this.beneficiarios[i].nombre;
          let apellidos = this.beneficiarios[i].apellidos;
          let identificacion = this.beneficiarios[i].cedula;
          let fecha = this.beneficiarios[i].fecha_nacimiento;
          fecha = moment(fecha).format('DD-M-YYYY');
          let telefono = this.beneficiarios[i].telefono;
          let avatar = this.beneficiarios[i].avatar;
          let correo = this.beneficiarios[i].correo;
          let direccion = this.beneficiarios[i].direccion;
          let id_pais = this.beneficiarios[i].id_pais;
          let id = this.beneficiarios[i].id;
          let parentesco = this.beneficiarios[i].parentesco;
          let watshapp = this.beneficiarios[i].telefonowatshapp;
          let id_usuarioTitular = this.beneficiarios[i].usuariosBf_id;
          
    
          this.info.push({nombres : nombres , identificacion : identificacion , fecha : fecha , telefono : telefono,
          avatar : avatar , correo : correo , direccion : direccion , pais : id_pais , id_beneficiario : id ,
          parentesco : parentesco , watshapp : watshapp , id_usuarioTitular : id_usuarioTitular , nombre:nombre , apellidos : apellidos});
        }
    
        // console.log(this.info);
        if(this.info.length >= 8){
          this.disabled = true;
        }
      }

      
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexión, intentalo más tarde");
      
    });
  }

  // infoPeludito(){
  // }

  // fecha(){
  // }

  ver(info,bol){
    // console.log(info);

    
    let modal = this.modalCtrl.create(ModalBeneficiarioPage,{info:info , mascota:bol});
      modal.present();

      modal.onDidDismiss((data)=>{
        // console.log(data);
      });
 
  }

  goToAgregarMascota(){
    this.navCtrl.push(AgregarBeneficiarioPage, {mascota:true});
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
