import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {HomePage} from '../home/home';
import {Global} from '../../app/global';
import {ApiProvider} from '../../providers/api/api';

/**
 * Generated class for the CalificacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calificacion',
  templateUrl: 'calificacion.html',
})
export class CalificacionPage {
  cal1:boolean=true;
  cal2:boolean=false;
  cal3:boolean=false;
  comentario:boolean=false;
  estrellas1;
  estrellas2;
  estrellas3;
  coment="";
  todo : FormGroup;
  info;
  mascota;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams,private toastCtrl:ToastController,
    private formBuilder: FormBuilder, private global:Global, private api:ApiProvider) {

      this.info = this.navParams.get('info');
      // console.log(this.info);

      this.mascota = this.navParams.get('mascota');
      // console.log(this.mascota);

      this.todo = this.formBuilder.group({
        comentario: ['',[Validators.maxLength(140)]],
      });

  }

  ionViewDidLoad() {
    
  }

  siguiente(){

    let siguiente:boolean=true;
    switch(siguiente === true){

      case (this.cal1 === true):

      if(!this.estrellas1){
        this.presentToast("Por favor elige una calificación");
      }else{
        this.cal2 = true;
        this.cal1 = false;
      }
     
      break;

      case (this.cal2 === true):

      if(!this.estrellas2){
        this.presentToast("Por favor elige una calificación");
      }else{
        this.cal3 = true;
        this.cal2 = false;
      } 
      break;

      case (this.cal3 = true):

      if(!this.estrellas3){
        // this.presentToast("Por favor elige una calificación");
      }else{
        this.comentario = true;
        this.cal3 = false;
      }
      
      break;
    }
  }

  atras(){

    let atras:boolean=true;

    switch(atras === true){

      case (this.cal2 === true):
      this.cal1 = true;
      this.cal2 = false;
      this.estrellas1=undefined;
      break;

      case (this.cal3 === true):
      this.cal2 = true;
      this.cal3 = false;
      this.estrellas2=undefined;
      break;

      case(this.comentario === true):
      this.cal3=true;
      this.comentario=false;
      this.estrellas3 =undefined;
      break;

    }


   
   
  }

  valor(num){
    
    let estrellas:boolean=true;

    switch(estrellas === true){
      
      case(this.cal1 === true):
      this.estrellas1 = num;
      break;

      case(this.cal2 === true):
      this.estrellas2 = num;
      break;

      case(this.cal3 === true):
      this.estrellas3 = num;
      break;
    }
  }

  enviar(){
      this.load = true;
      // console.log(this.estrellas1);
      // console.log(this.estrellas2);
      // console.log(this.estrellas3); 
      // console.log(this.todo.value.comentario);

      let promedio = (this.estrellas1 + this.estrellas2 + this.estrellas3 ) / 3;
      promedio = Math.round(promedio);

      let info = {coment:this.todo.value.comentario , califica : promedio, ids:this.info.id_servicio,
        idU:this.global.id_usuario, idh:this.info.id_historial, masc:this.mascota};

        //        
        console.log(info);
              
        this.api.postCalificacion(info).then((res)=>{
          this.load = false;
          // console.log(res);
          if(res === true){
            this.presentToast("Gracias por calificarnos.");
            this.navCtrl.pop();
          }
          
        },(err)=>{
          this.load = false;
          this.presentToast("Error en la conexion, intentalo mas tarde o revisa tu conexion");
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
