import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ToastController,Loading,
  LoadingController } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';

/**
 * Generated class for the PopoverFiltroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover-filtro',
  templateUrl: 'popover-filtro.html',
})
export class PopoverFiltroPage {
  ctgas;
  mncps;
  dptms;
  mncpSelect;
  dptmSelect;
  cateSelect;
  event;
  loading: Loading;
  mascota;
  load;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api:ApiProvider,
    public viewCtrl: ViewController,private toastCtrl:ToastController, public loadingCtrl: LoadingController) {

      this.mascota = this.navParams.get('mascota');

      if(!this.mascota){
        this.categorias();
        this.departamentos();
      }else{
        this.departamentos();
      }

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverPage');
    
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
      // console.log(data);
    },(error)=>{
      // this.loading.dismiss();
      this.load = false;
      // console.log(error);
      this.presentToast("Error en la conexión.");
    });
  }

  categorias(){
    // this.loading = this.loadingCtrl.create({
    //   spinner : 'hide',
    //   content : 'Espera un momento<br>estamos cargando las categorias...'
    // });
    // this.loading.present();
    this.load = true;
    this.api.getCategorias().subscribe((data)=>{
     this.ctgas = data;
     this.load = false;
    //  this.loading.dismiss();
    //  console.log(this.ctgas);
    },(err)=>{
      this.load = false;
      // this.loading.dismiss();
      this.presentToast("Error en la conexión, intentalo más tarde.");
      // console.log(err)
    });
  }



  departamentos(){
    // this.loading = this.loadingCtrl.create({
    //   spinner : 'hide',
    //   content : 'Espera un momento<br>estamos cargando los departamentos...'
    // });
    // this.loading.present();
    this.load = true;

    this.api.getDepartamento().subscribe((data)=>{
      this.loading.dismiss();
      this.dptms = data;
      this.load = false;
    },(err)=>{
      this.load = false;
      this.loading.dismiss();
      this.presentToast("Error en la conexión, intentalo más tarde.");
    });
  }
  categoriaSelect(selectedValue: any){
    this.cateSelect = selectedValue;
    // console.log(this.cateSelect);
  }

  municipioSelect(selectedValue: any){
    this.mncpSelect = selectedValue;
    // console.log(this.mncpSelect);
  }

  buscar(){
    
    if(!this.cateSelect){
      // console.log("categoria undifined");
      if(!this.mncpSelect)
      {
        this.presentToast("Selecciona departamento y municipio");
      }else{
        this.event={categoria:0, municipio:this.mncpSelect};
        this.viewCtrl.dismiss(this.event); 
      }
      
    }else{
      if(!this.mncpSelect){
        this.presentToast("Selecciona departamento y municipio");
      }else{
        this.event={categoria:this.cateSelect, municipio:this.mncpSelect};
        this.viewCtrl.dismiss(this.event);
      }
      
    }
    
  }

  buscarVeterinario(){
    if(!this.mncpSelect)
    {
      this.presentToast("Selecciona departamento y municipio");
    }else{
      this.event={categoria:20, municipio:this.mncpSelect};
      this.viewCtrl.dismiss(this.event); 
    }
  }
  
  cerrar(){
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
