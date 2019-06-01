import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Loading,
  LoadingController,ToastController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import CryptoJS from 'crypto-js';
import { Global } from '../../app/global';
import { HomePage } from '../home/home';
import { isRightSide } from 'ionic-angular/umd/util/util';

/**
 * Generated class for the AgregarMedicoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-agregar-medico',
  templateUrl: 'agregar-medico.html',
})
export class AgregarMedicoPage {
  private datos : FormGroup;
  loading: Loading;
  read:boolean=false;
  cedula;
  infoMedico;
  form:boolean;
  form2:boolean;
  res;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    private api:ApiProvider,public loadingCtrl: LoadingController,private toastCtrl:ToastController,
    private global: Global) {

    this.datos = this.formBuilder.group({

      buscar:[''],
      nombres:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      apellidos:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      pssw: ['',[Validators.required,]],
      cedula:['',[Validators.required,Validators.pattern('[0-9]*')]],
      tarjetaProfecional:['',[Validators.required,Validators.pattern('[0-9]*')]],
      especialidad:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      // idProvedor

    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AgregarMedicoPage');
  }

  buscarCedula(){

    this.load = true;
    this.cedula = this.datos.value.buscar;

    this.api.getMedico(this.cedula).subscribe((data)=>{
      console.log(data)

      if(data === false){
        this.load = false;
        this.read = true;
        this.form = true;
        this.formularioNuevoMedico();

      }else{
        this.load = false;  
        this.infoMedico = data[0];
        this.read = true;
        this.formularioMedicoExiste();
        this.form2 = true;
      }
     
    },(err)=>{
      this.load = false;
      console.log(err);
    });




   
  }

  borrar(){

    if(this.form === true){
      this.read = false;
      this.form = false;  
      this.datos.reset();
    }

    if(this.form2 === true){
      this.read = false;
      this.form2 = false;
      this.datos.reset();
    }
  }

  agregarMedico(bol){

    

    if(bol === true){

      let info = {cedula : this.infoMedico.medico_id , provedores_id:this.global.id_usuario, existe:bol }
      console.log(info);
      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos verificando tu información... ",
      //   });
      //   this.loading.present();
      this.load = true;

        this.api.postAgregarMedicos(info).then((res)=>{
          // this.loading.dismiss();
          this.load = false;
          console.log(res);
          this.res = res;
          if(res === true){
            
            this.presentToast("Medico agregado con exito.");
            this.navCtrl.pop();
          }
          
          if(res === false){
            this.presentToast("Error al agregar el medico, intentalo más tarde o revisa tu conexion");
            this.navCtrl.setRoot(HomePage);
          }

          if(this.res.existe === true ){
            this.presentToast("No se puede agregar. El medico actualmente ya se encuentra registrado en el servicio.");
          }

          
          
        },(err)=>{
          // this.loading.dismiss();
          this.load = false;
          this.presentToast("Error al agregar el medico, intentalo más tarde o revisa tu conexion");
          this.navCtrl.setRoot(HomePage);
          console.log(err);
        });



    }else{
      // this.loading = this.loadingCtrl.create({
      // spinner: 'hide',
      // content: "Espera un momento<br>estamos verificando tu información... ",
      // });
      // this.loading.present();
      this.load = true;
    
    
    let hashed = CryptoJS.SHA512(this.datos.value.pssw).toString(CryptoJS.enc.Hex);

    let info = {nombre:this.datos.value.nombres , apellidos: this.datos.value.apellidos ,tarj_profecional:this.datos.value.tarjetaProfecional ,
    email:this.datos.value.email, pssw: hashed, pssw2:this.datos.value.pssw, cedula:this.datos.value.cedula, titulo:this.datos.value.especialidad, provedores_id:this.global.id_usuario, existe:bol };

    console.log(info);

    this.api.postAgregarMedicos(info).then((res)=>{
      // this.loading.dismiss();
      this.load = false;
      console.log(res);
      this.res = res;

      if(this.res === true){
        this.presentToast("Medico agregado con exito.");
        this.navCtrl.pop();
      }else if(this.res === false){
        this.presentToast("Error al agregar el medico, intentalo más tarde o revisa tu conexion");
        this.navCtrl.setRoot(HomePage);
      }
        
        // if(this.res.campo = "email"){
        //   this.presentToast("El correo ya se encuentra registrado");
        // } else 
        if(this.res.campo == "profecional"){
          this.presentToast("La tarjeta profecional ya se encuentra registrada");
        }

        if(this.res.campo == "email"){
          this.presentToast("El correo ya se encuentra registrado");
        }
      

     
      
   
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error al agregar el medico, intentalo más tarde o revisa tu conexion");
      this.navCtrl.setRoot(HomePage);
      console.log(err);
    });

    }


   

  }

  formularioNuevoMedico(){

    this.datos = this.formBuilder.group({

      buscar:[this.cedula],
      nombres:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      apellidos:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      pssw: ['',[Validators.required,]],
      cedula:[this.cedula,[Validators.required,Validators.pattern('[0-9]*')]],
      tarjetaProfecional:['',[Validators.required,Validators.pattern('[0-9]*')]],
      especialidad:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      // idProvedor

    });
  }

  formularioMedicoExiste(){

    console.log(this.infoMedico);

    this.datos = this.formBuilder.group({

      buscar:[this.cedula],
      nombres:[this.infoMedico.nombres,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      apellidos:[this.infoMedico.apellidos,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      // email: [this.infoMedico.email, [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      // pssw: [this.infoMedico.pssw,[Validators.required,]],
      cedula:[this.cedula,[Validators.required,Validators.pattern('[0-9]*')]],
      tarjetaProfecional:[this.infoMedico.tarj_profecional,[Validators.required,Validators.pattern('[0-9]*')]],
      especialidad:[this.infoMedico.titulo,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      // idProvedor

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
