import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,Loading,
  LoadingController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Global} from '../../app/global';
import {ApiProvider} from '../../providers/api/api';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { HomePage } from '../home/home';
import { PhotoViewer } from '@ionic-native/photo-viewer';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  base64Image:string;
  infoUser;
  foto;
  usuario = {};
  nombre;
  apellidos;
  identificacion;
  direccion;
  telefono;
  whats;
  fechaNacimiento:boolean;
  private datosAdmin : FormGroup;
  private datosUser : FormGroup;
  private datosMedico : FormGroup;
  res;
  paises;
  loading: Loading;
  public anArray:any=[];
  public anArray2:any=[];
  public anArray3:any=[];
  public anArray4:any=[];
  diploma;
  estudiosBol:boolean=false;
  titulos=[];
  eliminarFormEstudios:boolean=false;
  rs;
  mncps;
  dptms;
  mncpSelect;
  dptmSelect;
  posisionDtp;
  posisionMnp;
  load;

  
  constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera, 
    private global : Global, private api:ApiProvider, private formBuilder: FormBuilder,private toastCtrl:ToastController,
    public loadingCtrl: LoadingController,private crop: Crop,private base64: Base64, private photoViewer: PhotoViewer) {
      this.inicio();
   
  }

  inicio(){

    if (this.global.admin === false && this.global.medico === false)
   {
    /////////////////////////////////Usuario///////////////////////////////////////////////////
    // console.log("USERRRRRRRRRRR")
    
    this.infoUser = this.global.infoPerfil;
    this.foto = this.infoUser.avatar;
    this.departamentos();
    
    
    if(!this.infoUser.fecha_nacimiento){
      // console.log("AQUII");
      this.fechaNacimiento = false;
    }else{
      // console.log("ACAAA");
      this.fechaNacimiento = true;
      var ff = moment(this.infoUser.fecha_nacimiento ).format('DD-M-YYYY');
      
    }
   
    console.log(this.infoUser);
    
    this.datosUser = this.formBuilder.group({

      email: [this.infoUser.correo, [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      nombres: [this.infoUser.nombre, [Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
      apellidos: [this.infoUser.apellidos, [Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
      identificacion : [this.infoUser.cedula,[Validators.required , Validators.pattern('[0-9]*')]],
      direccion : [this.infoUser.direccion],
      telefono : [this.infoUser.telefono,[Validators.required,Validators.pattern('[0-9]*')]],
      whats : [this.infoUser.telefonowatshapp],
      fecha : [''],
      fecha2 : [ff],
   

    });

   }
   else if (this.global.admin === true && this.global.medico === false) {
    this.infoUser = this.global.infoPerfil;
    this.foto = this.global.apiUrl+this.infoUser.avatar;

    this.datosAdmin = this.formBuilder.group({

      email: [this.infoUser.correo, [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      nombres: [this.infoUser.nombre, [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
      nit : [this.infoUser.nit,[Validators.required,Validators.pattern('[0-9]*')]],
      direccion : [this.infoUser.direccion,[Validators.required]],
      telefono : [this.infoUser.telefono, [Validators.required,Validators.pattern('[0-9]*') ]],
      whats : [this.infoUser.telefonowatshapp,[Validators.pattern('[0-9]*')]],
      descripcion : [this.infoUser.descripcion,[Validators.required,Validators.minLength(40)]],
      // decrip : ['',[Validators.required, Validators.minLength(40)]],
      web : ['',[Validators.pattern('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')]],
      youtube : ['',[Validators.pattern('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?')]],
      
   

    });
   }else{

    this.infoUser = this.global.infoPerfil;

    if(this.infoUser.titulos.length >= 1){

      for(let i = 0; i < this.infoUser.titulos.length; i++){

        let nombre = this.infoUser.titulos[i].nombre;
        let institucion =  this.infoUser.titulos[i].institucion;
        let start =  this.infoUser.titulos[i].start;
        start = moment(start).format('DD-M-YYYY');
        let end =  this.infoUser.titulos[i].end;
        end = moment(end).format('DD-M-YYYY');
 
        this.titulos.push({nombre,institucion,start,end});
     }
 
    //  console.log(this.titulos);
    
     this.estudiosBol = true;

    }

    this.foto = this.infoUser.avatar;

    // console.log(this.infoUser);

    this.datosMedico = this.formBuilder.group({

      nombres:[this.infoUser.nombres,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      apellidos:[this.infoUser.apellidos,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      email: [this.infoUser.email, [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      cedula:[this.infoUser.cedula,[Validators.required,Validators.pattern('[0-9]*')]],
      tarjetaProfecional:[this.infoUser.tarj_profecional,[Validators.required,Validators.pattern('[0-9]*')]],
      especialidad:[this.infoUser.titulo,[Validators.required,Validators.minLength(2), Validators.maxLength(50)]],
      whats:[this.infoUser.whatsapp,[Validators.pattern('[0-9]*')]],
      telefono:[this.infoUser.telefono,[Validators.pattern('[0-9]*')]]

      
    });

    
     
   }
  
  }

  ionViewDidLoad() {
    this.pais();
  }

  // goTo(){
  //   console.log('this.anArray',this.anArray);
  //   console.log('this.anArray',this.anArray2);
  //   console.log('this.anArray',this.anArray3);
  //   console.log('this.anArray',this.anArray4);
  
  //   }

  Add(){

    this.estudiosBol = true;
    this.eliminarFormEstudios = true;

    this.anArray.push({'value':''});
    this.anArray2.push({'value':''});
    this.anArray3.push({'value':''});
    this.anArray4.push({'value':''});

    }

    Delete(){

      if(this.anArray.length <=0){
        this.eliminarFormEstudios = false;
      }else{
        this.anArray.pop();
        this.anArray2.pop();
        this.anArray3.pop();
        this.anArray4.pop();

        if(this.anArray.length <=0){
          this.eliminarFormEstudios = false;
        }
      }

    
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
      // this.loading.dismiss();
      this.load = false;
      this.base64Image = base64Data;
      this.base64Image = this.base64Image.replace("*","jpeg");
      

      // console.log("IMAGENNNNNNNNNNNNNNNNN");
      // console.log(this.base64Image);
      // console.log("IMAGENNNNNNNNNNNNNNNNN");
      
		}).catch(err => {
      // this.loading.dismiss();
      this.load = false;
			// console.log(err)
    });
  }

  verImg(foto){
    this.photoViewer.show(foto, '', {share: false});
  }

 
  event(ev){
    // console.log(ev);
  }
  datosUsr(){
    
    // console.log(this.fechaNacimiento);
    if(this.fechaNacimiento === false){

    //  console.log("Aqui");
      var fecha1 = moment(this.datosUser.value.fecha); //fecha de nacimiento
      console.log(fecha1);
      var today = moment(new Date().toISOString()).format('YYYY-M-DD');
      var fecha2 = moment(today);  //fecha actual
      var years = fecha2.diff(fecha1, 'years');
      
      if(!this.datosUser.valid)
      {
        this.presentToast("Por favor completa los campos requeridos")
      }
      else if(!this.datosUser.value.fecha){
        this.presentToast("Por favor selecciona una fecha de nacimiento");
        this.inicio();
      }else if(!this.mncpSelect){
        this.presentToast("Por favor selecciona un departamento y municipio.")
      }
      else if(years < 18){
        this.presentToast("Para sacar una cita debes ser mayor de 18 años, vuelve más tarde");
        this.inicio()
      }else{
        // this.loading = this.loadingCtrl.create({
        //   spinner: 'hide',
        //   content: "Espera un momento<br>estamos procesando la información... ",
        // });
        // this.loading.present();
        this.load = true;
        
        let datos={cedula:this.datosUser.value.identificacion , nombre:this.datosUser.value.nombres, apellidos:this.datosUser.value.apellidos,
          direccion:this.datosUser.value.direccion, telefono:this.datosUser.value.telefono, telefonowatshapp: this.datosUser.value.whats,
          fecha_nacimiento:this.datosUser.value.fecha, id:this.global.id_usuario, id_municipio : this.mncpSelect}
            // console.log(datos);


          this.api.editUser(datos).then((data)=>{
            this.res = data;
            if(this.res.update === true){
              this.presentToast("Datos actualizados con exito");
              // this.loading.dismiss();
              this.load = false;
              this.navCtrl.pop();
            }else{
              // this.loading.dismiss();
              this.load = false;
              this.presentToast("Por favor llena los datos requeridos");
            }
          },(err)=>{
            // this.loading.dismiss();
            this.load = false;
            this.presentToast("Error al actualizar, intentalo más tarde");
          });

  
      }
    }
    else{
     
      if(!this.datosUser.valid){
        this.presentToast("Por favor llena los campos requeridos")
      }else if(!this.mncpSelect){
        this.presentToast("Por favor selecciona un departamento y municipio.")
      }
      else{

        // console.log(this.mncpSelect);

        // this.loading = this.loadingCtrl.create({
        //   spinner: 'hide',
        //   content: "Espera un momento<br>estamos procesando la información... ",
        // });
        // this.loading.present();
        this.load = true;

        let datos={cedula:this.datosUser.value.identificacion , nombre:this.datosUser.value.nombres, apellidos:this.datosUser.value.apellidos,
          direccion:this.datosUser.value.direccion, telefono:this.datosUser.value.telefono, telefonowatshapp: this.datosUser.value.whats,
          fecha_nacimiento:this.infoUser.fecha_nacimiento, id:this.global.id_usuario , id_municipio : this.mncpSelect}
            // console.log(datos);
            
    
          this.api.editUser(datos).then((data)=>{
            this.res = data;
            if(this.res.update === true){
              this.presentToast("Datos actualizados con exito");
              // this.loading.dismiss();
              this.load = false;
              this.navCtrl.pop();
            }else{
              // this.loading.dismiss();
              this.load = false;
              this.presentToast("Por favor llena los datos requeridos");
            }
          },(err)=>{
            // this.loading.dismiss();
            this.load = false;
            this.presentToast("Error al actualizar, intentalo más tarde");
          });
    

      }

     
    }
   

    }

    datosMedic() {  

      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos procesando la información... ",
      // });
      // this.loading.present();
      this.load = true;
      
      if(!this.datosMedico.value.telefono)
      {
        var telefono = 0;
      }else{
        telefono = this.datosMedico.value.telefono;
      }

      if(!this.datosMedico.value.whats)
      {
        var wp = 0;
      }else{
        wp = this.datosMedico.value.whats;
      }

      if(this.anArray.length <=0){

        let contenedor = [];

        let info = {nombres : this.datosMedico.value.nombres, apellidos:this.datosMedico.value.apellidos , titulo : this.datosMedico.value.especialidad,
          telefono:telefono , wp:wp , id:this.global.id_usuario, estudios : contenedor };

          console.log(info);

               this.api.editInfoMedico(info).then((res)=>{
                // console.log(res);
                // this.loading.dismiss();
                this.load = false;
                if(res === true){
                  this.presentToast("Datos actualizados con exito");
                  this.navCtrl.pop();
                }else{
                  this.presentToast("Error al actualizar los datos");
                  this.navCtrl.pop();
                } 
        
              },(err)=>{
                // console.log(err);
                // this.loading.dismiss();
                this.load = false;
                this.presentToast("Error en la conexion, intentalo mas tarde o revisa tu conexion");
                this.navCtrl.pop();
                
                
              });

      }else{

        
          let contenedor = [];
          let id = this.global.id_usuario;
          var tooBn:boolean

          for(let i = 0; i < this.anArray.length; i++){
            
            if(!this.anArray[i].value){
              this.presentToast("Por favor llena todos los campos");
              tooBn=false;
              break;

            }
            var nombreEstudio = this.anArray[i].value;
          
            for(let j = 0 ; j < this.anArray2.length; j++){

              if(!this.anArray2[i].value){
                this.presentToast("Por favor llena todos los campos");
                tooBn=false;
                break;
                
              }

              var nombreInstitucion = this.anArray2[i].value;
              
            }
    
            for(let j = 0 ; j < this.anArray3.length; j++){

              if(!this.anArray3[i].value){
                this.presentToast("Por favor llena todos los campos");
                tooBn=false;
                break;         
              }

              var start = this.anArray3[i].value;
              
            }
    
            for(let j = 0 ; j < this.anArray4.length; j++){
              if(!this.anArray4[i].value){
                this.presentToast("Por favor llena todos los campos");
                tooBn=false;
                break;    
              }
              var end = this.anArray4[i].value;
       
            }
    
            contenedor.push({nombreEstudio,nombreInstitucion,start,end,id});
            tooBn = true;
            
          }
    
        
          if(tooBn === true){

            let info = {nombres : this.datosMedico.value.nombres, apellidos:this.datosMedico.value.apellidos , titulo : this.datosMedico.value.especialidad,
              telefono:telefono , wp:wp , id:this.global.id_usuario, estudios:contenedor };

              console.log(info);
            
              this.api.editInfoMedico(info).then((res)=>{
                console.log(res);
                //  this.loading.dismiss();
                this.load = false;
                 this.rs = res;

                 var tbn:boolean;

                 if(this.rs.length >= 1){

                  for(let i = 0; i < this.rs.length; i++ ){

                    let val = this.rs[i].fecha;
  
                    if(val === false){
                      this.presentToast("Por favor revisa las fechas, la fecha de inicio no puede ser mayor a la de finalización.");
                      tbn = false;
                      break;
                    }else{
                      tbn = true;
                    }
                  }
 
                 }

                 if(tbn === true){
                   this.presentToast("Datos actualizados con exito.");
                   this.navCtrl.pop();
                 }

              },(err)=>{
                // console.log(err);
                // this.loading.dismiss();
                this.load = false;
                this.presentToast("Error en la conexion, intentalo mas tarde o revisa tu conexion");
                this.navCtrl.pop();
                
                
              });
          }else{
            // this.loading.dismiss();
            this.load = false;
          }
          
          
         
      }

    }

    datosProv(){

      if(!this.datosAdmin.valid){
        this.presentToast("Por favor completa los campos requeridos")
      }else{

        // this.loading = this.loadingCtrl.create({
        //   spinner: 'hide',
        //   content: "Espera un momento<br>estamos procesando la información... ",
        // });
        // this.loading.present();
        this.load = true;

        let datos = {nit:this.datosAdmin.value.nit, correo:this.datosAdmin.value.email, nombre:this.datosAdmin.value.nombres,
          direccion:this.datosAdmin.value.direccion, telefono : this.datosAdmin.value.telefono, whatsapp: this.datosAdmin.value.whats,
          descripcion: this.datosAdmin.value.descripcion, link: this.datosAdmin.value.web, video: this.datosAdmin.value.video,id:this.global.id_usuario };
          // console.log(datos);


          this.api.editProv(datos).then((data)=>{
            this.res = data;
            if(this.res.update === true){
              this.presentToast("Datos actualizados con exito");
              // this.loading.dismiss();
              this.load = false;
              this.navCtrl.pop();
            }else{
              // this.loading.dismiss();
              this.load = false;
              this.presentToast("Por favor llena los datos requeridos");
            }
          },(err)=>{
            // this.loading.dismiss();
            this.load = false;
            this.presentToast("Error al actualizar, intentalo más tarde");
          });
      }
      

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
       

        console.log(data);


        let a = data[0].cambio;
        if(a === true){
          // this.loading.dismiss();
          this.load = false;
          this.presentToast("Avatar cambiado con exito");
          this.navCtrl.setRoot(HomePage);
          this.base64Image = null;
        }else{
          // this.loading.dismiss();
          this.load = false;
          this.presentToast("Error al cambiar el avatar intentalo mas tarde");
        }

      },(err)=>{
        this.load = false;
        this.presentToast("Error en la conexión, intentalo más tarde.")
        // console.log(err);
      });
    }

    pais(){
      this.api.getPais().subscribe((data)=>{
        this.paises = data;
      },(err)=>{
        // console.log(err);
      });
    }

    departamentos(){
      this.api.getDepartamento()
      .subscribe(
      (data)=>{
      this.dptms=data;
      // console.log(this.dptms)

      if(this.infoUser.nomDepa){
        this.posisionDpt();
        console.log("aqui");
      }else{
        console.log("por aca");
      }

      
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
      this.api.getMunicipio(selectedValue).subscribe((data)=>{
        
        this.mncps = data;
        // this.loading.dismiss();
        this.load = false;
        this.mncpSelect = null;
        
        // console.log(data);
      },
      (error)=>{
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Error en la conexion, intentalo mas tarde");
      });
    }
  
    municipioSelect(selectedValue: any){
      this.mncpSelect = selectedValue;
      // console.log(this.mncpSelect);
    }

    posisionDpt(){

      console.log("entree");

      
        for(let i = 0 ; i < this.dptms.length; i++){
        
          let posision = this.dptms[i].nombre;
    
          if(this.infoUser.nomDepa === posision)
          {
            this.posisionDtp = i;
            var departamento = this.dptms[i].id_departamento;
          }
        }
    
        this.api.getMunicipio(departamento).subscribe((data)=>{
          this.mncps = data;
          // console.log(this.mncps);
    
          for(let i = 0; i < this.mncps.length ; i++){
    
            let posision = this.mncps[i].id_municipio;
    
            if(posision === this.infoUser.id_municipio){
              this.posisionMnp = i; 
              this.mncpSelect = this.infoUser.id_municipio;
            }
          }
    
          // console.log(this.mncpSelect);
          
        },(err)=>{
      
        });
      

      
    }

    presentToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 5000
      });
      toast.present();
    }
  
}


  // Open galeria opciones antiguas, 

  //   openGaleryEstudiosMedicos(){

  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType:this.camera.MediaType.PICTURE,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //     targetWidth:800,
  //     targetHeight:800,
  //     correctOrientation:true
  //       // sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //       // allowEdit: false,
  //       // correctOrientation: true,
  //       // //destinationType: this.camera.DestinationType.DATA_URL,
  //       // destinationType: this.camera.DestinationType.FILE_URI,
  //       // encodingType: this.camera.EncodingType.JPEG,
  //       // mediaType: this.camera.MediaType.PICTURE,
  //       // quality: 75,
  //       // saveToPhotoAlbum: false,
  //       // targetWidth: 800,
  //       // targetHeight: 800
  //   }
   
      
  //     this.camera.getPicture(options).then((imageData)=>{
        
        
  //        this.diploma = 'data:image/jpeg;base64,'+imageData;

    
  //     },(err)=>{
  
  //     });
    
  // }

