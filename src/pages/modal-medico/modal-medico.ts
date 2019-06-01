import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ToastController,Loading,
  LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Global } from '../../app/global';
import { HomePage } from '../home/home';

/**
 * Generated class for the ModalMedicoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-medico',
  templateUrl: 'modal-medico.html',
})
export class ModalMedicoPage {
  loading: Loading;
  info;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
    private toastCtrl:ToastController,public loadingCtrl: LoadingController, private api:ApiProvider, private global : Global) {

      this.info = this.navParams.get('info');
      // console.log(this.info);
  }


  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalMedicoPage');
  }

  close(){
    this.viewCtrl.dismiss();
  }

  eliminarMedico(){
    
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos procesando la solicitud... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.dltMedicoPorProvedor(this.info.medico_id,this.global.id_usuario).then((res)=>{
       this.load = false; 
      if(res === true){
        this.presentToast("Medico eliminado con exito");
        this.viewCtrl.dismiss();
      }else{
        this.presentToast("El medico no se puede eliminar por que tiene un servicio asociado, elimina primero el servicio.");
      }
    },(err)=>{
      this.load = false;
      this.navCtrl.setRoot(HomePage);
      this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión.");
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
