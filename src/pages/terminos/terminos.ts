import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Loading,
  LoadingController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Global } from '../../app/global';

/**
 * Generated class for the TerminosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terminos',
  templateUrl: 'terminos.html',
})
export class TerminosPage {
  comentarios;
  loading: Loading;
  coments;
  infoComents=[];
  comentArea:string;
  visual:boolean=false;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api : ApiProvider, private global:Global, private toastCtrl:ToastController,
    public loadingCtrl: LoadingController) {

    this.comentarios = this.navParams.get('info');
    console.log(this.comentarios);
    
    if(this.comentarios){
      this.getComentariosMedico();
    }
  }

  getComentariosMedico(){

    this.infoComents = [];
    this.comentArea = "";
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando comentarios... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.getComentarioMedico(this.comentarios.id_servicios, this.comentarios.categoria_idcategoria).
    subscribe((data)=>{
      // this.loading.dismiss();
      this.load = false;
      // console.log(data);
      this.coments = data;
      if(this.coments.length <=0){
        this.visual = true;
      }else{
        this.visual = false;
      }

 
      this.informacionComentarios();

    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión.");
    });

    // this.api.getComentarioMedico(this.co)
  }

  informacionComentarios(){

  

    for(let i = 0;i < this.coments.length; i++){


      let comentario = this.coments[i].comentario;
      let id_comentarios = this.coments[i].id_comentarios;
      let avatar = this.coments[i].avatar;
      let usu = this.coments[i].usu;

      this.infoComents.push({comentario : comentario , id_comentarios : id_comentarios , avatar : avatar , usu : usu});

    }

    console.log(this.infoComents);

  }

  responder(info){

    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos enviando su respuesta... ",
    // });
    // this.loading.present();
    this.load = true;
    
    let infoComent = { cate: this.comentarios.categoria_idcategoria , coment : this.comentArea , id : info.id_comentarios };

    console.log(infoComent);

    this.api.respuestaComentarioMedico(infoComent).then((res)=>{
      console.log(res);
      // this.loading.dismiss();
      this.load = false;

      if(res === true){
        this.presentToast("Respuesta exitosa.")
        this.getComentariosMedico();
      }else{
        this.presentToast("Error al enviar su respuesta.");
      }

    },(err)=> {
      // this.loading.dismiss();
      this.load = false;
      this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión.");
    });
    
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TerminosPage');
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


}
