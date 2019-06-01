import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {Global} from '../../app/global';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

// let apiUrl = 'http://192.168.2.104:3300';

@Injectable()
export class ApiProvider {

  // obtenerDatos(){
  // 	return this.http.get('https://jsonplaceholder.typicode.com/posts');
  // }
  public token;
  public token2;
  public apiUrl;

  //variable para almacenar el token de notificaciones push
  tk;

  constructor(public http: HttpClient,private global : Global) {
    this.apiUrl = global.apiUrl;
  }

  
  /////////////////////////////////////// POST ///////////////////////////////////////////////

  postLogin(datos,tipo:string) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json');
  
        this.http.post(this.apiUrl+tipo, datos, {headers : headers})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }
  
    postRegistro(datos,tipo:string){
      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');
    
          this.http.post(this.apiUrl+tipo, datos, {headers : headers})
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }


    // Ruta para enviar el formulario de registro de un nuevo servicio
    
    postImages(datos){
      // console.log("Entreeeee");
      // let cadena = "pepin";
      // cadena = cadena.replace('"',' ');
      // console.log(cadena);
      // console.log(datos);
      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');
    
          this.http.post(this.apiUrl+'/services' ,datos, {headers : headers})
            .subscribe(res => {
              // console.log("Toy aquiiiii");
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    guardarCita(datos){
      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');
    
          this.http.post(this.apiUrl+'/events',datos, {headers : headers})
            .subscribe(res => {
              
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    postBeneficiario(datos) {
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        // console.log(this.token2);

          this.http.post(this.apiUrl+'/benef'+"?token="+this.token2,datos,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    enviarMensaje(mensaje){

      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

          this.http.post(this.apiUrl+'/sendm',mensaje, {headers : headers})
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    postEditarHorario(horarios){

      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
          // console.log(horarios);
          this.http.post(this.apiUrl+'/horariosed',horarios, {headers : headers})
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    enviarFotosEditServicio(imgs){

      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
          // console.log(imgs);
          this.http.post(this.apiUrl+'/infotoser',imgs, {headers : headers})
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    postMascota(datos){

      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
          // console.log(imgs);
          this.http.post(this.apiUrl+'/mascota',datos, {headers : headers})
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    postCalificacion(info){
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
          // console.log(imgs);
          this.http.post(this.apiUrl+'/coment',info, {headers : headers})
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    postCitasProvedor(info){
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        
       
        // console.log(j);
          this.http.post(this.apiUrl+'/citai/'+"?token="+this.token2,info,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }
    

    // Agregar medico desde provedor
    postAgregarMedicos(info){
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        
       
        // console.log(info);
          this.http.post(this.apiUrl+'/medicos/'+"?token="+this.token2,info,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

     /////////////////////////////////////// GET ///////////////////////////////////////////////

    getDepartamento()
    {
      return this.http.get(this.apiUrl+'/departamentos/47');
    }
    getMunicipio(id){
      return this.http.get(this.apiUrl+'/municipios/'+id);
    }
    getCategorias(){
      return this.http.get(this.apiUrl+'/categoria');
    }
    getServicios(){
      return this.http.get(this.apiUrl+'/services');  
    }
    getProovedor(id){
      
      // console.log(id);
      return this.http.get(this.apiUrl+'/provedores/'+id);
    }
    getPublicacionesProveedor(id){
      return this.http.get(this.apiUrl+'/services/'+id);
    }

    getFechas()
    {
      return this.http.get(this.apiUrl+'/events');
    }

    //Ruta para pedir la información del usuario
    getUser(id){
      // console.log(id);
      return this.http.get(this.apiUrl+'/user/'+id);
    }

    getHorario(fecha,id,id_categoria){
      // console.log(fecha);
      // console.log("AQUIIIIIIIIIIIIIIIIII");
      // console.log(id_categoria);
      return this.http.get(this.apiUrl+'/citas/'+fecha+'/'+id+'/'+id_categoria);
    }
    getCitasUsuario(id){
      return this.http.get(this.apiUrl + '/events/'+id);
    }

    getServicio(id){
      // console.log("AquIIIIIIII");
      // console.log(id);
      return this.http.get(this.apiUrl+'/servicess/'+id);
    }

    getCitasMedico(fecha,id,id_cate){
   
        return this.http.get(this.apiUrl+'/servcitas/'+fecha+'/'+id+'/'+id_cate);
        //  return this.http.get(this.apiUrl+'/servcitas/'+fecha+'/'+id);
    }

    getValidacion(id){
      return this.http.get(this.apiUrl+'/datos/'+id);
    }

    getBusqueda(idm,idc){
      return this.http.get(this.apiUrl+'/services/'+idm+'/'+idc);
    }

    getPais(){
      return this.http.get(this.apiUrl+'/pais');
    }

    getParentesco(){
      return this.http.get(this.apiUrl+'/parent');
    }

    getBeneficiarios(id){
      return this.http.get(this.apiUrl+'/benef/'+id);
    }

    getEventos(mes,anio,id_serv,id_cate){

      return this.http.get(this.apiUrl+'/eventser/'+mes+'/'+anio+'/'+id_serv+'/'+id_cate);
    }

    getCitasBeneficiarios(id){
      return this.http.get(this.apiUrl+'/eventsb/'+id);
    }

    getInfoEditar(id){
      return this.http.get(this.apiUrl+'/sservicio/'+id);
    }

    getFotosServicio(id){
      return this.http.get(this.apiUrl+'/fotosser/'+id);
    }

    getHorariosServicio(id){
      return this.http.get(this.apiUrl+'/horariosed/'+id);
    }

    getMascotasUser(id){
      return this.http.get(this.apiUrl+'/mascota/'+id);
    }

    getMascotaInfo(id){
      return this.http.get(this.apiUrl+'/mascotam/'+id);
    }

    getCitasMascota(id){
      // console.log(id);
      return this.http.get(this.apiUrl+'/eventsm/'+id);
    }

    getTopics(id){
      return this.http.get(this.apiUrl+'/topic/'+id);
    }

    getHistorialUser(id){
      // console.log("Apiii")
      return this.http.get(this.apiUrl+'/hist/'+id);
    }
  
    getHistorialBeneficiarios(id){
      return this.http.get(this.apiUrl+'/histb/'+id);
    }

    getHistorialmascotas(id){
      return this.http.get(this.apiUrl+'/histm/'+id);
    }
   
    cedula(cedula,bol){
      return this.http.get(this.apiUrl+'/cedula/'+cedula +'/'+bol);
    }

    // Ruta para obtener los medicos que estan subscritos a un provedor
    getMedicosProvedor(id){
      return this.http.get(this.apiUrl+'/medicos/'+id);
    }

    // Saber si el medico existe o no a travez de la cedula
    getMedico(cedula){
      return this.http.get(this.apiUrl+'/medicosc/'+cedula);
    }

    // Ruta para perdir la información del medico
    getInfoMedico(id){
      return this.http.get(this.apiUrl+'/medicosm/'+id);
    }

    // Ruta para pedir los servicios que tiene asociados el medico
    getProvedoresMedico(id){
      return this.http.get(this.apiUrl +'/medicospr/'+id);
    }

    //metodo para la confirmacion de la cuenta 
    getConfirmacionCuenta(id){
      return this.http.get(this.apiUrl+'/locked/'+id)
    }

    //metodo para reenciar codigo de confirmacion de cuenta al correo
    getReenviarCodigoCorreo(id){
      return this.http.get(this.apiUrl+'/cambios/'+id)
    }

    //metodo para verificar que el correo exista, para el cambio de contraseña
    getConfirmacionCorreo(correo){
      return this.http.get(this.apiUrl+'/cambioc/'+correo);
    }

    //ruta para obtener los comentarios por servicio de un medico
    getComentarioMedico(id,idctga){
      return this.http.get(this.apiUrl+'/comentmed/'+id+'/'+idctga);
    }

     /////////////////////////////////////// DELETE ///////////////////////////////////////////////

     dltService(id){
      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        let url =this.apiUrl+'/services/'+id+"?token="+this.token2;
        // console.log(url);
          this.http.delete(url,{headers : headers})
            .subscribe(res => {
              
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
     }
     
     dltCita(id,mascota){
      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
          this.http.delete(this.apiUrl+'/events/'+id+'/'+mascota+"?token="+this.token2,{headers : headers})
            .subscribe(res => {
              
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
     }

     dltCitaProvedor(idServicio, idProvedor, id_categoria){

      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
          this.http.delete(this.apiUrl+'/eventss/'+idServicio+'/'+idProvedor+'/'+id_categoria+"?token="+this.token2,{headers : headers})
            .subscribe(res => {
              
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });

     }

     dltImagenServicio(id,ruta){

      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        console.log(id);
        console.log(ruta);
        // +"?token="+this.token2
          this.http.delete(this.apiUrl+'/elmfotoser/'+id,{headers : headers})

            .subscribe(res => {
              
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });

     }

     dltHorarioServicio(id){

      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        // console.log(id);
        // +"?token="+this.token2
          this.http.delete(this.apiUrl+'/horariodel/'+id+"?token="+this.token2,{headers : headers})

            .subscribe(res => {
              
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });

     }

     // borrar medico, desde el provedor
     dltMedicoPorProvedor(medico_id,provedor_id){

      console.log(medico_id,provedor_id);

      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        // console.log(id);
        // +"?token="+this.token2
          this.http.delete(this.apiUrl+'/medico/'+medico_id+'/'+provedor_id+"?token="+this.token2,{headers : headers})

            .subscribe(res => {
              
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });

     }

     
     
    /////////////////////////////////////// PUT ///////////////////////////////////////////////

    obtenerToken(token){
      this.tk = token;
      console.log(this.tk);
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        
        let id = localStorage.getItem("id");
        let j = {token: this.tk.registrationId,id:id,admin:this.global.admin,medico:this.global.medico};
        console.log(j);
          this.http.put(this.apiUrl+'/push',j,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
      
    }

    editAvatar(foto,id,admin,medico){

      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        
        let j = {foto:foto,id:id,admin:admin,medico:medico};
        console.log(j);
          this.http.put(this.apiUrl+'/fotou/'+"?token="+this.token2,j,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    editAvatarMascota(datos){

      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        
        // console.log(j);
          this.http.put(this.apiUrl+'/fotom/'+"?token="+this.token2,datos,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }


    editService(datos){
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];

        console.log(datos);

          this.http.put(this.apiUrl,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    editUser(datos){
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        // console.log(this.token2);

          this.http.put(this.apiUrl+'/user/'+"?token="+this.token2,datos,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }


    // Ruta para actualizar los datos del provedor 

    editProv(datos){
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        // console.log(this.token2);

          this.http.put(this.apiUrl+'/provedores/'+"?token="+this.token2,datos,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    editInfoServicio(datos){
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        // console.log(this.token2);

          this.http.put(this.apiUrl+'/servicioput/'+"?token="+this.token2,datos,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }


    // Ruta para la edicion de informacion del medico
    editInfoMedico(info){

    console.log(info);


      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        // console.log(info);

          this.http.put(this.apiUrl+'/medico/'+"?token="+this.token2,info,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    confirmacionCuenta(info){
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        this.token = localStorage.getItem('token');
        this.token = this.token.split('"');
        this.token2=this.token[1];
        // console.log(info);

          this.http.put(this.apiUrl+'/cuenta/'+"?token="+this.token2,info,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    cambioContrasena(info){
      // console.log(info);
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
   
        // console.log(info);

          this.http.put(this.apiUrl+'/cambioc',info,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }

    // ruta para dar respuestas a los comentarios por parte del medico.
    respuestaComentarioMedico(info){
      // console.log(info);
      return new Promise((resolve, reject) => {

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
   
        // console.log(info);

          this.http.put(this.apiUrl+'/comentmed',info,{headers : headers})
            .subscribe(res => {
              // console.log("ENTRE AL PROVIDER");
              // console.log(res);
              resolve(res);
            }, (err) => {
              reject(err);
            });
      });
    }


  
}
