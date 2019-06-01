import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController,Loading,
LoadingController , Platform , IonicApp } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {Validators, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Global} from '../../app/global';
import {ListadoPublicacionesPage} from '../listado-publicaciones/listado-publicaciones';
import { HomePage } from '../home/home';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { MedicosPage } from '../medicos/medicos';


/**
 * Generated class for the PublicarServicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-publicar-servicio',
  templateUrl: 'publicar-servicio.html',
})
export class PublicarServicioPage {
  dptms;
  base64Image:string;
  private datos : FormGroup;
  private datosEdit : FormGroup;
  public imagenes;
  public mncps;
  public mncpSelect;
  public cateSelect;
  public ctgas;
  public id_global;
  public token;
  public maxCitas;
  public token2;
  public res;
  public editar;
  public ruta;
  public dispoh3:boolean;
  public dispoh2:boolean;
  maxCitasCofirm:boolean=false;
  public inf;
  horarios;
  posisionMaxCitas;
  posisionMnp;
  posisionCtga;
  posisionDtp;
  


  loading: Loading;
  cambio:boolean = false;
  dis:boolean = true;
  f2 :boolean = false;
  f3 :boolean = false;
  dias;
  mdesde;
  mhasta;
  tdesde;
  thasta;
  dias2;
  mdesde2;
  mhasta2;
  tdesde2;
  thasta2;
  dias3;
  mdesde3;
  mhasta3;
  tdesde3;
  thasta3;
  ds = [];
  f1d:boolean=false;
  f2d:boolean=false;
  h1:boolean=false;
  h2:boolean=false;
  h3:boolean=false;
  eliminar:boolean=false;
  mananaH1:boolean;
  mananaH2:boolean;
  mananaH3:boolean;
  tardeH1:boolean;
  tardeH2:boolean;
  tardeH3:boolean;
  imagen;
  mymodel;
  imgs;
  url;
  dsEdit=[];
  mCitas=[];
  infMedicos;
  medico;
  load;
  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
     public api:ApiProvider,private toastCtrl : ToastController,
    private camera: Camera,private global:Global,private alertCtrl: AlertController,private loadingCtrl: LoadingController,
    private crop: Crop,private base64: Base64 , private platform : Platform , private app : IonicApp) {
   
    this.departamentos();
    this.categorias();
    this.days();
      
   
    this.editar = this.navParams.get('info');
    this.infMedicos = this.navParams.get('medicos');
   
    // console.log(this.editar);
    
    if(this.editar){

      this.validacionEditar();
      this.obtenerImgs();
      this.numCitas();
      // console.log(this.departamentoSelect);
      // this.obtenerHorarios();
    }
    else{
      this.validacionAgregar();
    }
    
    // this.ruta = global.apiUrl+this.rutasImg.ruta;
    // this.imgsEdit=[];
    // this.imgsEdit.push({ruta:global.apiUrl+this.rutasImg});
    this.imagenes = [];   
    this.token = localStorage.getItem('token');
    this.token = this.token.split('"');
    this.token2=this.token[1];   
    this.mymodel = "segment1";
    this.url = this.global.apiUrl;
    
  }

  ionViewWillEnter() {

    
    
    
    }

  

  medicoSelect(ev){
    this.medico = ev;
  }

  numCitas(){

    let a = {posision : 1};
    let b = {posision : 2};
    let c = {posision : 3};
    let d = {posision : 4};
    let e = {posision : 5};

    // this.mCitas.push({a,b,c,d,e});

    // console.log(this.mCitas)

    let posisiones = [a,b,c,d,e];
    for(let i = 0; i < posisiones.length ; i ++){
      let pos = posisiones[i].posision;
      this.mCitas.push({pos});
    }

    this.posisionMaxCitas = this.editar.max_citas_ves;
    this.posisionMaxCitas = parseInt(this.posisionMaxCitas) - 1;
    this.maxCitas = this.posisionMaxCitas;

  }

  posisionDpt(){
    
    for(let i = 0 ; i < this.dptms.length; i++){
      
      let posision = this.dptms[i].nombre;

      if(this.editar.depar === posision)
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

        if(posision === this.editar.id_muni){
          this.posisionMnp = i; 
          this.mncpSelect = this.editar.id_muni;
        }
      }

      // console.log(this.mncpSelect);
      
    },(err)=>{
  
    });
    
  }

  posisionCategoria(){

    for(let i = 0 ; i < this.ctgas.length; i++){
       
      let posision = this.ctgas[i].id_categoria;

      if(posision === this.editar.id_cate){
        this.posisionCtga = i;
        this.cateSelect = this.editar.id_cate;
      }
    }
    
  }
  

  editarServices(){

    let formulario = {"id":this.editar.id_servicios,"nombre":this.datosEdit.value.nombre,"precio":this.datosEdit.value.precio, "direccion":this.datosEdit.value.direccion,
    "descuento":this.datosEdit.value.descuento, "duracion":this.datosEdit.value.duracion,"id_mncp":this.mncpSelect,"id_ctga":this.cateSelect,
    "video":this.datosEdit.value.video,"max_citas":this.maxCitas,"descripcion":this.datosEdit.value.descripcion};

    console.log(formulario);

    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos procesando la información... ",
      
    // });
    // this.loading.present();
    this.load = true;

    this.api.editInfoServicio(formulario).then((res)=>{
      if(res === true){
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Informacion actualizada con exito");
      }else{
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Error al actualizar la informacion");
      }
    },(err)=>{
      // this.loading.dismiss();
      this.load = false;
      this.navCtrl.setRoot(HomePage);
      this.presentToast("Error en la conexion, intentalo mas tarde");
    });

  }

  infoEditar(){
    this.api.getInfoEditar(this.editar).subscribe((data)=>{
      this.inf = data;
      this.validacionEditar();
    });
  }

 

  
  ionViewDidLoad() {

    
    
   
  }

  ionViewDidLeave(){

    const overlayView = this.app._overlayPortal._views[0];
    if (overlayView && overlayView.dismiss) {
    overlayView.dismiss();// cerrará los modales, alertas, etc
    this.imgs = {};
    } 
  }

  obtenerImgs(){
    
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando información... ",
    // });
    // this.loading.present();
    this.load = true;

    this.api.getFotosServicio(this.editar.id_servicios).subscribe((res)=>{
      this.imgs = res;
      // 
      this.load = false;
      // console.log(this.imgs);
    },(er)=>{
      // 
      this.load = false;
      this.presentToast("Error en la conexión, intentalo más tarde.");
    });
  }

  diasEdit(){

    // console.log(this.horarios);
    for(let i = 0; i < this.horarios.length ; i ++){

        let dias = this.horarios[i].dias;
        // console.log(dias);
       
        for(let j = 0; j < dias.length ; j ++){
          let dia = dias[j].dia;
          // console.log(dia);
          this.dsEdit.push({nombre:dia , disponible:false});
        }

        
    }
    

    for(var i = 0; i<this.dsEdit.length; i++){
        
      for(var j = 0;j<this.ds.length ;j++){
        let d = [];
        d = this.ds[j].dia.nombre;
        let  da = this.ds[j].dia.disponible;
        
        if(this.dsEdit[i].nombre === d){
          if (this.ds[j].dia.nombre === d)
          {
            // console.log("POR AQUII")
            var h = this.ds[j].dia.disponible = false;
            // console.log(h);
          }      
        }
      }
    } 

    console.log(this.ds);
  }

  agregarHorarioEdit(){
    
    let h1 = {id:this.editar.id_servicios, m_de:this.mdesde, m_hasta:this.mhasta, t_de:this.tdesde , t_hasta:this.thasta , semana : this.dias};
      let h2 = {id:this.editar.id_servicios, m_de:this.mdesde2, m_hasta:this.mhasta2, t_de:this.tdesde2 , t_hasta:this.thasta2 , semana : this.dias2};
      let h3 = {id:this.editar.id_servicios, m_de:this.mdesde3, m_hasta:this.mhasta3, t_de:this.tdesde3 , t_hasta:this.thasta3 , semana : this.dias3};
      let horario = [h1,h2,h3]
      let h4 = {horario: horario}
      let horarios = [h4]
      let info5 = {horarios}

      console.log(info5);

      this.api.postEditarHorario(info5).then((res)=>{
        console.log(res);
      },(err)=>{
        this.presentToast("Error en la conexión, intentalo más tarde.");
      });
  }

  guardarImgs(){
    let longitud = this.imgs.length + this.imagenes;
    
    if (longitud == 0)
    {
      this.presentToast("Debes elegir al menos una imagen.");
    }else
    {
      // this.loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: "Espera un momento<br>estamos guardando la información... ",
      // });
      // this.loading.present();
      this.load = true;

      let datos = {id:this.editar.id_servicios , imagenes : this.imagenes};
      this.api.enviarFotosEditServicio(datos).then((res)=>{
        this.presentToast("Imagenes guardas con exito");
        // this.loading.dismiss();
        this.load = false;
        console.log(res);
      },(err)=>{
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Error en la conexión, intentalo más tarde.");
      });
     
    }
  }


  days(){

    let lunes = {nombre:"lunes", disponible:true};
    let martes = {nombre:"martes",disponible:true};
    let miercoles = {nombre:"miércoles",disponible:true};
    let jueves = {nombre:"jueves",disponible:true};
    let viernes = {nombre:"viernes",disponible:true};
    let sabado = {nombre:"sábado",disponible:true};
    let domingo = {nombre:"domingo",disponible:true};

    let days = [lunes,martes,miercoles,jueves,viernes,sabado,domingo]

    for(var i = 0; i < days.length; i++){
      let dia = days[i];
      this.ds.push({dia});
    }
    // console.log(this.ds);
  }


  validacionEditar ()
  {
    this.datosEdit = this.formBuilder.group({
      nombre: [this.editar.nombre, [Validators.required, Validators.minLength(4),Validators.maxLength(100)]],
      duracion :[this.editar.duracion,[Validators.required,Validators.max(60),Validators.min(15)]],
      precio: [this.editar.precio,[Validators.required,Validators.min(0),Validators.pattern('[0-9]*')]],
      descuento: [this.editar.descuento,[Validators.max(100),Validators.min(0), Validators.pattern('[0-9]*')]],
      video :[this.editar.video],     
      direccion : [this.editar.direccion,[Validators.required,Validators.maxLength(60)]],                          
      descripcion: [this.editar.descripcion,[Validators.required,Validators.minLength(40)]],    
      // check:[false,[Validators.requiredTrue]],
   

    });
    
  }

  validacionAgregar(){
    this.datos = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(60)]],
      duracion :['',[Validators.required,Validators.max(60),Validators.min(15), Validators.pattern('[0-9]*')]],
      precio: ['',[Validators.required,Validators.min(0), Validators.pattern('[0-9]*')]],
      descuento: ['',[Validators.max(100),Validators.min(0),Validators.pattern('[0-9]*')]],
      video :[''], 
      direccion : ['',[Validators.required,Validators.maxLength(60)]],                              
      descripcion: ['',[Validators.required,Validators.minLength(40)]],    
      check:[false,[Validators.requiredTrue]],
   

    });
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
   

   if (this.imagenes.length < 6) {

    this.camera.getPicture(options).then((imageData) => {

			return this.crop.crop(imageData, { quality: 75, targetWidth: 1000, targetHeight: 1200 });
		}).then(croppedImagePath => {
      return this.base64.encodeFile(croppedImagePath)

     
		}).then(base64Data => {
      // this.loading.dismiss();
      this.imagen = base64Data;
      this.imagen = this.imagen.replace("*","jpeg");
      this.imagenes.push({base64Image : this.imagen});
      // this.loading.dismiss();
      this.load = false;
      
		}).catch(err => {
      // this.loading.dismiss();
      this.load = false;
			console.log(err)
    });
   }
  }

  openGaleryEdit(){

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
   
    let longitud = this.imgs.length;
    console.log(longitud);



   if (this.imagenes.length+longitud < 6) {

    this.camera.getPicture(options).then((imageData) => {

			return this.crop.crop(imageData, { quality: 75, targetWidth: 1000, targetHeight: 1200 });
		}).then(croppedImagePath => {
      return this.base64.encodeFile(croppedImagePath)
		}).then(base64Data => {
      // this.loading.dismiss();
      this.imagen = base64Data;
      this.imagen = this.imagen.replace("*","jpeg");
      this.imagenes.push({base64Image : this.imagen});
      // this.loading.dismiss();
      this.load = false;
		}).catch(err => {
      // this.loading.dismiss();
      this.load = false;
			console.log(err)
    });
   }else{
     this.presentToast("Maximo 6 imagenes.")
   }
  }

  
  departamentos(){
    this.api.getDepartamento()
  	.subscribe(
    (data)=>{this.dptms=data;
      // console.log(this.dptms);
      if(this.editar){
        this.posisionDpt();
      }
    
    
  },
  	(error)=>{
      // console.log(error);
    })
  }

  departamentoSelect(selectedValue: any){
    // console.log(selectedValue);
    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos cargando información... ",
      
    // });
    // this.loading.present();
    this.load = true;

    this.api.getMunicipio(selectedValue).subscribe((data)=>{
      this.mncps = data;
      // this.loading.dismiss();
      this.load = false;
      // console.log(data);
    },(error)=>{
      // this.loading.dismiss();
      this.load = false;
      // console.log(error);
    });
  }

  categorias(){
    this.api.getCategorias()
  	.subscribe(
    (data)=>{this.ctgas=data;
    // console.log(this.ctgas)

    if(this.editar){
      this.posisionCategoria();
    }
    
    
  },
  	(error)=>{
      // console.log(error);
    })
  }
  categoriaSelect(selectedValue: any){
    this.cateSelect = selectedValue;
    // console.log(this.cateSelect);
  }
  municipioSelect(selectedValue: any){
    this.mncpSelect = selectedValue;
    // console.log(this.mncpSelect);
  }

  maxCitasSelect(selectedValue: any){
    this.maxCitas = selectedValue;
    // console.log(this.maxCitas);
  }

  validacionh1(){
        let mdesde = parseInt(this.mdesde);
        let mhasta = parseInt(this.mhasta);
        let tdesde = parseInt(this.tdesde);
        let thasta = parseInt(this.thasta);

        // console.log(this.dias);
           if(!this.dias || this.dias.length === 0){
              this.presentToast("Por favor selecciona dias en el horario 1");
            }else if((!mhasta || !mdesde) &&  (!thasta || !tdesde) ){
              this.presentToast("Seleciona horas de atención en el horario 1");
            }
            else  if(mhasta < mdesde || thasta < tdesde){
              this.presentToast("La hora de la inicio es mayor a la de finalización en el horario 1");
            }else{
                // console.log("AQUII H!")
                this.h1=true;
            }
  }

  validacionh2(){

      this.h2 = false;
      let mdesde2 = parseInt(this.mdesde2);
      let mhasta2 = parseInt(this.mhasta2);
      let tdesde2 = parseInt(this.tdesde2);
      let thasta2 = parseInt(this.thasta2);

            if(!this.dias2 || this.dias2.length === 0){
             this.presentToast("Por favor selecciona dias en el horario 2");
            }
            else if((!mhasta2 || !mdesde2) &&  (!thasta2 || !tdesde2) ){
              this.presentToast("Seleciona horas de atención en el horario 2");
            }
            else if (mhasta2 < mdesde2 || thasta2 < tdesde2)
            {
              this.presentToast("La hora de la inicio es mayor a la de finalización en el horario 2");
            }else{
              this.h2=true;
             
            }
  }

  validacionh3(){
      let mdesde3 = parseInt(this.mdesde3);
      let mhasta3 = parseInt(this.mhasta3);
      let tdesde3 = parseInt(this.tdesde3);
      let thasta3 = parseInt(this.thasta3);


      if(this.f3 === true && (!this.dias3 || this.dias3.length === 0)){
        this.presentToast("Por favor selecciona dias en el horario 3");
      }else if((!mhasta3 || !mdesde3) &&  (!thasta3 || !tdesde3) ){
        this.presentToast("Seleciona horas de atención en el horario 3");
      }
      else if (mhasta3 < mdesde3 || thasta3 < tdesde3)
      {
        this.presentToast("La hora de la inicio es mayor a la de finalización en el horario 3");
      }else{
        this.h3=true;
      }
    
     
    
  }

  disponibilidadH2(){

    // 

    this.validacionh1();
    if(this.h1 === true){

      let l = this.ds[0].dia.disponible;
      let m = this.ds[1].dia.disponible;
      let mi = this.ds[2].dia.disponible;
      let j = this.ds[3].dia.disponible;
      let v = this.ds[4].dia.disponible;
      let s = this.ds[5].dia.disponible;
      let d = this.ds[6].dia.disponible;
  
      if (l === false && m === false && mi === false && j === false && v === false && s === false && d === false )
      {
        this.dispoh2 = false;
      }else{
        this.dispoh2 = true;
      }
    }
   

       if(this.dispoh2 === false){
        this.presentToast("Ya no hay dias disponibles para el horario 2");
        
        for(let r = 0; r<this.dias.length; r++){
          for(let t = 0;t<this.ds.length ;t++){
            let d = [];
            d = this.ds[t].dia.nombre;
            let  da = this.ds[t].dia.disponible;
            
            if(this.dias[r] === d){
            
              if (this.ds[t].dia.nombre === d)
              {
                
                var k = this.ds[t].dia.disponible = true;
               
              }      
            }
           }
  
          }
        }
      }


  disponibilidadH3(){
    
    let l = this.ds[0].dia.disponible;
    let m = this.ds[1].dia.disponible;
    let mi = this.ds[2].dia.disponible;
    let j = this.ds[3].dia.disponible;
    let v = this.ds[4].dia.disponible;
    let s = this.ds[5].dia.disponible;
    let d = this.ds[6].dia.disponible;

    if (l === false && m === false && mi === false && j === false && v === false && s === false && d === false )
    {
      this.dispoh3 = false;
    }else{
      this.dispoh3 = true;
    }

     if(this.dispoh3 === false){
      this.presentToast("Ya no hay dias disponibles para el horario 3");
      
      for(var r = 0; r<this.dias2.length; r++){
        for(var t = 0;t<this.ds.length ;t++){
          let d = [];
          d = this.ds[t].dia.nombre;
          let  da = this.ds[t].dia.disponible;
          
          if(this.dias2[r] === d){
          
            if (this.ds[t].dia.nombre === d)
            {
              
              var k = this.ds[t].dia.disponible = true;
             
            }      
          }
        }

        }
     }
  }
 

  agregarHorario(){

      // console.log(this.h2);
      // console.log(this.dias2);
      // console.log(this.mdesde2);
      // console.log(this.mhasta2);
      // console.log(this.tdesde2);
      // console.log(this.thasta2);

    let agregar:boolean = true;
    switch(agregar === true){

      case this.f2 === false :
      this.validacionh1();
      if(this.h1 === true){
       
        for(var i = 0; i<this.dias.length; i++){
        
                for(var j = 0;j<this.ds.length ;j++){
                  let d = [];
                  d = this.ds[j].dia.nombre;
                  let  da = this.ds[j].dia.disponible;
                  
                  if(this.dias[i] === d){
                    if (this.ds[j].dia.nombre === d)
                    {
                      // console.log("POR AQUII")
                      var h = this.ds[j].dia.disponible = false;
                      // console.log(h);
                    }      
                  }
                }
              }  

              this.disponibilidadH2();
              if(this.dispoh2 === true){
                this.f2 = true;
                this.f1d = true;
                this.eliminar = true;
              }
             
            }

        
    
      break; 

      
      case (this.f2 === true && this.dispoh2 === true):
      
      this.validacionh2();
      if(this.h2 === true){
        for(var m = 0; m<this.dias2.length; m++){
          
          for(var n = 0;n<this.ds.length ;n++){
            let d = [];
            d = this.ds[n].dia.nombre;
            let  da = this.ds[n].dia.disponible;
            
            if(this.dias2[m] === d){
              // console.log(d);
              if (this.ds[n].dia.nombre === d)
              {
                // console.log(d);
                // console.log("POR AQUII")
                var k = this.ds[n].dia.disponible = false;
                // console.log(h);
              }      
            }
          }
        } 

                this.disponibilidadH3();
                if(this.dispoh3 === true){
                  this.f3 = true;
                  this.f2d = true;
                  this.dis=false;                 
                }
       
      }
      break;
    }
  } 

  eliminarHorario(){

    let eli:boolean = true;
    console.log(this.h2);
    switch(eli === true){
      
      case (this.f2 === true && this.f3 === false):
      this.dis = true;
      this.h1 = false;
      this.h2 = false;

      for(var i = 0; i<this.dias.length; i++){
              for(var j = 0;j<this.ds.length ;j++){
                let d = [];
                d = this.ds[j].dia.nombre;
                let  da = this.ds[j].dia.disponible;
                
                if(this.dias[i] === d){
                  if (this.ds[j].dia.nombre === d)
                  {
                    
                    var h = this.ds[j].dia.disponible = true;
                    
                  }      
                }
              }
            }
            
            this.f2 = false;
            this.f1d = false;
            this.eliminar = false;
            this.dias2 = undefined;
            this.mdesde2 = undefined;
            this.mhasta2 = undefined;
            this.tdesde2 = undefined;
            this.thasta2 = undefined;
            
      
      break;

  //     case (this.h1 === true && this.f2 === true && this.h2 === false):
  //       console.log("AQUII");
  //   this.f2d = false;
  //     this.h2 = false;

  //     for(var p = 0; p<this.dias2.length; p++){
  //       for(var o = 0;o<this.ds.length ;o++){
  //         let d = [];
  //         d = this.ds[o].dia.nombre;
  //         let  da = this.ds[o].dia.disponible;
          
  //         if(this.dias2[p] === d){
          
  //           if (this.ds[o].dia.nombre === d)
  //           {
              
  //             var l = this.ds[o].dia.disponible = true;
             
  //           }      
  //         }
  //       }

  // }

  //   break;

      case (this.f2 === true && this.f3 === true):

      this.f3 = false;
      this.f2d = false;
      this.h2 = false;
      this.dis = true;

      for(var m = 0; m<this.dias2.length; m++){
              for(var n = 0;n<this.ds.length ;n++){
                let d = [];
                d = this.ds[n].dia.nombre;
                let  da = this.ds[n].dia.disponible;
                
                if(this.dias2[m] === d){
                
                  if (this.ds[n].dia.nombre === d)
                  {
                    
                    var k = this.ds[n].dia.disponible = true;
                   
                  }      
                }
              }
      
        }

            this.dias3 = undefined;
            this.mdesde3 = undefined;
            this.mhasta3 = undefined;
            this.tdesde3 = undefined;
            this.thasta3 = undefined;
           
    
    break;

    }

    
  }

 
  

  registrar(){
   
    if(!this.editar){

   /////////////////////////// Validaciones horarios ////////////////////////////////
      
    let hor:boolean = true;
    // var tbn:boolean = true;

      switch(hor === true){

        case this.h1 === false:
        this.validacionh1();
        // console.log("1");
        break;

        case (this.h1 === true && this.f2 === false && this.f3 === false):
        // console.log("registrar");
        this.enviar();
        break;

        case (this.h1 === true && this.h2 === true && this.f3 === false):
        // console.log("AQUIIIIIIII REGISTRARRRR");
        this.enviar();
        break;

        case (this.h1 === true && this.h2 === true && this.h3 === true):
        // console.log("registrar");
        this.enviar();
        break;

        case ( this.f3 === true):
        this.validacionh3();
        break;

        case (this.h1 === true && this.f2 === true ):
        this.validacionh2();
        break;

       

      }
    
   }
   else{
    let formularioEdit = {"id_usuario":this.global.id_usuario,"token":this.token2,"nombre":this.datos.value.nombre,"precio":this.datos.value.precio,
    "descuento":this.datos.value.descuento, "duracion":this.datos.value.duracion,"id_mncp":this.mncpSelect,"id_ctga":this.cateSelect, "imagenes":this.imagenes,
    "video":this.datos.value.video,"max_citas":this.maxCitas,"descripcion":this.datos.value.descripcion};
    this.api.editService(formularioEdit);
   }
  }

  enviar(){

    // if(this.imagenes.length < 1){
    //    this.presentToast("Debes elegir almenos una imagen.");
    // }else 
    if (!this.medico){
      this.presentToast("Debes elegir un medico.")
    }
    else if(!this.mncpSelect)
    {
      this.presentToast("Debes elegir un departamento y municipio.");
    }else if(!this.cateSelect){
      this.presentToast("Debes elegir una categoria.");
    }else if(!this.maxCitas){
      this.presentToast("Por favor selecciona un número maximo de citas por hora.");
      this.maxCitasCofirm = true;
    }
     else if(!this.datos.valid) {
      this.presentToast("completa los campos requeridos.");
    }
    else{

   
    
      let h1 = { m_de:this.mdesde, m_hasta:this.mhasta, t_de:this.tdesde , t_hasta:this.thasta , semana : this.dias};
      let h2 = { m_de:this.mdesde2, m_hasta:this.mhasta2, t_de:this.tdesde2 , t_hasta:this.thasta2 , semana : this.dias2};
      let h3 = { m_de:this.mdesde3, m_hasta:this.mhasta3, t_de:this.tdesde3 , t_hasta:this.thasta3 , semana : this.dias3};
      let horario = [h1,h2,h3]
      let h4 = {horario: horario}
      let horarios = [h4]
      let info5 = {horarios}
      
    
    let formulario = {"id_usuario":this.global.id_usuario,"token":this.token2,"nombre":this.datos.value.nombre,"precio":this.datos.value.precio, "direccion":this.datos.value.direccion,
    "descuento":this.datos.value.descuento, "duracion":this.datos.value.duracion,"id_mncp":this.mncpSelect,"id_ctga":this.cateSelect, "imagenes":this.imagenes,
    "video":this.datos.value.video,"max_citas":this.maxCitas,"descripcion":this.datos.value.descripcion, horarios , medico_id:this.medico};

    console.log(formulario);

    // this.loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: "Espera un momento<br>estamos procesando la información... ",
      
    // });
    // this.loading.present();
    this.load = true;
    this.maxCitasCofirm = false;
    this.api.postImages(formulario).then((data)=>{
      // console.log("AQUIIIIII");
      // console.log(data);
      this.res = data;
      this.res = this.res[0];
      // console.log(this.res.agregado);
      if(this.res.agregado == true){
        // this.loading.dismiss();
        this.load = false;
        this.presentToast("Servicio agregado con exito.");
        this.navCtrl.pop();
      }
      else{
        // this.loading.dismiss();
        this.load = false;
        this.navCtrl.pop();
        this.presentToast("Error al agregar el servicio.")
      }
    },(error)=>{
      // console.log("error en la conexion");
    // this.loading.dismiss();
    this.load = false;
    this.presentToast("Error en la conexion, intentalo más tarde o revisa tu conexión.");
    this.navCtrl.setRoot(HomePage);
    
    });
  
     }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration:4000
    });
    toast.present();
  }

  borrarFoto(index,){
    console.log(index);
    this.imagenes.splice(index, 1);
  }

  borrarFotoEdit(index,id,ruta){
    // console.log(index,id,ruta);

      let alert = this.alertCtrl.create({
              title: 'Confirmación',
              message: '¿Seguro que deseas eliminar esta imagen, ten encuenta que no se podra recuperar?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {
                    
                  }
                },
                {
                  text: 'Aceptar',
                  handler: () => {

                    if(this.imgs.length == 1){
                      this.presentToast("No se puede eliminar, El servicio debe tener al menos una imagen");
                    }else{

                      this.imgs.splice(index, 1);
                      // let body = {id:id , ruta:ruta}
                      this.api.dltImagenServicio(id,ruta).then((res)=>{ 
                        console.log(res);
                      },(err)=>{
                        console.log(err);
                      });
                    }
                    
                   
                  }
                }
              ]
            });
            alert.present();

      
    
   
  }



diasF1(ev){
      
    this.dias=ev;
    // console.log(this.dias);
}
mdesdef1(ev){
  this.mdesde=ev;
  // console.log(this.mdesde);
}
mhastaf1(ev){
  this.mhasta=ev;
  this.validacionh1();
  // console.log(this.mhasta);
}
tdesdef1(ev){
  // console.log(ev);
  this.tdesde=ev;
}
thastaf1(ev){
  // console.log(ev);
 this.thasta=ev;
 this.validacionh1();

}  

diasF2(ev){
  this.dias2=ev;
  // console.log(this.dias2);
}
mdesdef2(ev){
this.mdesde2=ev;
// console.log(this.mdesde2);
}
mhastaf2(ev){
this.mhasta2=ev;
// console.log(this.mhasta2);
this.validacionh2();
}
tdesdef2(ev){
this.tdesde2=ev;
}
thastaf2(ev){
this.thasta2=ev;
this.validacionh2();

}  
diasF3(ev){
this.dias3=ev;
}
mdesdef3(ev){
this.mdesde3=ev;
}
mhastaf3(ev){
this.mhasta3=ev;
this.validacionh3();
}
tdesdef3(ev){
this.tdesde3=ev;
}
thastaf3(ev){
this.thasta3=ev;
this.validacionh3();
}  

mananaVer(ev){
  if(ev.value === true){
    this.mananaH1=true;
  }else{
    this.mananaH1=false;
    this.mdesde = null;
    this.mhasta = null;
  }

  // console.log(this.mdesde,this.mhasta);
}

tardeVer(ev){
  if(ev.value === true){
    this.tardeH1=true;
  }else{
    this.tardeH1=false;
    this.tdesde=null;
    this.thasta=null;
  }
}

mananaVerH2(ev){

  if(ev.value === true){
    this.mananaH2 = true;
  }else{
    this.mananaH2 = false;
    this.mdesde2 = null;
    this.mhasta2 = null;
  }
}

tardeVerH2(ev){

  if(ev.value === true){
    this.tardeH2 = true;
  }else{
    this.tardeH2=false;
    this.tdesde2=null;
    this.thasta2=null;
  }
}

mananaVerH3(ev){
  if(ev.value === true){
    this.mananaH3 = true;
  }else{
    this.mananaH3 = false;
    this.mdesde3 = null;
    this.mhasta3 = null;
  }
}

tardeVerH3(ev){
  if(ev.value === true){
    this.tardeH3 = true;
  }else{
    this.tardeH3 = false;
    this.tdesde3 = null;
    this.thasta3 = null;
  }

  
}



}


// private volver (){
  //   this.platform.registerBackButtonAction(() => {

        
  //     let alert = this.alertCtrl.create({
  //       title: 'Confirmación',
  //       message: '¿Seguro que deseas descartar esta publicación?',
  //       buttons: [
  //         {
  //           text: 'Cancelar',
  //           role: 'cancel',
  //           handler: () => {
  //             // console.log('Cancel clicked');
  //           }
  //         },
  //         {
  //           text: 'Aceptar',
  //           handler: () => {
  //             this.navCtrl.pop();
  //           }
  //         }
  //       ]
  //     });
  //     alert.present();


   // async ionViewCanLeave() {
  //   const shouldLeave = await this.confirmLeave();
  //   return shouldLeave;
  // }

  // confirmLeave(): Promise<Boolean> {
  //   let resolveLeaving;
  //   const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
  //   const alert = this.alertCtrl.create({
  //     title: 'Confirmacion',
  //     message: '¿Seguro que deseas descartar esta publicacion?',
  //     buttons: [
  //       {
  //         text: 'No',
  //         role: 'cancel',
  //         handler: () => resolveLeaving(false)
  //       },
  //       {
  //         text: 'Si',
  //         handler: () => resolveLeaving(true)
  //       }
  //     ]
  //   });
  //   alert.present();
  //   return canLeave   https://youtu.be/
  // }

   // openGalery(){
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
  //   if (this.imagenes.length < 6) {
      
  //     this.camera.getPicture(options).then((imageData)=>{
        
        
  //       this.imagenes.push({base64Image : 'data:image/jpeg;base64,'+imageData});

    
  //     },(err)=>{
  
  //     });
  //   }
  // }

  // eliminarHorarioEdit(id,dias){
    
  //   console.log(id,dias);

  //   let alert = this.alertCtrl.create({
  //           title: 'Confirmación',
  //           message: '¿Seguro que deseas eliminar este horario?',
  //           buttons: [
  //             {
  //               text: 'Cancelar',
  //               role: 'cancel',
  //               handler: () => {
  //                 // console.log('Cancel clicked');
  //               }
  //             },
  //             {
  //               text: 'Aceptar',
  //               handler: () => {

  //                   this.loading = this.loadingCtrl.create({
  //                     spinner: 'hide',
  //                     content: "Espera un momento<br>estamos eliminando el horario... ",
  //                   });
  //                   this.loading.present();

  //                   this.api.dltHorarioServicio(id).then((res)=>{
  //                     this.loading.dismiss();
  //                     this.obtenerHorarios();

  //                     if(res === true){
  //                       this.presentToast("Horario eliminado con exito");
  //                     }else{
  //                       this.loading.dismiss();
  //                       this.presentToast("Error al eliminar el horario");
  //                     }
                      
  //                   },(err)=>{
  //                     this.loading.dismiss();
  //                     this.presentToast("Error en la conexion, intentalo mas tarde");
  //                   });
  //               }
  //             }
  //           ]
  //         });
  //         alert.present();


   
  // }

    // obtenerHorarios(){
  //   this.loading = this.loadingCtrl.create({
  //     spinner: 'hide',
  //     content: "Espera un momento<br>estamos cargando información... ",
  //   });
  //   this.loading.present();

  //   this.api.getHorariosServicio(this.editar.id_servicios).subscribe((data)=>{

  //     this.horarios = data;
  //     this.diasEdit();
  //     this.loading.dismiss();
  //   },(err)=>{
  //     this.loading.dismiss();
  //     this.presentToast("Error en la conexión, intentalo más tarde.");
  //   });
  // }

