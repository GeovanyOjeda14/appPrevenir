import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Loading,
  LoadingController,ToastController,ModalController,IonicApp } from 'ionic-angular';
import { AgregarMedicoPage } from '../agregar-medico/agregar-medico';
import { ApiProvider } from '../../providers/api/api';
import { Global } from '../../app/global';
import { HomePage } from '../home/home';
import { ModalMedicoPage } from '../modal-medico/modal-medico';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import * as moment from 'moment';



/**
 * Generated class for the MedicosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-medicos',
  templateUrl: 'medicos.html',
})
export class MedicosPage {

  medicos;
  loading: Loading;
  medico_id;
  infoMedico;
  avatar;
  nombres;
  telefono;
  titulo;
  tarj_profecional;
  titulos=[];
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams, private global : Global, private api : ApiProvider,
    public loadingCtrl: LoadingController,private toastCtrl:ToastController,private modalCtrl: ModalController, public app : IonicApp,
    private photoViewer: PhotoViewer) {

      this.infoMedico = this.navParams.get('medico');
      console.log(this.infoMedico);

      if(this.infoMedico){
        this.nombres = this.infoMedico.nombres + " " + this.infoMedico.apellidos; 
        this.avatar = this.infoMedico.avatar;

        for(let i = 0; i < this.infoMedico.titulos.length; i++){

          let nombre = this.infoMedico.titulos[i].nombre;
          let institucion = this.infoMedico.titulos[i].institucion;
          let start = this.infoMedico.titulos[i].start;
          start = moment(start).format('DD-M-YYYY');
          let end = this.infoMedico.titulos[i].end;
          end = moment(end).format('DD-M-YYYY');
  
          this.titulos.push({nombre:nombre , institucion : institucion , start : start , end:end});
        }
      }

      


      

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MedicosPage');
  }

  ionViewWillEnter(){

    if(!this.infoMedico){

      this.medicos = null;

      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos procesando tu solicitud... ",
      // });
      // this.loading.present();
      this.load = true;
  
      this.api.getMedicosProvedor(this.global.id_usuario).subscribe((data)=>{
        console.log(data);
        this.medicos = data;
        // this.loading.dismiss();
        this.load = false;
      },(err)=>{
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión");
        this.navCtrl.setRoot(HomePage);
        // console.log(err);
      });
    }
    
   
  }

  ionViewCanLeave(){
    
    let activeModal=this.app._modalPortal.getActive();
    
       if(activeModal){
        activeModal.dismiss();
        
    }
   }

  goToAgregar(){
    this.navCtrl.push(AgregarMedicoPage);
  }

  ver(info){
    
    let modal = this.modalCtrl.create(ModalMedicoPage,{info:info});
      modal.present();

      modal.onDidDismiss((data)=>{
        console.log(data);
        if(!data){
          this.infoMedico = undefined;
          this.ionViewWillEnter();
        }
      });
  }

  verImg(foto){
    this.photoViewer.show(foto, '', {share: false});
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}


// getMedico(){
  //   this.loading = this.loadingCtrl.create({
  //     spinner: 'hide',
  //     content: "Espera un momento<br>estamos procesando tu solicitud... ",
  //   });
  //   this.loading.present();

  //   this.api.getInfoMedico(this.medico_id).subscribe((data)=>{
   
  //     this.loading.dismiss();

  //     let info = data[0];
  //     console.log(data);
  //     this.infoMedico = data[0].titulos;
    
  //     this.avatar = info.avatar;
  //     this.nombres = info.nombres + " " + info.apellidos;
  //     this.titulo =info.titulo;
  //     this.tarj_profecional = info.tarj_profecional;
  //     this.telefono = info.telefono;

  //     for(let i = 0; i < this.infoMedico.length; i++){

  //       let nombre = this.infoMedico[i].nombre;
  //       let institucion = this.infoMedico[i].institucion;
  //       let start = this.infoMedico[i].start;
  //       start = moment(start).format('DD-M-YYYY');
  //       let end = this.infoMedico[i].end;
  //       end = moment(end).format('DD-M-YYYY');

  //       this.titulos.push({nombre:nombre , institucion : institucion , start : start , end:end});
  //     }

  //   },(err)=>{
  //     this.loading.dismiss();
  //     this.navCtrl.setRoot(HomePage);
  //     this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión.")
  //   });
  // }
