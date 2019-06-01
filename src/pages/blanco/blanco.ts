import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController,Loading,
  LoadingController, MenuController  } from 'ionic-angular';
import { HomePage } from '../home/home';
import { WelcomePage } from '../welcome/welcome';
import { ApiProvider } from '../../providers/api/api';
import { Global } from '../../app/global';


/**
 * Generated class for the BlancoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-blanco',
  templateUrl: 'blanco.html',
})
export class BlancoPage {
  loading: Loading;
  locked;
  codigo:string;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private api:ApiProvider, private global:Global, private toastCtrl:ToastController,private alertCtrl: AlertController,
              public loadingCtrl: LoadingController, public menu: MenuController) {

    this.locked = this.navParams.get('locked');
    console.log(this.locked);

    if(!this.locked){
      this.estaLogeado();
    }

    
  }

  
  estaLogeado(){
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento... ",
    //   duration: 3000
    // });
    // this.loading.present();
    this.load = true;
    this.menu.enable(false);

    let mostrar = localStorage.getItem("token");
    // console.log("Aqui toyyy"+mostrar);
    if(mostrar != null){
      // this.loading.dismiss();
      this.load = false;
      this.menu.enable(true);
     this.navCtrl.setRoot(HomePage);
    }
    else{
      // this.loading.dismiss();
      this.load = false;
      this.menu.enable(true);
      this.navCtrl.setRoot(WelcomePage)
    }
  }

  confirmar(){

    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br> Estamos confirmando tu cuenta... ",
    // });
    // this.loading.present();

    this.load = true;
      this.menu.enable(false);

    let info = {salt:this.codigo , id:this.global.id_usuario}

    this.api.confirmacionCuenta(info).then((res)=>{
      
      if(res === true){
        
        // this.loading.dismiss();
        this.load = false;
        this.menu.enable(true);
           let alert = this.alertCtrl.create({
          title: 'Bienvenid@',
          subTitle: 'Bienvenido al grupo PREVENIR EXPRESS.',
          buttons: ['Gracias']
        });
        alert.present()
        this.navCtrl.setRoot(HomePage);
      }else{
        // this.loading.dismiss();
        this.load = false;
        this.menu.enable(true);
        this.presentToast("Codigo incorrecto");
      }
    },(err)=>{
      this.load = false;
      this.menu.enable(true);
      console.log(err);
    });
  }

  reenviar(){

    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br> Estamos generando un codigo nuevo... ",
    // });
    // this.loading.present();

    this.load = true;
    this.menu.enable(false);

    this.api.getReenviarCodigoCorreo(this.global.id_usuario).subscribe((data)=>{

      // this.loading.dismiss();
      this.load = false;
      this.menu.enable(true);
 
      if(data === true){

        this.presentToast("Código reenviado con exito, Por favor revisa tu correo.");

      //   let alert = this.alertCtrl.create({
      //     title: 'Reenvio codigo',
      //     subTitle: 'Código reenviado con exito, Por favor revisa tu correo.',
      //     buttons: ['Confirmar']
      //   });
      //   alert.present()

      }

    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.menu.enable(true);
      this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión.")
    });

  }

  ionViewDidLoad() {
    
  }

  goToRegistro(){

  localStorage.clear();
  this.global.infoPerfil={};
  this.global.login = false;
  this.global.foto=null;
  this.global.nombre=null;
  this.global.id_usuario = null;
  this.global.medico = false;

  this.navCtrl.setRoot(WelcomePage);


  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
