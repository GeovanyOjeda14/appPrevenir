import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController,Loading,
  LoadingController, MenuController } from 'ionic-angular';
import * as moment from 'moment';
import { ApiProvider } from "../../providers/api/api";
import {Global} from '../../app/global';
import {HomePage} from '../home/home';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { CalendarModule } from 'ionic3-calendar-en';

/**
 * Generated class for the SacarCitaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sacar-cita',
  templateUrl: 'sacar-cita.html',
})
export class SacarCitaPage {
  fecha;
  today;
  maniana;
  tarde;
  hr:boolean = false;
  ds:boolean = false;
  mn:boolean;
  td:boolean;
  id_servicio;
  id_usuario;
  f;
  val;
  beneficiarios;
  info=[];
  mascota;
  mascotas;
  id_categoria;
  loading: Loading;
  datos : FormGroup;
  datosMascota : FormGroup;
  datosMascotaNueva : FormGroup;
  citaProvedor;
  read:boolean=false;
  infoCitas;
  fechaNacimiento;
  form:boolean;
  form2:boolean;
  cedula;
  mascotaForm:boolean;
  mascotaForm2:boolean;
  mascotaForm3:boolean;
  esterilizadoMascota;
  sexoMascota;
  id_mascota;
  numeroMascotas:boolean;
  load;
  
 
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private api : ApiProvider,private formBuilder: FormBuilder,
    private global : Global,private alertCtrl: AlertController,private toastCtrl:ToastController, public loadingCtrl: LoadingController,
    public menu: MenuController, public calendar: CalendarModule) {

    this.id_usuario= this.global.id_usuario;
    this.id_usuario = parseInt(this.id_usuario);
    this.id_servicio = this.navParams.get('id_servicio');
    this.mascota = this.navParams.get('mascota');
    this.id_categoria = this.navParams.get('id_categoria'); 
    this.citaProvedor = this.navParams.get('info');
    // console.log(this.id_categoria);

    // console.log(this.citaProvedor.id_categoria);

    if(!this.citaProvedor){
      if (this.id_categoria == 20){

        this.validacion();
        this.obtenerMascotas();
    }else{

        this.validacion();
        this.obtenerBeneficiarios();
    
      }
    }else{
      this.formularioCitas();
    }

    this.today = moment(new Date().toISOString()).format('YYYY-M-DD');
    this.horarios();     
  }

  

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SacarCitaPage');
    
    
  }

  ionViewWillLeave(){
    this.info=[];
    this.read=true;
  }

  obtenerBeneficiarios(){

    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando información... ",
    // });
    // this.loading.present();

    this.load = true;
    this.menu.enable(false);
    
    this.api.getBeneficiarios(this.id_usuario).subscribe((data)=>{
      this.beneficiarios = data;

      this.info.push({type:'radio', label : this.global.nombre , value : this.id_usuario , checked : true});
      for(let i = 0; i < this.beneficiarios.length; i++){
   
        let nombres = this.beneficiarios[i].nombre + " " + this.beneficiarios[i].apellidos;
        let id = this.beneficiarios[i].id;
        
        
        this.info.push({type:'radio', label : nombres , value : id , checked : false});
      }

      // this.loading.dismiss();
      this.load = false;
      // this.menu.enable(true);


      // console.log(this.info);
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      // this.menu.enable(true);
      this.presentToast("Error en la conexion, intentalo mas tarde");
    });
  }

  obtenerMascotas(){

    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando información... ",
    // });
    // this.loading.present();
    this.load = true;
    this.menu.enable(false);

    this.api.getMascotasUser(this.id_usuario).subscribe((data)=>{
      this.mascotas = data;
      // console.log(this.mascotas);

      for(let i = 0; i < this.mascotas.length; i++){
   
        let nombres = this.mascotas[i].nombre;
        let id = this.mascotas[i].id_mascotas;
        
        
        this.info.push({type:'radio', label : nombres , value : id , checked : false});
      }

      // console.log(this.info);
      // this.loading.dismiss();
      this.load = false;
      // this.menu.enable(true);

     },(err)=>{
      //  this.loading.dismiss();
      this.load = false;
      // this.menu.enable(true);
      this.presentToast("Error en la conexion, intentalo mas tarde");
     });

  }
 

  onDaySelect(ev)
  {
    // console.log(ev);

    let numero = parseInt(ev.month)+1;
    this.fecha = ev.year + "-" + numero + "-" +ev.date;

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
    if(!this.fecha)
    {
      this.f = this.today;
      this.api.getHorario(this.today,this.id_servicio,this.id_categoria).subscribe((data)=>{
        console.log(data);
        let hors= data[0];
        this.maniana = hors.maniana;
        let hors2 = data[1];
        this.tarde = hors2.tardes;
    
        let dis = this.maniana[0]
        let dispo = this.tarde[0];
        if(dis.disponible === false){
          this.mn = true;
        }
        else{
          this.mn = false;
        }

        if(dispo.disponible === false){
          this.td = true;
        }
        else 
        {
          this.td = false;
        }
      
      },(err)=>{
        // console.log(err);
      });
    }else{
      this.f = this.fecha;
      this.api.getHorario(this.fecha,this.id_servicio,this.id_categoria).subscribe((data)=>{
        console.log(data);
        let hors= data[0];
        this.maniana = hors.maniana;
        let hors2 = data[1];
        this.tarde = hors2.tardes;
        
       
        let dis = this.maniana[0];
        let dispo = this.tarde[0];
        if(dis.disponible === false){
          this.mn = true;
        }
        else{
          this.mn = false;
        }

        if(dispo.disponible === false){
          this.td = true;
        }
        else 
        {
          this.td = false;
        }

      },(err)=>{
        // console.log(err);
      });
    }

  }

  sacarCita(hora,tarde){
    
    let fe = moment(this.f).format('DD-M-YYYY');
    let alert = this.alertCtrl.create({
      subTitle:'¿Para quien deseas sacar la cita?',
      inputs:this.info,
      message: 'Estas seguro que deseas sacar una cita a las '+hora+" del "+fe+
      ". Ten en cuenta que solo podras cancelar la cita 24 horas antes de la fecha elegida.",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Aceptar',
          handler: (data) => {
          var id = data;

          if(!data){
            this.presentToast('Por favor elige una mascota o agrega una en "Menú > Beneficiarios"');
          }else{
            if(!tarde)
              {
                // console.log(this.val);
                if(this.val.datos === false){
                  this.presentToast('Por favor completa los datos de registro en  "Inicio > Menú > Mi cuenta" para reservar la cita');
                     }
                     else{

                let h = hora.split(':');
                h = h[0];
                h = h + ":00:00"
                let start = this.f + " " + h;
                let info = {color:"#07a9df" , start:start,usuario: id, servicio:this.id_servicio , mascota : this.mascota};
                console.log(info);

                let today = moment(new Date().toISOString()).format('YYYY-M-DD HH:mm:ss');
                let today2 = moment(today);
                let st = moment(start);
                let hours = st.diff(today2, 'hours');

                // console.log(start);
                // console.log(today);
              
                if (hours < 2){
                  this.presentToast("No se puede sacar una cita 2 horas antes. Por favor escoge otro horario");
                }
                else 
                {
                  // console.log(info);

                  // this.loading = this.loadingCtrl.create({
                  //   spinner: 'hide',
                  //   content: "Espera un momento<br>estamos agendando tu cita... ",
                  // });
                  // this.loading.present();
                  this.load = true;
                  // this.menu.enable(false);

                    this.api.guardarCita(info).then((data)=>{
                      
                      let a = data;
                      a = a[0].agregado;
                      let b = data;
                      b = b[0].reservado;
                      // console.log(data);
                      // this.loading.dismiss();
                      this.load = false;
                      // this.menu.enable(true);
                      
                      if(b === true ){
                        this.presentToast("Ya tienes asignada una cita para este dia, revisa mis citas");

                      }
      
                      if(a === true){
                        this.presentToast("Su cita fue reservada con exito, Revisa tu historial de citas");
                        this.navCtrl.setRoot(HomePage);
                      }

                },(err)=>{
                  // this.loading.dismiss();
                  this.load = false;
                  // this.menu.enable(true);
                  this.presentToast("Error en la conexion, intentalo mas tarde");
                });
                }

             
                 }



               }




          else{

            if(this.val.datos === false){
              this.presentToast('Por favor completa los datos de registro en  "Inicio > Menú > Mi cuenta" para reservar la cita');
                 }
            else{
               let h = hora.split(':');
               h = h[0];
               h=  parseInt(h)+12; 
               h = h + ":00:00"
               let start = this.f + " " + h;
               let info = {color:"#07a9df" , start:start,usuario:id,servicio:this.id_servicio , mascota : this.mascota};
               console.log(info);


               let today = moment(new Date().toISOString()).format('YYYY-M-DD HH:mm:ss');
               let today2 = moment(today);
               let st = moment(start);
               let hours = st.diff(today2, 'hours');
              //  console.log(hours);
               if (hours < 2){
                 this.presentToast("No se puede sacar una cita 2 horas antes. Por favor escoge otro horario");
               }
               else{

                //  this.loading = this.loadingCtrl.create({
                //     spinner: 'hide',
                //     content: "Espera un momento<br>estamos agendando tu cita... ",
                //   });
                //   this.loading.present();
                this.load = true;
                // this.menu.enable(false);

                this.api.guardarCita(info).then((data)=>{
                let a = data;
                a = a[0].agregado;
                let b = data;
                b = b[0].reservado;
                // console.log(data);
                // this.loading.dismiss();
                this.load = false;
                // this.menu.enable(true);
                
                if(b === true ){
                  this.presentToast("Ya tienes asignada una cita para este dia, revisa mis citas");
                }

                if(a === true){
                  this.presentToast("Su cita fue agregada con exito, Revisa tu historial de citas");
                  this.navCtrl.setRoot(HomePage);
                }
                
                
               },(err)=>{
                //  this.loading.dismiss();
                this.load = false;
                // this.menu.enable(true);
                this.presentToast("Error en la conexion, intentalo mas tarde");
               });
               }
              }
           }
          }
        }
        }
      ]
    });
    alert.present();
  }

  validacion(){
    // console.log(this.global.id_usuario);
    this.api.getValidacion(this.global.id_usuario).subscribe((data)=>{
      this.val = data;
      
    },(err)=>{
      // console.log(err)
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  //////////////////////////////////////////SACAR CITA PROVEDOR ///////////////////////////////////////

  sacarCitaProvedor(bol){

    // let fecha = ;

     

      if(bol === true){ 


        // this.loading = this.loadingCtrl.create({
        //   spinner: 'hide',
        //   content: "Espera un momento<br>estamos agendando tu cita... ",
        // });
        // this.loading.present();

        this.load = true;
        // this.menu.enable(false);
  
        let fecha = this.citaProvedor.fecha + " " + this.citaProvedor.start;
        console.log(fecha);
    
        let info = {color:"#07a9df",start:fecha, mascota:undefined, servicio:this.citaProvedor.id_servicios,existe:bol, usuario:this.infoCitas.id };
        console.log(info);
    
        this.api.postCitasProvedor(info).then((res)=>{
          console.log(res);
          var agregado = res[0];
          if(agregado.agregado === true){
            this.presentToast("Cita agregada con exito");
            // this.loading.dismiss();
            this.load = false;
            // this.menu.enable(true);
            this.navCtrl.pop();
          }else{
            this.presentToast("No se pudo agregar la cita, por favor intentalo más tarde");
            // this.loading.dismiss();
            this.load = false;
            // this.menu.enable(true);
            this.navCtrl.setRoot(HomePage);
          }
        },(err)=>{
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          this.navCtrl.setRoot(HomePage);
        });
  
      }else{
  
        if(!this.datos.value.fecha){
          this.presentToast("Por favor elige una fecha de nacimiento");
        }else{
  
          // this.loading = this.loadingCtrl.create({
          //   spinner: 'hide',
          //   content: "Espera un momento<br>estamos agendando tu cita... ",
          // });
          // this.loading.present();
          this.load = true;
          // this.menu.enable(false);
  
          let fecha = this.citaProvedor.fecha + " " + this.citaProvedor.start;
          console.log(fecha);
      
    
          let info = {color:"#07a9df",start:fecha, mascota:undefined, servicio:this.citaProvedor.id_servicios,existe:bol, usuario:this.datos.value.identificacion, nombres:this.datos.value.nombres,
          apellidos : this.datos.value.apellidos, fecha_nacimiento: this.datos.value.fecha, contacto:this.datos.value.contacto, correo:this.datos.value.correo };
          console.log(info);
          
  
          this.api.postCitasProvedor(info).then((res)=>{
  
            var agregado = res[0];
          if(agregado.agregado === true){
            this.presentToast("Cita agregada con exito");
            // this.loading.dismiss();
            this.load = false;
            // this.menu.enable(true);
            this.navCtrl.pop();
          }else{
            this.presentToast("No se pudo agregar la cita, por favor intentalo más tarde");
            // this.loading.dismiss();
            this.load = false;
            // this.menu.enable(true);
            this.navCtrl.setRoot(HomePage);
          }
  
  
          },(err)=>{
            // this.loading.dismiss();
            this.load = false;
            // this.menu.enable(true);
            this.navCtrl.setRoot(HomePage);
          });
        }
      
      }

  }

  buscarCedula(){


    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando información... ",
    // });
    // this.loading.present();
    this.load = true;
    // this.menu.enable(false);

    this.cedula =  this.datos.value.identificacion;


    if(this.citaProvedor.id_categoria == 20){

      if(!this.cedula){
        // this.loading.dismiss();
        this.load = false;
        // this.menu.enable(true);
        this.presentToast("Por favor llena el campo.");
      }else{
       

        this.api.cedula(this.cedula,true).subscribe((data)=>{
          console.log(data);
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          if(data === false){
            this.formularioMascotas();
            this.mascotaForm=true;
            this.read = true;
          }else{
            this.infoCitas = data[0];
            console.log(this.infoCitas);
            if(this.infoCitas.masc.length >= 8){
              this.numeroMascotas = false;
            }
            this.formularioMascotasExiste();
            this.mascotaForm2=true;
            this.read = true;
            
            
          }
        },(err)=>{
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          this.navCtrl.setRoot(HomePage);
        });
      }
    
    }else{

   if(!this.cedula){
    console.log(this.cedula);
    // this.loading.dismiss();
     this.load = false;
    //  this.menu.enable(true);
     this.presentToast("Por favor llena el campo.");

   }else{
     this.read = true;
     this.api.cedula(this.cedula,false).subscribe((data)=>{
       console.log(data);
      //  this.loading.dismiss();
      this.load = false;
      // this.menu.enable(true);
      if(data === false){
        this.form2=true;
        this.formularioCitas();
      }else{
        this.infoCitas = data[0];
        this.fechaNacimiento = this.infoCitas.fecha_nacimiento;
        this.fechaNacimiento = moment(this.fechaNacimiento).format('DD-M-YYYY');
        this.formularioCitasProvedor();
        this.form=true;
      }
    },(err)=>{
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          this.navCtrl.setRoot(HomePage);
    });
   }

    }

   
  }

  borrar(){
    
    if(this.citaProvedor.id_categoria == 20){

      if(this.mascotaForm === true){
        this.datos.reset();
        this.read= false;
        this.mascotaForm = false;
      }

      if(this.mascotaForm2 === true ){
        this.datosMascota.reset();
        this.read= false;
        this.mascotaForm2 = false;
        
      }

      if(this.mascotaForm3 === true){
        this.datosMascotaNueva.reset();
        this.read= false;
        this.mascotaForm3 = false;
      }

    }else{
      if(this.form === true){
        this.datos.reset();
        this.read= false;
        this.form = false;
      }
  
      if(this.form2 === true){
        this.datos.reset();
        this.read= false;
        this.form2 = false;
      }
    }
     

    

    
  }

  formularioCitasProvedor(){

   

    this.datos = this.formBuilder.group({

      nombres:[this.infoCitas.nombre,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      apellidos:[this.infoCitas.apellidos,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      fecha:[],
      fecha_nacimiento : [this.fechaNacimiento],
      identificacion : [this.infoCitas.cedula,[Validators.required , Validators.pattern('[0-9]*')]],
      contacto : [this.infoCitas.telefono,[Validators.required , Validators.pattern('[0-9]*')]],
      // correo : ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    });
  }

  formularioCitas(){

    this.datos = this.formBuilder.group({

      nombres:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      apellidos:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      fecha:[''],
      fecha_nacimiento : [''],
      identificacion : [this.cedula,[Validators.required , Validators.pattern('[0-9]*')]],
      contacto : ['',[Validators.required , Validators.pattern('[0-9]*')]],
      correo : ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    });
  }

  formularioMascotas(){

    this.datosMascota = this.formBuilder.group({

      nombres:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      apellidos:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      identificacion : [this.cedula,[Validators.required , Validators.pattern('[0-9]*')]],
      contacto : ['',[Validators.required , Validators.pattern('[0-9]*')]],
      nombreMascota:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      especie:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]], 
    });
  }

  formularioMascotasExiste(){
    this.datosMascota = this.formBuilder.group({

      nombres:[this.infoCitas.nombre,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      apellidos:[this.infoCitas.apellidos,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      identificacion : [this.infoCitas.cedula,[Validators.required , Validators.pattern('[0-9]*')]],
      contacto : [this.infoCitas.telefono,[Validators.required , Validators.pattern('[0-9]*')]],
      
    });
  }

  formularioMascotaNueva(){
    this.datosMascotaNueva = this.formBuilder.group({

      nombres:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      especie:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      raza:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      color:['',[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      fechaNacimiento:['',[Validators.required]]
    });
  }

  esterilizado(ev){
    // console.log(ev);
    this.esterilizadoMascota = ev;
  }

  sexo(ev){
    // console.log(ev);
    this.sexoMascota = ev;
  }

  sacarCitaProvedorMascota(bol){

       if(bol === true){
      
      if(!this.id_mascota){
        this.presentToast("Por favor selecciona una mascota.");
      }else{

        // this.loading = this.loadingCtrl.create({
        //   spinner: 'hide',
        //   content: "Espera un momento<br>estamos agendando tu cita... ",
        // });
        // this.loading.present();

        this.load = true;
        // this.menu.enable(false);
        

        let fecha = this.citaProvedor.fecha + " " + this.citaProvedor.start;
        // console.log(fecha);
    
  
        let info = {color:"#07a9df",start:fecha, mascota:true, servicio:this.citaProvedor.id_servicios,existe:bol, usuario:this.infoCitas.id, nombres:this.datosMascota.value.nombres,
        apellidos : this.datosMascota.value.apellidos, contacto:this.datosMascota.value.contacto, id_mascota:this.id_mascota, existem:true };
        console.log(info);

        this.api.postCitasProvedor(info).then((res)=>{
          console.log(res);
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          var agregado = res[0].agregado;
          if(agregado === true){
            this.presentToast("Cita agregada con exito");
            // this.loading.dismiss();
            this.load = false;
            // this.menu.enable(true);
            this.navCtrl.pop();
          }else{
            this.presentToast("No se pudo agregar la cita, por favor intentalo más tarde");
            // this.loading.dismiss();
            this.load = false;
            // this.menu.enable(true);
            this.navCtrl.setRoot(HomePage);
          }
        },(err)=>{
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          this.navCtrl.setRoot(HomePage);
        });

       
      }
    }else{

      if(!this.esterilizadoMascota){
        this.presentToast("Por favor seleccion el campo estetilizado.")
      }else if (!this.sexoMascota){
        this.presentToast("Por favor seleccion el campo sexo mascota.")
      }else{

      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos agendando tu cita... ",
      // });
      // this.loading.present();
      this.load = true;
      // this.menu.enable(false);
  
        
      let fecha = this.citaProvedor.fecha + " " + this.citaProvedor.start;

      let info = {color:"#07a9df",start:fecha, mascota:true, servicio:this.citaProvedor.id_servicios,existe:bol, usuario:this.datosMascota.value.identificacion, nombres:this.datosMascota.value.nombres,
      apellidos : this.datosMascota.value.apellidos, contacto:this.datosMascota.value.contacto, nombreMascota:this.datosMascota.value.nombreMascota, especie:this.datosMascota.value.especie,
      esterilizado:this.esterilizadoMascota , sexo : this.sexoMascota};

      console.log(info);

      this.api.postCitasProvedor(info).then((res)=>{
        console.log(res);
        var agregado = res[0].agregado;
        if(agregado === true){
          this.presentToast("Cita agregada con exito");
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          this.navCtrl.pop();
        }else{
          this.presentToast("No se pudo agregar la cita, por favor intentalo más tarde");
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          this.navCtrl.setRoot(HomePage);
        }
      },(err)=>{
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          this.navCtrl.setRoot(HomePage);
      });
      }

    }

    
  }

  citaMascotaNueva(){


  
      if(!this.datosMascotaNueva.value.fechaNacimiento){
        this.presentToast("Por favor selecciona una fecha de nacimiento.")
      }else{
  
        // this.loading = this.loadingCtrl.create({
        //   spinner: 'hide',
        //   content: "Espera un momento<br>estamos agendando tu cita... ",
        // });
        // this.loading.present();
        this.load = true;
        // this.menu.enable(false);
  
        let fecha = this.citaProvedor.fecha + " " + this.citaProvedor.start;
  
        let info = {color:"#07a9df",start:fecha, mascota:true, servicio:this.citaProvedor.id_servicios,existe:true, usuario:this.infoCitas.id, nombres:this.datosMascota.value.nombres,
        apellidos : this.datosMascota.value.apellidos, contacto:this.datosMascota.value.contacto, nombreMascota:this.datosMascotaNueva.value.nombres, especie:this.datosMascotaNueva.value.especie,
        esterilizado:this.esterilizadoMascota , sexo : this.sexoMascota,raza:this.datosMascotaNueva.value.raza, colorMascota:this.datosMascotaNueva.value.color,
        fecha_nacimiento : this.datosMascotaNueva.value.fechaNacimiento, existem:false };
  
        console.log(info);
  
        this.api.postCitasProvedor(info).then((res)=>{
          console.log(res);
          var agregado = res[0].agregado;
          if(agregado === true){
            this.presentToast("Cita agregada con exito");
            // this.loading.dismiss();
            this.load = false;
            // this.menu.enable(true);
            this.navCtrl.pop();
          }else{
            this.presentToast("No se pudo agregar la cita, por favor intentalo más tarde");
            // this.loading.dismiss();
            this.load = false;
            // this.menu.enable(true);
            this.navCtrl.setRoot(HomePage);
          }
        },(err)=>{
          // this.loading.dismiss();
          this.load = false;
          // this.menu.enable(true);
          this.navCtrl.setRoot(HomePage);
        });


    }


   
        
    
    
  }

  mascotaSelect(ev){
    console.log(ev);
   if(ev != "nueva"){
    this.mascotaForm3 = false;
    this.id_mascota = ev;
   }else{

    if(this.numeroMascotas === false){
      this.presentToast("Ya tienes 8 mascotas, no puedes agregar más");
    }else{
      this.mascotaForm3 = true;
    this.formularioMascotaNueva();
    }
   }
  }

}
