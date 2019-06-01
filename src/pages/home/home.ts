import { Component, ViewChild } from '@angular/core';
import { NavController, Slides,NavParams,ToastController,Loading,
  LoadingController, MenuController } from 'ionic-angular';
import { CitasPage } from '../citas/citas';
import {Global} from '../../app/global';
import { Storage } from '@ionic/storage';
import {ApiProvider} from '../../providers/api/api';
import {ListadoPublicacionesPage} from '../listado-publicaciones/listado-publicaciones';
import {ServiciosPage} from '../servicios/servicios'
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { BlancoPage } from '../blanco/blanco';
import { AlertController } from 'ionic-angular';
import { UserPage } from '../user/user';

 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

// @ViewChild(Slides) slides: Slides;




esAdmin:any;
id_usuario:string;
imgUser:string;
userName:string;
user:any;
public mncps;
public mncpSelect;
public dptmSelect;
public dptms;
public cateSelect;
public ctgas;
public split;
// busqueda:string="";
provedor;
usuario;
foto;
nombre;
info;
loading: Loading;
nombres;
token;
calificacion:any;
servicio=[];
topics;
admin;
val;
facebook;
slideData = [{ image: "/assets/imgs/slider/banner1a.png" },
{ image: "/assets/imgs/slider/banner3a.png" },
{ image: "/assets/imgs/slider/porquenosprefieren.png" }]
load;




