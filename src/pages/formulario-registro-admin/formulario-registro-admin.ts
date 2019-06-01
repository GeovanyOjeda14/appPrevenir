import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Loading,
  LoadingController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import CryptoJS from 'crypto-js';
import {HomePage} from '../home/home';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import {ApiProvider} from '../../providers/api/api';

/**
 * Generated class for the FormularioRegistroAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formulario-registro-admin',
  templateUrl: 'formulario-registro-admin.html',
})
export class FormularioRegistroAdminPage {
  loading: Loading;
  user:any;
  face:any;
  hashed:any;
  esAdmin:any;
  resposeData : any;
  tokenR:string;
  id_usuario:string;
  key : string = "token";
  keyId : string = "id";
  keyAdmin : string = "admin";
  private datos : FormGroup;
  confirm:boolean = false;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams,private fb:Facebook,
    private toastCtrl:ToastController,public auth:ApiProvider,private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController) {

      this.datos = this.formBuilder.group({
        nombre: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(40)]],
        email: ['', [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        pssw: ['',[Validators.required,Validators.minLength(8)]],
        direccion: ['',[Validators.required]],
        id: ['',[Validators.required,Validators.min(0),Validators.pattern('[0-9]*')]],
        tel: ['',[Validators.required,Validators.min(0),Validators.pattern('[0-9]*')]],
        wsp: ['',[]],
        confirmacion : ['',[Validators.required,Validators.minLength(8)]],
      });
  }
hhh
  ionViewDidLoad() {
    // console.log('ionViewDidLoad FormularioRegistroAdminPage');
  }

  registrar(){
   if(!this.datos.valid)
   {this.presentToast("Completa los campos requeridos");
  }
   else{

      let pssw1 = this.datos.value.pssw;
      let pssw2 = this.datos.value.confirmacion;

      if(pssw1 === pssw2){

    this.load = true;
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos guardando tu información... ",
    // });
    // this.loading.present();

    this.confirm = false;
    this.esAdmin=true;
    this.face=false;
    let hashed = CryptoJS.SHA512(this.datos.value.pssw).toString(CryptoJS.enc.Hex);
    
    let userData = {"email":this.datos.value.email,"pssw":hashed,
    "nombre":this.datos.value.nombre,"esAdmin":this.esAdmin,"face":this.face,"direccion":this.datos.value.direccion,
    "nit":this.datos.value.id,"tel":this.datos.value.tel,"wsp":this.datos.value.wsp};

    // console.log(userData);


    this.auth.postLogin(userData,"/register").then((result)=>{
      
       this.resposeData = result;
      var r1 = result[0];
      var r2 = result[1];
      // console.log(this.resposeData);
      // console.log("registro11122131");
      // console.log(this.resposeData);
      // console.log(r1);
      // console.log(r2);
      
      ///////////////////////////verificar si el usuario no existe/////////////////
      if(r1.existe==false){  
      
        let int = parseInt(r2.id_usuario);
        // console.log("IDDDDDDDDDDDD  ",int);
        localStorage.setItem(this.key,JSON.stringify(r2.token));
        localStorage.setItem(this.keyId,JSON.stringify(int));
        localStorage.setItem(this.keyAdmin,JSON.stringify(r2.esAdmin));
        // this.loading.dismiss();
        this.load = false;
        this.navCtrl.setRoot(HomePage);
      }
      else{
        // this.loading.dismiss();
        this.load = false;
        let campo = r2[0].campo;
        if(campo === "email"){
          this.presentToast("El correo ya se encuentra registrado");
        }else{
          this.presentToast("El nit ya se encuentra registrado");
        }
        
      }
  
    },(error)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexion intentalo mas tarde")}
  );

      }else{
        this.confirm = true;
      }
  }
}

  goBack(){
    this.navCtrl.pop();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
