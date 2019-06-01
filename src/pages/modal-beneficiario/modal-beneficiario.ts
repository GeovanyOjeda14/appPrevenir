import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ToastController,Loading,
  LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import {ApiProvider} from '../../providers/api/api';
import {Global} from '../../app/global';

/**
 * Generated class for the ModalBeneficiarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-beneficiario',
  templateUrl: 'modal-beneficiario.html',
})
export class ModalBeneficiarioPage {
  info;
  base64Image;
  loading: Loading;
  mascota;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private crop: Crop,private base64: Base64, private photoViewer: PhotoViewer,private camera: Camera,
    private toastCtrl:ToastController,public loadingCtrl: LoadingController, private api:ApiProvider,
    private global:Global) {
    this.info = this.navParams.get('info');
    this.mascota = this.navParams.get('mascota');

    // console.log(this.info.id_mascotas);
    // console.log(this.mascota);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalBeneficiarioPage');
  }
  close(){
    this.viewCtrl.dismiss();
  }

  verImg(foto){
    this.photoViewer.show(foto, '', {share: false});
  }

  openGalery(){
    
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando el recorte... ",
    // });
    // this.loading.present();
    this.load = true;

    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              allowEdit: false,
              correctOrientation: true,
              //destinationType: this.camera.DestinationType.DATA_URL,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              quality: 75,
              saveToPhotoAlbum: false,
              targetWidth: 800,
              targetHeight: 800
    }
   
    this.camera.getPicture(options).then((imageData) => {

      // let opt = {
      //   quality: 75,
      //   widthRatio: 6,
      //   heightRatio: 6,
      //   targetWidth: 100,
      //   targetHeight: 500
      //   };

			return this.crop.crop(imageData, { quality: 75 });
		}).then(croppedImagePath => {
      
			return this.base64.encodeFile(croppedImagePath)
		}).then(base64Data => {
      this.base64Image = base64Data;
      this.base64Image = this.base64Image.replace("*","jpeg");
      // this.loading.dismiss();
      this.load = false;

      // console.log("IMAGENNNNNNNNNNNNNNNNN");
      // console.log(this.base64Image);
      // console.log("IMAGENNNNNNNNNNNNNNNNN");
      
		}).catch(err => {
      // this.loading.dismiss();
      this.load = false;
      // this.presentToast("Error en la conexión, intentalo más tarde"); solucion dismiss recorte
			// console.log(err)
    });
  }

  guardarAvatar(){
    // console.log(this.imagen);
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos guardando tu avatar... ",
    // });
    // this.loading.present();
    this.load = true;

    // let j = {foto:this.base64Image,id:this.global.id_usuario,admin:this.global.admin,medico:this.global.medico};


    this.api.editAvatar(this.base64Image,this.global.id_usuario,this.global.admin,this.global.medico).then((data)=>{
       
      let a = data[0].cambio;
      if(a === true){
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Avatar cambiado con exito");
        this.viewCtrl.dismiss();
        this.navCtrl.pop();
        this.base64Image = null;
      }else{
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Error al cambiar el avatar intentalo mas tarde");
      }

    },(err)=>{
      this.presentToast("Error en la conexión, intentalo más tarde.")
      // console.log(err);
      this.load = false;
    });
    
  }

  guardarAvatarMascota(){
    
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos guardando tu avatar... ",
    // });
    // this.loading.present();
    this.load = true;

    // this.base64Image,this.info.id_mascotas,this.global.admin

    let datos = {id:this.info.id_mascotas , imagen:this.base64Image}
    this.api.editAvatarMascota(datos).then((res)=>{

      if(res === true){
        // this.loading.dismiss();
        this.load = true;
        this.presentToast("Avatar cambiado con exito");
        this.viewCtrl.dismiss();
        this.navCtrl.pop();
        this.base64Image = null;
      }else{
        // this.loading.dismiss();
        this.load = true;
        this.presentToast("Error al cambiar el avatar intentalo mas tarde");
      }

    },(err)=>{
      // this.loading.dismiss();
      this.load = true;
      this.presentToast("Error en la conexión, intentalo más tarde.")
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