// slideChanged() {
//     let currentIndex = this.slides.getActiveIndex();
//     console.log('Current index is', currentIndex);
//   }

  

  constructor(public navCtrl: NavController,public global:Global, public navParams:NavParams, private api:ApiProvider,
    private toastCtrl:ToastController,public loadingCtrl: LoadingController,private push: Push, private alertCtrl: AlertController,
    public menu: MenuController) {

    // this.api.getTopics(this.global.id_usuario).subscribe((data)=>{
    //   console.log(data);
    // },(err)=>{
    //   console.log(err);
    // });

  }
  ionViewDidEnter() {
    this.inicio();
    // this.goToSlide();
}

  inicio(){

    this.id_usuario = localStorage.getItem("id");
    this.esAdmin = localStorage.getItem("admin");
    this.global.id_usuario = this.id_usuario;
    this.global.login = true;
    // console.log (this.esAdmin);
    
    if(this.esAdmin == 1)
    {
    //  console.log("Entro aquiii! admin")
     this.global.admin=true;
     this.global.medico=false;
     this.datosProvedor();
    }
    else if (this.esAdmin == 2){
      // console.log("Entro aquiii! user , facebook")
     this.global.admin=false;
     this.global.medico=false;
     this.datosUser(); 
    }
    else if (this.esAdmin == 3) {
      // console.log("es medico");
      
      this.global.admin = false;
      this.global.medico = true;
      this.datosMedico();
    }
    
    // else if(this.esAdmin == "false"){
    //   console.log("Entro aquiii! user")
    //  this.global.admin=false;
    //  this.global.medico=false;
    //  this.datosUser();   
    // }
    
    
  // console.log("APPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP!")
  // console.log(this.global);
  }

  adminServs(){
    this.navCtrl.push(ListadoPublicacionesPage);
  }

  departamentos(){
    this.api.getDepartamento()
  	.subscribe(
    (data)=>{
    this.dptms=data;
    // console.log(this.dptms)
  },
  	(error)=>{
      // console.log(error);
    })
  }

  departamentoSelect(selectedValue: any){
    this.dptmSelect = selectedValue;
    // console.log(selectedValue);
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando municipios... ",
    // });
    // this.loading.present();

    this.load = true;
    this.menu.enable(false);

    this.api.getMunicipio(selectedValue).subscribe((data)=>{
      
      this.mncps = data;
      // this.loading.dismiss();
      this.mncpSelect = null;
      this.menu.enable(true);
      this.load = false;
      
      // console.log(data);
    },
    (error)=>{
      // this.loading.dismiss();
      this.menu.enable(true);
      this.load = false;
      this.presentToast("Error en la conexion, intentalo mas tarde");
    });
  }

  municipioSelect(selectedValue: any){
    this.mncpSelect = selectedValue;
    // console.log(this.mncpSelect);
  }


  ionViewDidLoad() {
    this.departamentos();
    // this.categorias();
  }

  misCitas()
  {
  	this.navCtrl.push(CitasPage);
  }

  buscar(bol){


    if(!bol){

      if(!this.mncpSelect){
        this.presentToast("Selecciona Departamento y Municipio");
    }else{
      // busqueda:this.busqueda,
      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos cargando información... ",
      // });
      // this.loading.present();

      this.load = true;
      this.menu.enable(false);
      this.calificacion=[];
      this.api.getBusqueda(this.mncpSelect,0).subscribe((data)=>{
        console.log(data);
        let a = data[0];
        this.calificacion= data;

        if(a.vacio === true){
          this.load = false;
          this.menu.enable(true);
          this.navCtrl.push(ServiciosPage,{servicios:data,vacio:true});
          
        }else{
          this.servicio = [];
          
          for(var i = 0; i < this.calificacion.length ; i++){
            
            let categoria =this.calificacion[i].categoria;
            let createdAt=this.calificacion[i].createdAt;
            let createdupdate = this.calificacion[i].createdupdate;
            let descripcion = this.calificacion[i].descripcion;
            let descuento = this.calificacion[i].descuento;
            let direccion = this.calificacion[i].direccion;
            let duracion = this.calificacion[i].duracion;
            let foto = this.calificacion[i].foto;
            let fotos = this.calificacion[i].fotos;
            let id_categoria = this.calificacion[i].id_categoria;
            let id_provedores = this.calificacion[i].id_provedores;
            let id_servicios = this.calificacion[i].id_servicios;
            let locked = this.calificacion[i].locked;
            let max_citas_ves = this.calificacion[i].max_citas_ves;
            let municipio_id_municipio = this.calificacion[i].municipio_id_municipio;
            let nombre = this.calificacion[i].nombre;
            let medico_id = this.calificacion[i].medico_id;
            let precio = this.calificacion[i].precio;
            let precio_cliente_prevenir = this.calificacion[i].precio_cliente_prevenir;
            let promedio = this.calificacion[i].promedio;
            let video = this.calificacion[i].video;
            let coment = this.calificacion[i].coment;

            var estrellasAmarillas = [];
            for(let j = 0; j < promedio;j++){
              let id = "amarilla";
              estrellasAmarillas.push({id:id});
            }

            let resultado = 5 - promedio;
            if(resultado >= 1){
              var estrellasGrises = [];
              for(let h = 0; h < resultado ; h++){
                let id = "gris";
                estrellasGrises.push({id:id});
              }
            }
          

              this.servicio.push({medico_id:medico_id, categoria:categoria, createdAt:createdAt, createdupdate:createdupdate, descripcion:descripcion,descuento:descuento,
              direccion:direccion,duracion:duracion,foto:foto, fotos:fotos, id_categoria:id_categoria, id_provedores:id_provedores,id_servicios:id_servicios,
              locked:locked, max_citas_ves:max_citas_ves, municipio_id_municipio:municipio_id_municipio, nombre:nombre, precio:precio,
              precio_cliente_prevenir:precio_cliente_prevenir,promedio:promedio, video:video, estrellasAmarillas:estrellasAmarillas,estrellasGrises:estrellasGrises, coment : coment });


          }

          // this.loading.dismiss();
          this.load = false;
          this.menu.enable(true);

          // console.log(this.servicio);
          this.navCtrl.push(ServiciosPage,{servicios:this.servicio, vacio:false});
          
        }
        
      },(err)=>{
        // this.loading.dismiss();
        this.load = false;
        this.menu.enable(true);
        this.presentToast("Error en la conexión, intentalo más tarde");
        // console.log(err);
      });

    }
    
    }else{

      if(!this.mncpSelect){
        this.presentToast("Selecciona Departamento y Municipio");
    }
    else{
      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos cargando información... ",
      // });
      // this.loading.present();

      this.load = true;
      this.menu.enable(false);

      this.api.getBusqueda(this.mncpSelect,20).subscribe((data)=>{
        this.calificacion = data;
        console.log(data);
        let a = data[0];
        if(a.vacio === true){
          // this.loading.dismiss();
          this.load = false;
          this.menu.enable(true);
          this.navCtrl.push(ServiciosPage,{servicios:data,vacio:true, mascota:true});
          
        }else{

          this.servicio = [];
          
          for(var i = 0; i < this.calificacion.length ; i++){
            
            let categoria =this.calificacion[i].categoria;
            let createdAt=this.calificacion[i].createdAt;
            let createdupdate = this.calificacion[i].createdupdate;
            let descripcion = this.calificacion[i].descripcion;
            let descuento = this.calificacion[i].descuento;
            let direccion = this.calificacion[i].direccion;
            let duracion = this.calificacion[i].duracion;
            let foto = this.calificacion[i].foto;
            let fotos = this.calificacion[i].fotos;
            let id_categoria = this.calificacion[i].id_categoria;
            let id_provedores = this.calificacion[i].id_provedores;
            let id_servicios = this.calificacion[i].id_servicios;
            let locked = this.calificacion[i].locked;
            let max_citas_ves = this.calificacion[i].max_citas_ves;
            let municipio_id_municipio = this.calificacion[i].municipio_id_municipio;
            let nombre = this.calificacion[i].nombre;
            let precio = this.calificacion[i].precio;
            let precio_cliente_prevenir = this.calificacion[i].precio_cliente_prevenir;
            let promedio = this.calificacion[i].promedio;
            let medico_id = this.calificacion[i].medico_id;
            let video = this.calificacion[i].video;
            let coment = this.calificacion[i].coment;
            var estrellasAmarillas = [];
            for(let j = 0; j < promedio;j++){
              let id = "amarilla";
              estrellasAmarillas.push({id:id});
            }

            let resultado = 5 - promedio;
            if(resultado >= 1){
              var estrellasGrises = [];
              for(let h = 0; h < resultado ; h++){
                let id = "gris";
                estrellasGrises.push({id:id});
              }
            }
          

           this.servicio.push({medico_id:medico_id, categoria:categoria, createdAt:createdAt, createdupdate:createdupdate, descripcion:descripcion,descuento:descuento,
              direccion:direccion,duracion:duracion,foto:foto, fotos:fotos, id_categoria:id_categoria, id_provedores:id_provedores,id_servicios:id_servicios,
              locked:locked, max_citas_ves:max_citas_ves, municipio_id_municipio:municipio_id_municipio, nombre:nombre, precio:precio,
              precio_cliente_prevenir:precio_cliente_prevenir,promedio:promedio, video:video, estrellasAmarillas:estrellasAmarillas,estrellasGrises:estrellasGrises, coment : coment });


          }


          // this.loading.dismiss();
          this.load = false;
          this.menu.enable(true);
          // console.log(this.servicio);

          this.navCtrl.push(ServiciosPage,{servicios:this.servicio, vacio:false , mascota:true});
          
        }
        
      },(err)=>{
        // this.loading.dismiss();
        this.load = false;
        this.menu.enable(true);
        this.presentToast("Error en la conexión, intentalo más tarde");
        // console.log(err);
      });
     }
     
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  datosUser(){

    // console.log(this.global.id_usuario);
    this.api.getUser(this.global.id_usuario).subscribe((data)=>{
      // console.log("data!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      console.log(data);
      this.usuario = data[0];
      this.global.infoPerfil = this.usuario;
  
      this.info = this.global.infoPerfil;
      this.foto = this.info.avatar;
      this.nombre = this.info.nombre;
      this.nombres = this.info.nombre + " " + this.info.apellidos;
      this.global.foto = this.foto;
      this.global.nombre = this.nombre;
      this.global.nombre = this.nombres;

      this.phs('user');
      this.locked('user');
  
      console.log(this.global);
    },(err)=> {
      // console.log(err)
    });
  }

  datosMedico(){
    
    this.api.getInfoMedico(this.global.id_usuario).subscribe((data)=>{
 

      this.usuario = data[0];
      this.global.infoPerfil = this.usuario;
  
      this.info = this.global.infoPerfil;
      this.foto = this.info.avatar;
      this.nombre = this.info.nombre;
      this.nombres = this.info.nombres + " " + this.info.apellidos;
      this.global.foto = this.foto;
      this.global.nombre = this.nombre;
      this.global.nombre = this.nombres;
      console.log(this.global);

      this.phs('medico');
      this.locked('medico');
    },(err)=>{
      console.log(err);
    });
  }

  
  
  datosProvedor(){
    // console.log(this.global.id_usuario);
    // console.log("aquii 1");

    
    this.api.getProovedor(this.global.id_usuario).subscribe((data)=>{
      // console.log("aquii 2");
      // console.log(data);


      this.provedor = data;
      this.global.infoPerfil = this.provedor;
      
      this.info = this.global.infoPerfil;
      this.foto = this.global.apiUrl+this.info.avatar;
      this.nombre = this.info.nombre;
      this.nombres = this.info.nombre + " " + this.info.apellidos;
      this.global.foto = this.foto;
      this.global.nombre = this.nombre;
      // this.global.nombres = this.nombres;

      console.log(this.global);

      this.phs('admin');
      this.locked('admin');
    
    },(err)=>{
      // console.log(err)
    });

    // console.log("aquii 3");
  }

  locked(user){
    console.log('aqui', this.global.id_usuario);
    this.api.getConfirmacionCuenta(this.global.id_usuario).subscribe((data)=>{
      console.log('aqui locked');
      console.log(data);
      if(data === false){
        this.navCtrl.setRoot(BlancoPage, {locked:true});
      }else{

        if(user == 'user'){
          // console.log("Aquii");
          this.validacion();
        }
         
      }
    },(err)=>{
      console.log(err);
    });
  }

  validacion(){
    // console.log(this.global.id_usuario);
    // this.loading = this.loadingCtrl.create({
    //     spinner: 'hide',
    //     content: "Espera un momento ... ",
    //   });
    //   this.loading.present();

    this.load = true;
    this.menu.enable(false);


    this.api.getValidacion(this.global.id_usuario).subscribe((data)=>{
      // this.loading.dismiss();
      this.load = false;
      this.menu.enable(true);
      this.val = data;
      if(this.val.datos === false ){

        let alert = this.alertCtrl.create({
          title: 'Información',
          message: 'Para sacar una cita debes completar la información de tu perfil en "Menú > Mi cuenta", <br> ¿ Deseas completarla ahora ?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                // console.log('Cancel clicked');
              }
            },
            {
              text: 'Aceptar',
              handler: () => {
                this.navCtrl.push(UserPage);
              }
            }
          ]
        });
        alert.present();
        
      }
      
    },(err)=>{
      this.load = false;
      this.menu.enable(true);
      this.presentToast("Error en la conexión, intentalo más tarde o revisa tu conexión");
      // this.loading.dismiss();
    });
  }


  phs(rol){
    // console.log("rol",rol);
    var tp 
    if(rol == 'admin'){
     tp = 'provedor';
    //  console.log(this.info.topics);
    //  var tps = [];
    //  for(let i = 0; i < this.info.topics.length ; i++){

    //   let tp = this.info.topics[i];
    //   tps.push({tp})
      
    //  }

    //  console.log(tps[0].tp,tps[2].tp);

    }else if(rol == 'user'){
      tp = 'user'
    }else{
      tp='medico'
      console.log("medico")
   
    }

    // console.log(tp);

     // topics: ['global','admin','user'],
  
      const options: PushOptions = {
        android: {
          senderID: '777283957904',
          sound: 'true',
          vibrate: 'true',
          topics: [tp],
   
        },
        ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
        },
        
     };
     
     const pushObject: PushObject = this.push.init(options);
     
     
     pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
     
     pushObject.on('registration').subscribe((registration: any) => 

     this.api.obtenerToken(registration).then((res)=>{console.log(res)},(err)=>{
      //  console.log(err);
     })
     );
     
    //  console.log(this.token.registrationId);

    //  console.log('Device registered', registration)
     
     
     pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  
  }

}

 // miles(numero){
  //       var num = numero.replace(/\./g,"");
  //       if(!isNaN(num)){
  //       num = num.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g,'$1.');
  //       num = num.split("").reverse().join("").replace(/^[\.]/, "");
  //       console.log(num);
  //       }

  //       // else{ alert("Solo se permiten numeros");
  //       // input.value = input.value.replace(/[^\d\.]*/g,"");
  //       // }
  // }

   // categorias(){
  
  //   this.api.getCategorias()
  // 	.subscribe(
  //   (data)=>{this.ctgas=data;
     
  //   // console.log(this.ctgas)
  // },
  // 	(error)=>{
  //     this.loading.dismiss();
  //     // console.log(error);
  //   })
  // }

  // categoriaSelect(selectedValue: any){
  //   this.cateSelect = selectedValue;
  //   // console.log(this.cateSelect);
  // }

