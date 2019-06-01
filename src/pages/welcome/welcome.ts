import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,MenuController,Loading,
  LoadingController } from 'ionic-angular';
import {RegistroPage} from '../registro/registro';
import { Facebook } from '@ionic-native/facebook';
import CryptoJS from 'crypto-js';
import { Storage } from '@ionic/storage';
import {HomePage} from '../home/home';
import {ApiProvider} from '../../providers/api/api';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  key : string = "token";
  keyId : string = "id";
  keyAdmin : string = "admin";
  esAdmin : boolean;
  tokenR:string;
  id_usuario:string;
  resposeData : any;
  userData = {"email":"", "pssw":""};
  user: any = {};
  pssw:any;
  hashed : any;
  private datos : FormGroup;
  loading: Loading;
  load;


  constructor(public navCtrl: NavController, public navParams: NavParams,private fb:Facebook,
    private toastCtrl:ToastController,public auth:ApiProvider,private formBuilder: FormBuilder,
    public menu: MenuController,public loadingCtrl: LoadingController) {

      this.menu.close();
      this.menu.swipeEnable(false);
      this.datos = this.formBuilder.group({
        email: ['', [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        pssw: ['',[Validators.required,]],
        // Validators.minLength(8)
      });
  }

  login(){
    if(!this.datos.valid){
      this.presentToast("Por favor rellena los campos");
    }
    else{
      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos verificando tu información... ",
      // });
      // this.loading.present(); 
      this.load = true; 
    
    let hashed = CryptoJS.SHA512(this.datos.value.pssw).toString(CryptoJS.enc.Hex);

    this.userData.email = this.datos.value.email;
    this.userData.pssw = hashed;


    // console.log(this.userData)
    this.auth.postLogin(this.userData,"/login").then((result)=>{
      console.log(result);
      this.resposeData = result;
      if(this.resposeData.token){
        // this.loading.dismiss();
        console.log(this.resposeData)
        this.tokenR = this.resposeData.token;
        this.id_usuario = this.resposeData.id_usuario;
        this.esAdmin = this.resposeData.admin; 
        // this.userInfo=[this.esAdmin,this.id_usuario]
      
        localStorage.setItem(this.key,JSON.stringify(this.resposeData.token));
        localStorage.setItem(this.keyId,JSON.stringify(this.resposeData.id_usuario));
        localStorage.setItem(this.keyAdmin,JSON.stringify(this.resposeData.esAdmin));
        this.navCtrl.setRoot(HomePage);
      }
      else{
        // console.log(this.resposeData)
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("usuario o contraseña incorrectos");
      }
    },
    
    (error)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("error en la conexion intentalo mas tarde")}
  );
  }
  }

  loginFacebook(){
    this.load = true;
    this.fb.login(['public_profile', 'email'])
    .then(rta => {
      // console.log(rta.status);
      if(rta.status == 'connected'){
     

          this.fb.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
          .then(data=>{
            // console.log(data);
            this.user = data;
            // this.pssw = this.user.id;
            this.hashed = CryptoJS.SHA512(this.user.id).toString(CryptoJS.enc.Hex);
            // this.userData={"email":this.user.email,"pssw":this.hashed};   
            let user={email:this.user.email, pssw:this.hashed, avatar:this.user.picture.data.url}
           
            // console.log("USERRRRRRRRRRRRR");
            // console.log(user);

            /////////////////////////Envio datos a la API///////////////////////////////
            // this.loading = this.loadingCtrl.create({
            //   spinner: 'hide',
            //   content: "Espera un momento<br>estamos verificando tu información... ",
            // });
            // this.loading.present();
            this.auth.postLogin(user,"/login").then((result)=>{
              this.resposeData = result;
              console.log(this.resposeData);
              if(this.resposeData.login  === true){ 
                // this.loading.dismiss();
                this.load = false;
                // console.log(this.resposeData)
                this.userData.email = this.user.email;
                this.userData.pssw = this.hashed;
                this.tokenR = this.resposeData.token;
                this.id_usuario = this.resposeData.id_usuario;
                this.esAdmin = this.resposeData.esAdmin; 
                // this.userInfo=[this.esAdmin,this.id_usuario]
              
                localStorage.setItem(this.key,JSON.stringify(this.resposeData.token));
                localStorage.setItem(this.keyId,JSON.stringify(this.resposeData.id_usuario));
                localStorage.setItem(this.keyAdmin,JSON.stringify(this.resposeData.esAdmin));
                this.navCtrl.setRoot(HomePage);
              }
              else{
                // this.loading.dismiss();
                this.load = false;
                this.presentToast("No se encuentra registrado, Por favor registrate");
              }
            },(error)=>{
              // this.loading.dismiss();
              this.load = false;
              this.presentToast("error en la conexion intentalo mas tarde")}
          );
            
      
          })
          .catch(error =>{
            this.load = false;
            this.presentToast("error en la conexion intentalo mas tarde");
            // console.error( error );
          });

      };
    })
    .catch(error =>{
      this.load = false;
      // console.error( error );
      this.presentToast("error en la conexion intentalo mas tarde");
    });
  }

  ionViewDidLoad() {
    
  }

   goToRegistro(){
    this.navCtrl.push(RegistroPage,{registro:true});
   }

   cambioContrasena(){
    this.navCtrl.push(RegistroPage,{registro:false})
   }

   presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
