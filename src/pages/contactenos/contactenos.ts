import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {ServicioPage} from '../servicio/servicio';

/**
 * Generated class for the ContactenosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactenos',
  templateUrl: 'contactenos.html',
})
export class ContactenosPage {
idProvedor;
mostrar:boolean;
publicaciones;
inf= [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private api:ApiProvider) {

    this.idProvedor = this.navParams.get('id');
    console.log(this.idProvedor);

    if(!this.idProvedor){
      this.mostrar = false;
    }else{
      this.mostrar=true;
      this.getPublicaciones();
    }
  }

  goToService(servicio){
    this.navCtrl.push(ServicioPage,{servicio:servicio,masPublicaciones:true})
  }

  getPublicaciones(){
    this.api.getPublicacionesProveedor(this.idProvedor).subscribe((res)=>{
      this.publicaciones = res;

      for(var i = 0; i < this.publicaciones.length; i ++){
     
        let categoria =this.publicaciones[i].categoria;
        let createdAt=this.publicaciones[i].createdAt;
        let createdupdate = this.publicaciones[i].createdupdate;
        let descripcion = this.publicaciones[i].descripcion;
        let descuento = this.publicaciones[i].descuento;
        let direccion = this.publicaciones[i].direccion;
        let duracion = this.publicaciones[i].duracion;
        let foto = this.publicaciones[i].foto;
        let fotos = this.publicaciones[i].fotos;
        let id_categoria = this.publicaciones[i].id_categoria;
        let id_provedores = this.publicaciones[i].id_provedores;
        let id_servicios = this.publicaciones[i].id_servicios;
        let locked = this.publicaciones[i].locked;
        let max_citas_ves = this.publicaciones[i].max_citas_ves;
        let municipio_id_municipio = this.publicaciones[i].municipio_id_municipio;
        let nombre = this.publicaciones[i].nombre;
        let precio = this.publicaciones[i].precio;
        let precio_cliente_prevenir = this.publicaciones[i].precio_cliente_prevenir;
        let promedio = this.publicaciones[i].promedio;
        let video = this.publicaciones[i].video;
        let coment = this.publicaciones[i].coment;

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
      

          this.inf.push({categoria:categoria, createdAt:createdAt, createdupdate:createdupdate, descripcion:descripcion,descuento:descuento,
          direccion:direccion,duracion:duracion,foto:foto, fotos:fotos, id_categoria:id_categoria, id_provedores:id_provedores,id_servicios:id_servicios,
          locked:locked, max_citas_ves:max_citas_ves, municipio_id_municipio:municipio_id_municipio, nombre:nombre, precio:precio,
          precio_cliente_prevenir:precio_cliente_prevenir,promedio:promedio, video:video, estrellasAmarillas:estrellasAmarillas,estrellasGrises:estrellasGrises, coment : coment });


      }
      // console.log(this.publicaciones);
    },(err)=>{
      // console.log(err);
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ContactenosPage');
  }

}
