import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,AlertController,ToastController,Platform , 
  IonicApp, App } from 'ionic-angular';
import * as moment from 'moment';
import {ApiProvider} from '../../providers/api/api';
import {ModalCitaPage} from '../modal-cita/modal-cita';
import {Global} from '../../app/global';
import {SacarCitaPage} from '../sacar-cita/sacar-cita';


/**
 * Generated class for the CitasProvedorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-citas-provedor',
  templateUrl: 'citas-provedor.html',
})
export class CitasProvedorPage {
  public id_servicios;
  hr:boolean = false;
  information;
  maniana;
  tarde;
  fecha;
  today;
  f;
  nombre;
  eve;
  currentEvents=[];
  id_categoria;
  medico;
  load;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public api:ApiProvider,
    private modalCtrl: ModalController,private alertCtrl: AlertController, private global:Global,
    private toastCtrl:ToastController,private platform : Platform , private app : IonicApp , public ap: App) {

    this.id_servicios = this.navParams.get('id_servicios');
    this.nombre = this.navParams.get('nombre');
    this.id_categoria = this.navParams.get('id_categoria');
    this.medico = this.navParams.get('medico');
    console.log(this.medico);
    // console.log(this.id_servicios + " " + this.nombre + " " +this.id_categoria);
    this.today = moment(new Date().toISOString()).format('YYYY-M-DD');
    
    

  }

  sacarCita(hora){
    
    
    let fecha = this.f + " " + hora;
    let f = moment(fecha).format('YYYY-MM-DD HH:mm:ss ');

    let today = moment(new Date().toISOString()).format('YYYY-M-DD HH:mm:ss');
    let today2 = moment(today);
    let st = moment(f);
    let hours = st.diff(today2, 'hours');

    // console.log(hours);
    
  
    if (hours < 0){
      this.presentToast("No se puede sacar la cita en un horario que ya paso. Por favor escoge otro horario");
    }else{
      
      let info = {start:hora, fecha:this.f, id_servicios:this.id_servicios, id_categoria:this.id_categoria};
      this.navCtrl.push(SacarCitaPage, {info:info});
    }


    
    
  }
  
      ionViewCanLeave(){
    
         let activeModal=this.app._modalPortal.getActive();
         
            if(activeModal){
             activeModal.dismiss();
             
         }
        }
 
  

       ionViewDidEnter() {
          this.horarios();
          this.obtenerEventos();
        }

        onMonthSelect(ev){
  
          let mes = ev.month + 1 ;
          this.api.getEventos(mes,ev.year,this.id_servicios,this.id_categoria).subscribe((res)=>{
            this.eve =res;
            this.currentEvents = this.eve;
          },(err)=>{
            console.log(err);
          });
        }

    obtenerEventos(){
      this.load = true;
    
    let anio = moment(this.today).format('YYYY');
    let mes =  moment(this.today).format('M')
      console.log(mes,anio,this.id_servicios);

    this.api.getEventos(mes,anio,this.id_servicios,this.id_categoria).subscribe((res)=>{
      this.eve =res;
      this.currentEvents = this.eve;
      console.log(this.currentEvents);
    //   for(let i = 0; i < this.eve.length; i++)
    // {
    //      let year = this.eve[i].year;
    //      let month = this.eve[i].month;
    //      let date = this.eve[i].date;

    //      this.currentEvents.push({year:year, month:month ,date:date});
    //   }
      this.load = false;
    },(err)=>{
      this.load = false;
      console.log(err);
    });






    // let anio = moment(this.today).format('YYYY');
    // let mes =  moment(this.today).format('M')
    // // console.log(mes,anio,this.id_servicios);

    // this.api.getEventos(mes,anio,this.id_servicios).subscribe((res)=>{
    //   this.eve =res;
      
    //   for(let i = 0; i < this.eve.length; i++)
    // {
    //      let year = this.eve[i].year;
    //      let month = this.eve[i].month;
    //      let date = this.eve[i].date;

    //      this.currentEvents.push({year:year, month:month ,date:date});
    //   }
    // },(err)=>{
    //   console.log(err);
    // });

    // return this.currentEvents;
 
  }



  toggleSection(i) {
    this.maniana[i].open = !this.maniana[i].open;
  }

  toggleSection2(i) {
    this.tarde[i].open = !this.tarde[i].open;
  }
 
  toggleItem(i, j) {
    this.maniana[i].children[j].open = !this.maniana[i].children[j].open;
  }

  onDaySelect(ev){
    

    let numero = parseInt(ev.month)+1;
    this.fecha = ev.year + "-" + numero + "-" +ev.date;
    // console.log("on day selet")
    // console.log(this.fecha);
     let today = new Date(this.today).getTime();
     let fecha = new Date(this.fecha).getTime();

      if(fecha >= today)
      {
        this.hr=false;
      }else{
        this.hr=true;
      }

      this.horarios();

  }

  horarios(){
    this.load = true;
    if(!this.fecha)
    {
      this.f = this.today;
      this.api.getCitasMedico(this.f,this.id_servicios,this.id_categoria).subscribe((data)=>{
        console.log(data);
        this.information = data;
        console.log(this.information);

        let ma = this.information[0];
        ma = ma.maniana;
        this.maniana = ma;
  
        let ta = this.information[1];
        ta = ta.tardes;
        this.tarde = ta;

        this.load = false;
      },(err)=>{
        this.load = false;
        this.presentToast("Error en la conexión, intentalo más tarde.");
        // console.log(err);
      });
    }else{
      this.f = this.fecha;
      this.api.getCitasMedico(this.f,this.id_servicios,this.id_categoria).subscribe((data)=>{
        console.log(data);
        this.information = data;
        console.log(this.information);

        let ma = this.information[0];
        ma = ma.maniana;
        this.maniana = ma;
       

        let ta = this.information[1];
        ta = ta.tardes;
        this.tarde = ta;
        this.load = false;
      },(err)=>{
        this.load = false;
        this.presentToast("Error en la conexión, intentalo más tarde.");
        // console.log(err);
      });
    }
  }

  verCita(info){

    // console.log(info);

    let modal = this.modalCtrl.create(ModalCitaPage,{info:info, categoria:this.id_categoria});
        modal.present();
 
        modal.onDidDismiss((data)=>{
            this.horarios();
            this.obtenerEventos();
            
        });
    
  }

 
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

   // eliminar(idEvent){

    

  //   let alert = this.alertCtrl.create({
  //     title: 'Confirmación',
  //     message: '¿Estas seguro que deseas eliminar esta cita?',
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //         handler: () => {
            
  //         }
  //       },
  //       {
  //         text: 'Confirmar',
  //         handler: () => {
            
  //           this.api.dltCitaProvedor(idEvent,this.global.id_usuario).then((data)=>{
  //             // console.log(data);
  //             let a = data;
  //             a = a[0].borrado;
  //             // console.log(a);
  //             if (a === true){
  //               this.presentToast("Su cita fue eliminada con exito");
  //               this.horarios();
  //             }

  //           },(err)=>{
  //             // console.log(err);
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }
  

 

}
