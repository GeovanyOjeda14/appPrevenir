import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Loading,
  LoadingController,ToastController } from 'ionic-angular';
import {FormularioRegistroPage} from '../formulario-registro/formulario-registro';
import {FormularioRegistroAdminPage} from '../formulario-registro-admin/formulario-registro-admin';
import {WelcomePage} from '../welcome/welcome';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import {ApiProvider} from '../../providers/api/api';
import { HomePage } from '../home/home';
import CryptoJS from 'crypto-js';

/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  esAdmin:boolean;
  registro:boolean;
  loading: Loading;
  private datos : FormGroup;
  cambioContrasena:boolean=false;
  load;
  


  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, private api:ApiProvider,private toastCtrl:ToastController) {

    this.registro = this.navParams.get('registro');

    if(this.registro === false){
      
      this.datos = this.formBuilder.group({
        email: ['', [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        pssw: ['',[Validators.required,]],
        pssw2 : ['',[Validators.required,]],
        salt: ['',[Validators.required,]]
        // Validators.minLength(8)
      });
    }
    
  } 

  email(){

    if(!this.datos.value.email){
      this.presentToast("Por favor escribe tu correo.");
    }else{
      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos verificando el correo... ",
      // });
      // this.loading.present();
      this.load = true;  
  
      this.api.getConfirmacionCorreo(this.datos.value.email).subscribe((data)=>{
        console.log(data);
        // this.loading.dismiss();
        this.load = false;
        if(data === true){
          
          this.cambioContrasena = true;
          this.formularioContrasena();
        }else{
        
          this.presentToast("Por favor ingresa un correo valido.");
        }

      },(err)=>{
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión");
      });   
    } 
  }

  formularioContrasena(){
    this.datos = this.formBuilder.group({

      pssw: ['',[Validators.required,Validators.minLength(8)]],
      pssw2 : ['',[Validators.required,Validators.minLength(8)]],
      salt: ['',[Validators.required,]]
      // Validators.minLength(8)
    });
  }

  contrasena(){
    console.log(this.datos.value.salt,this.datos.value.pssw, this.datos.value.pssw2)

    let pssw = this.datos.value.pssw;
    let pss2 = this.datos.value.pssw2;


    if( pssw === pss2){

      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br> estamos verificando la información... ",
      // });
      // this.loading.present(); 
      this.load = true; 

      let hashed = CryptoJS.SHA512(this.datos.value.pssw).toString(CryptoJS.enc.Hex);

      let info = {salt:this.datos.value.salt , pssw:hashed }

      // console.log(info);

      this.api.cambioContrasena(info).then((res)=>{
        // console.log(res);
        // this.loading.dismiss();
        this.load = false;

        if(res === true){

          this.navCtrl.setRoot(WelcomePage);
          this.presentToast("Contraseña cambiada exitosamente.");

        }else{
          this.presentToast("El codigo de recuperación de contraseña no coincide.")
        }

      },(err)=>{
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión.")
      });

    }else{
      this.presentToast("las contraseñas no coinciden.")
    }

    
  }

  esUsuario(){
    this.esAdmin=false;
    this.navCtrl.push(FormularioRegistroPage,{esAdmin:this.esAdmin});
  }

  esProveedor(){
    this.esAdmin=true;
    this.navCtrl.push(FormularioRegistroAdminPage,{esAdmin:this.esAdmin});
  }

  goToWelcome(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RegistroPage');
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  

}
