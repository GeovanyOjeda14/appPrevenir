import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Loading,
  LoadingController } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import {HomePage} from '../home/home';
import CryptoJS from 'crypto-js';
import {RegistroPage} from '../registro/registro';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

/**
 * Generated class for the FormularioRegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formulario-registro',
  templateUrl: 'formulario-registro.html',
})
export class FormularioRegistroPage {
  loading: Loading;
  esAdmin:any;
  face:any;
  user:any;
  resposeData : any;
  userData = {"id":"","email":"", "identificacion":"","pssw":"","nombre":"",
  "apellido":"","esAdmin":"","face":""};
  tokenR:string;
  id_usuario:string;
  key : string = "token";
  keyId : string = "id";
  keyAdmin : string = "admin";
  pssw:string;
  hashed:any;
  idFb:any;
  private datos : FormGroup;
  confirm : boolean = false;
  load;
 

  constructor(public navCtrl: NavController, public navParams: NavParams,private toastCtrl:ToastController,
    public auth:ApiProvider,private fb:Facebook,private formBuilder: FormBuilder,public loadingCtrl: LoadingController) {
    this.esAdmin = this.navParams.get('esAdmin');


    this.datos = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(20)]],
      apellido: ['',[Validators.required, Validators.minLength(4),Validators.maxLength(20)]],
      id: ['',[Validators.required,Validators.min(0),Validators.pattern('[0-9]*')]],
      email: ['',[Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      pssw: ['',[Validators.required,Validators.minLength(8)]],
      confirmacion: ['',[Validators.required,Validators.minLength(8)]],
  
   

    });


    
  }

  registroFacebook(){
    this.load = true;
    this.fb.login(['public_profile', 'email'])
    .then(rta => {
      // console.log(rta.status);
      if(rta.status == 'connected'){
     
          // this.getInfo();

          this.fb.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
          .then(data=>{
            // console.log(data);
            this.user = data;
            this.face=true;
            this.pssw = this.user.id;
            this.hashed = CryptoJS.SHA512(this.pssw).toString(CryptoJS.enc.Hex);
            this.idFb=this.user.id;
            // console.log(this.esAdmin);
            
            
           

            let user ={"email":this.user.email,"identificacion":"","pssw":this.hashed,
            "nombre":this.user.first_name,"apellido":this.user.last_name,"esAdmin":this.esAdmin,"face":this.face,avatar:this.user.picture.data.url};
            // console.log(user);

            /////////////////////////Envio datos a la API///////////////////////////////
            // this.loading = this.loadingCtrl.create({
            //   spinner: 'hide',
            //   content: "Espera un momento<br>estamos guardando tu información... ",
            // });
            // this.loading.present();
            this.auth.postLogin(user,"/register").then((result)=>{
            this.resposeData = result;
              // console.log(this.resposeData);

              let recorrido = result[0];
              let recorri2 = result[1];

              
              // console.log("/////////////////////AQUIIII///////");
              // console.log(recorrido.existe);

              if(recorrido.existe === false ){ ///////this.resposeData.mensaje = "false"
              
                this.tokenR = this.resposeData.token;
                this.id_usuario = this.resposeData.id_usuario;
              
                let int = parseInt(recorri2.id_usuario);
                // console.log("IDDDDDD  ",int);
                localStorage.setItem(this.key,JSON.stringify(recorri2.token));
                localStorage.setItem(this.keyId,JSON.stringify(recorri2.id_usuario));
                localStorage.setItem(this.keyAdmin,JSON.stringify(recorri2.esAdmin));
                

                this.userData.nombre = this.user.first_name;
                this.userData.apellido = this.user.last_name;
                this.userData.email = this.user.email;
                this.userData.pssw = this.user.hashed;
                // this.loading.dismiss();
                this.load = false;
                this.navCtrl.setRoot(HomePage);
              }
              else{
                //usuario ya existe
                // this.loading.dismiss();
                this.load = false;
                this.presentToast("El correo ya se encuentra registrado");
              }
            
            },(error)=>{
              // this.loading.dismiss();
              this.load = false;
              this.presentToast("Error en la conexion intentalo mas tarde")}
          );
            
      
          })
          .catch(error =>{
            this.load = false;
            this.loading.dismiss();
            // console.error( error );
          });

      };
    })
    .catch(error =>{
      // console.error( error );
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexion");
    });
  }

  registrar(){
    this.load = true;
    if(!this.datos.valid){
      this.presentToast("Completa los campos requeridos");
    }
    else{
    this.face=false;
    let pssw1 = this.datos.value.pssw;
    let pssw2 = this.datos.value.confirmacion;

    if(pssw1 === pssw2){

    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos guardando tu información... ",
    // });
    // this.loading.present();
    this.confirm = false;
    this.esAdmin = false;
    this.face = false;
    this.hashed = CryptoJS.SHA512(this.datos.value.pssw).toString(CryptoJS.enc.Hex);
   //  "id":this.datos.value.id,
    let userData = {"email":this.datos.value.email, "identificacion":this.datos.value.id,
    "pssw":this.hashed,"nombre":this.datos.value.nombre,
    "apellido":this.datos.value.apellido,"esAdmin":this.esAdmin,"face":this.face,"avatar":"http://cdn.prevenirexpress.com/avatars/avatarundefined.png"};
    
    
    // console.log(userData);


     this.auth.postLogin(userData,"/register").then((result)=>{
     this.resposeData = result;
    
      var re1 = result[0];
      var re2 = result[1];
      // console.log("resulta222222222");
      // console.log(re1);
      // console.log(re2);
      // console.log(this.resposeData);
      ///////////////////////////verificar si el usuario no existe/////////////////
      if(re1.existe==false){
       
        let int = parseInt(re2.id_usuario);
        // console.log("IDDDDDD  ",int);
        localStorage.setItem(this.key,JSON.stringify(re2.token));
        localStorage.setItem(this.keyId,JSON.stringify(int));
        localStorage.setItem(this.keyAdmin,JSON.stringify(re2.esAdmin));
        // this.loading.dismiss();
        this.load = false;
        this.navCtrl.setRoot(HomePage);
      }
      else{
        // this.loading.dismiss();
        this.load = false;
       

        let campo = this.resposeData[1];
        campo = campo[0].campo;
        if(campo === "email"){
          this.presentToast("El correo ya se encuentra registrado");
        }else{
          this.presentToast("La cedula ya se encuentra registrado");
        }
      }
 
    },(error)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("error en la conexión intentalo mas tarde")}
    );
      }
      else{
      // console.log("No son iguales");
      this.confirm = true;
      }
    } 
  }

  goBack(){
    this.navCtrl.pop();
  }




  ionViewDidLoad() {
    // console.log('ionViewDidLoad FormularioRegistroPage');
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
