import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,AlertController,ToastController,
  Loading, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { Global } from '../../app/global';
import { ApiProvider } from '../../providers/api/api';
import { PhotoViewer } from '@ionic-native/photo-viewer';

/**
 * Generated class for the ModalCitaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-cita',
  templateUrl: 'modal-cita.html',
})
export class ModalCitaPage {
  info;
  usuarios_id;
  user;
  nombre;
  apellido;
  fechaNacimiento;
  contacto;
  correo;
  avatar;
  cedula;
  loading: Loading;
  categoria;
  verMascota:boolean=false;
  sexo;
  nombreDueno;
  esterilizado;
  color;
  raza;
  especie;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
    private global:Global, private api:ApiProvider,private alertCtrl: AlertController,private toastCtrl:ToastController,
    private photoViewer: PhotoViewer, public loadingCtrl: LoadingController) {

    this.info = this.navParams.get('info');
    this.categoria = this.navParams.get('categoria');
    this.usuarios_id = this.info.usuarios_id;
    // console.log(this.info);
    //  [i]
    if(this.categoria == 20){
      this.verMascota=true;
      this.mascota();
    
    }else{
     
      this.paciente();
    }
    
     
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad InfoCitaPage');
  }

  mascota(){
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando la información... ",
    // });
    // this.loading.present();
    this.load = true;
    
    this.api.getMascotaInfo(this.usuarios_id).subscribe((data)=>{
      // console.log(data[0]);
      this.avatar = data[0].avatar;
      this.nombre = data[0].nombre;
      this.raza = data[0].raza;
      this.color = data[0].color;
      this.especie = data[0].especie;
      this.sexo = data[0].sexo;
      this.esterilizado = data[0].esterilizado;
      this.fechaNacimiento = data[0].fecha_nacimineto;
      this.fechaNacimiento = moment(this.fechaNacimiento).format('DD-MM-YYYY');
      this.nombreDueno = data[0].dueño;
      this.contacto = data[0].telefono;

      

      // this.loading.dismiss();
      this.load = false;
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexion, intentalo mas tarde");
    });
  }

  paciente() {
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando la información... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.getUser(this.usuarios_id).subscribe((data)=>{
      // console.log(data);
      this.user = data[0];
      this.nombre= data[0].nombre;
      this.apellido = data[0].apellidos;
      this.fechaNacimiento = data[0].fecha_nacimiento;
      this.fechaNacimiento = moment(this.fechaNacimiento).format('DD-MM-YYYY');
      this.contacto = data[0].telefono;
      this.correo = data[0].correo;
      this.avatar = data[0].avatar;
      this.cedula = data[0].cedula;
      // this.loading.dismiss();
      this.load = false;
     
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexion, intentalo mas tarde");
      // console.log(err)
    });
  }

  verImg(foto){
    this.photoViewer.show(foto, '', {share: false});
  }

  eliminar(bol){
    // console.log(this.info.id_eventos);

    let alert = this.alertCtrl.create({
      title: 'Confirmación',
      message: '¿Estas seguro que deseas eliminar esta cita?',
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
            //   spinner : 'hide',
            //   content : "Espera un momento<br>estamos procesando la solicitud... ",
            // });
            // this.loading.present();
            this.load = true;

            if(bol === false){ 
              this.api.dltCitaProvedor(this.info.id_eventos,this.global.id_usuario,0).then((data)=>{
                // console.log(data);
                let a = data;
                a = a[0].borrado;
                // console.log(a);
                if (a === true){
                  this.presentToast("Su cita fue eliminada con exito");
                  // this.loading.dismiss();
                  this.load = false;
                  this.viewCtrl.dismiss({borrado:true});
  
                }
  
              },(err)=>{
                // this.loading.dismiss();
                this.load = false;
                this.presentToast("Error en la conexion, intentalo mas tarde");
                // console.log(err);
              });
            }else{

              this.api.dltCitaProvedor(this.info.id_eventos,this.global.id_usuario,20).then((data)=>{
                // console.log(data);
                let a = data;
                a = a[0].borrado;
                // console.log(a);
                if (a === true){
                  this.presentToast("Su cita fue eliminada con exito");
                  // this.loading.dismiss();
                  this.load = false;
                  this.viewCtrl.dismiss({borrado:true});
  
                }
  
              },(err)=>{
                // this.loading.dismiss();
                this.load = false;
                this.presentToast("Error en la conexion, intentalo mas tarde");
                // console.log(err);
              });

            }  
          }
        }
      ]
    });
    alert.present();
  }


  close(){
    this.viewCtrl.dismiss();
  }
  save(){
    this.viewCtrl.dismiss();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
