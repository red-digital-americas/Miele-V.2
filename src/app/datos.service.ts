import { Injectable } from '@angular/core';

// Importar objetos de la librería http
//import { Http, Response, RequestOptions, Headers } from '@angular/http';
// Importar la clase Observable desde la librería rxjs
//import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Hero } from './models/login';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/map';

const httpOptions = {
  //headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DatosService {

  public NPCarrito: number = 0;
  public MostrarCarrito: boolean = true;


  public heroesUrl = 'https://api.mieleservice.com.mx/api/';  // URL to web api
  public url = 'https://api.mieleservice.com.mx/';  // URL images
  public url_sitio_files: string = 'https://api.mieleservice.com.mx/mieletickets'; // URL to doctos api server


  //public heroesUrl = 'http://localhost:50570/api/';  // URL to web api desarrollo local
  //public heroesUrl = 'https://api.mieleservice.com.mx/apitest_tickets/api/';  // URL to web api  de pruebas
  //private url: string = 'https://api.mieleservice.com.mx/apitest_tickets/'; // URL api server de pruebas
  //public url_sitio_files: string = 'https://api.mieleservice.com.mx/apitest_tickets/mieletickets/'; // URL to doctos api server de pruebas

  //public heroesUrl = 'http://18.222.118.227/api/';  // URL to web api de produccion
  //private url: string = 'http://18.222.118.227/'; // URL api server
  //public url_sitio_files: string = 'http://18.222.118.227/mieletickets'; // URL to doctos api server


  constructor(private http: HttpClient, private https: Http) { }

  getURL() {
    return this.url;
  }

  getAPI() {
    return this.heroesUrl;
  }

  login(name, pass): Observable<any> {
    ////console.log(name + pass);
    // Los envíos de información deben configurarse a mano
    // esto es fácilmente generalizable y reutilizable
    //let body = JSON.stringify(datoslogin);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    debugger;
    //let options = new RequestOptions({ headers: headers });
    // declarar la llamada y retornar el observable
    // las variables de configuración y los datos, van como parámetros
    return this.http.post(this.heroesUrl + 'Token', {
      "Username": name,
      "Password": pass
    }, { headers: headers });
  }

  loginP(name, pass, id_app): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    //let options = new RequestOptions({ headers: headers });
    // declarar la llamada y retornar el observable
    // las variables de configuración y los datos, van como parámetros
    return this.http.post(this.heroesUrl + 'Partners_Login', {
      "Username": name,
      "Password": pass,
      "id_app": id_app
    }, { headers: headers });
  }

  getCotizaciones(textolibre, fechaini, fechafin, estatus, cuenta, canal, TextoProd, Id_user, modelo, duplicadas, Id_sucursal, solicitudes, canceladas, rechazadas): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion', {
      "TextoLibre": textolibre,
      "FechaIni": fechaini,
      "FechaFin": fechafin,
      "Estatus": estatus,
      "id_Cuenta": cuenta,
      "Canal": canal,
      "TextoProd": TextoProd,
      "Id_user": Id_user,
      "modelo": modelo,
      "duplicadas": duplicadas,
      "Id_sucursal": Id_sucursal,
      "solicitudes": solicitudes,
      "canceladas": canceladas,
      "rechazadas": rechazadas
    }, { headers: headers });
  }

  ValidaServiciosActCP(objCreado: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/Validar_Servicios_Cot', objCreado, { headers: headers });
  }


  GetDireccionPorCP(cp): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/Sepomex', {
      "TextoLibre": cp
    }, { headers: headers });
  }

  GetDocumentosCotizacion(Id_cotiza, Id_Rol): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/GetDocumentosCotizacion', {
      "Id": Id_cotiza,
      "Id_Rol": Id_Rol
    }, { headers: headers });
  }

  GetProductosCotizacion(Id_cotiza): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/GetProductosCotizacion', {
      "Id": Id_cotiza
    }, { headers: headers });
  }

  GetProductosCarrito(Id_cotiza): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/GetProductosCarrito', {
      "Id": Id_cotiza
    }, { headers: headers });
  }

  GetCotizacion(Id_cotiza): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/GetCotizacion', {
      "Id": Id_cotiza
    }, { headers: headers });
  }

  GetDireccionesCliente(Id_cliente): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/Direcciones_cliente', {
      "Id": Id_cliente
    }, { headers: headers });
  }
  //validar si GetDireccionesCliente no se utiliza en otro componente ademas de edit-cliente
  GetClienteDirecciones(Id_cliente): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/Cliente_Direcciones', {
      "Id": Id_cliente
    }, { headers: headers });
  }

  GetFsicalesCliente(Id_cliente): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/fiscales_cliente', {
      "Id": Id_cliente
    }, { headers: headers });
  }

  GetMunicipios(IdEstado): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Catalogos/Municipio', {
      "Id": IdEstado
    }, { headers: headers });
  }

  Getcondiciones_pago_canal(IdUser): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/condiciones_pago_cuenta', {
      "Id": IdUser
    }, { headers: headers });
  }

  Getformas_pago_canal(IdUser): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/formas_pago_cuenta', {
      "Id": IdUser
    }, { headers: headers });
  }

  upload(fileToUpload: any): any {
    let input = new FormData();
    input.append("file", fileToUpload);

    return this.http.post(this.heroesUrl + "Partners_Cotizacion//Upload", input);
  }
  UploadImgSuc(fileToUpload: any): any {

    let input = new FormData();
    input.append("file", fileToUpload);
    debugger;
    return this.http.post(this.heroesUrl + "Servicios/UploadImgSuc", input);
  }

  get_menu_productos(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(this.heroesUrl + 'Partners_Cotizacion/get_menu', { headers: headers });
  }

  getProductosLibre(textolibre): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Productos/ProductosLibre', {
      "TextoLibre": textolibre
    }, { headers: headers });
  }

  getCargarClienteporId(Id): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/CargarClienteporId', {
      "Id": Id
    }, { headers: headers });
  }

  getCargarVendedorporId(Id): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/CargarVendedoresporId', {
      "Id": Id
    }, { headers: headers });
  }

  getCargarProductosPopulares(textolibre): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Productos/ProductosPopulares', {
      "TextoLibre": textolibre
    }, { headers: headers });
  }

  getCargarAccesoriosPopulares(textolibre): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Productos/AccesoriosPopulares', {
      "TextoLibre": textolibre
    }, { headers: headers });
  }

  getNumProdCarrito(Id_user): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/NumProdCarritoUsuario', {
      "Id_user": Id_user
    }, { headers: headers });
  }

  getCargarProducto(textolibre): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Productos/CargarProducto', {
      "TextoLibre": textolibre
    }, { headers: headers });
  }

  getCargarResultados(textolibre): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Productos/CargarResultados', {
      "TextoLibre": textolibre
    }, { headers: headers });
  }

  getCargarResultadosMenu(nivel, idNivel): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Productos/CargarResultadosMenu', {
      "Id1": nivel,
      "Id2": idNivel
    }, { headers: headers });
  }

  CallNuevoCliente(id, folio, nombre, paterno, materno, nombre_comercial, nombre_contacto, email, telefono, telefono_movil, referencias, estatus, creado, creadopor, actualizado, actualizadopor, referidopor, vigencia_ref): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/NuevoCliente', {
      "actualizado": actualizado
      , "actualizadopor": creadopor
      , "creado": creado
      , "creadopor": creadopor
      , "email": email
      , "materno": materno
      , "nombre": nombre
      , "nombre_comercial": nombre_comercial
      , "nombre_contacto": nombre_contacto
      , "paterno": paterno
      , "referencias": referencias
      , "telefono": telefono
      , "telefono_movil": telefono_movil
      , "estatus": true
      , "folio": folio
      , "referidopor": referidopor
      , "vigencia_ref": vigencia_ref

    }, { headers: headers });
  }

  CallNuevosDatosFiscales(id, nombre_fact, razon_social, rfc, email, calle_numero, cp, id_estado, id_municipio, colonia, Ext_fact, Int_fact, telefono_fact, id_cliente): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/Nuevos_fiscales', {
      "id": id
      , "nombre_fact": nombre_fact
      , "razon_social": razon_social
      , "rfc": rfc
      , "email": email
      , "calle_numero": calle_numero
      , "cp": cp
      , "id_estado": id_estado
      , "id_municipio": id_municipio
      , "colonia": colonia
      , "Ext_fact": Ext_fact
      , "Int_fact": Int_fact
      , "telefono_fact": telefono_fact
      , "id_cliente": id_cliente

    }, { headers: headers });
  }

  CallEditaDatosFiscales(id, nombre_fact, razon_social, rfc, email, calle_numero, cp, id_estado, id_municipio, colonia, Ext_fact, Int_fact, telefono_fact, id_cliente): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/edita_fiscales', {
      "id": id
      , "nombre_fact": nombre_fact
      , "razon_social": razon_social
      , "rfc": rfc
      , "email": email
      , "calle_numero": calle_numero
      , "cp": cp
      , "id_estado": id_estado
      , "id_municipio": id_municipio
      , "colonia": colonia
      , "Ext_fact": Ext_fact
      , "Int_fact": Int_fact
      , "telefono_fact": telefono_fact
      , "id_cliente": id_cliente

    }, { headers: headers });
  }

  CallEditaCondicionesEstatus(id, Estatus, id_formapago, id_condpago): Observable<any> {
    console.log("Idcotiza: " + id)
    //console.log(Estatus)
    //console.log(id_formapago)
    //console.log(id_condpago)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/edita_cotizacion_condiciones', {
      "Id": id
      , "id_formapago": id_formapago
      , "id_condpago": id_condpago
      , "Estatus": Estatus
    }, { headers: headers });
  }

  CallEditaIbs(id, ibs, correos): Observable<any> {
    console.log("Idcotiza: " + id)
    console.log(correos);
    //console.log(Estatus)
    //console.log(id_formapago)
    //console.log(id_condpago)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/edita_cotizacion_ibs', {
      "Id": id
      , "ibs": ibs,
      "correos": correos
    }, { headers: headers });
  }

  CallNuevaCotizacion(Id_Cotiza, Numero, Id_Cliente, Id_Vendedor, fecha_cotiza, Inporte, Inporte_Final, Estatus, Acciones, Id_Canal, Id_Cuenta, Id_Estado_Instalacion, Observaciones, creadopor): Observable<any> {
    let headers = new HttpHeaders();
    //console.log("*-*-*-*-*-*" + creadopor)
    // 
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/NuevaCotizacion', {
      //"Id" :  Id_Cotiza,
      "Numero": Numero,
      "Id_Cliente": Id_Cliente,
      "Id_Vendedor": Id_Vendedor,
      "fecha_cotiza": fecha_cotiza,
      "Inporte": Inporte,
      "Inporte_Final": Inporte_Final,
      "Estatus": Estatus,
      "Acciones": Acciones,
      "Id_Canal": Id_Canal,
      "Id_Cuenta": Id_Cuenta,
      "Id_Estado_Instalacion": Id_Estado_Instalacion,
      "Observaciones": Observaciones,
      "creadopor": creadopor
    }, { headers: headers });
  }

  CallNuevaDireccion(id, id_cliente, calle_numero, cp, id_estado, id_municipio, colonia, telefono, estatus, creado, creadopor, actualizado, actualizadopor, tipo_direccion, nombrecontacto, Ext, Int, telefono_movil_env, Fecha_Estimada): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/Agregar_Direccion', {
      "id": id,
      "id_cliente": id_cliente,
      "calle_numero": calle_numero,
      "cp": cp,
      "id_estado": id_estado,
      "id_municipio": id_municipio,
      "colonia": colonia,
      "telefono": telefono,
      "telefono_movil": telefono_movil_env,
      "estatus": estatus,
      "creado": creado,
      "creadopor": creadopor,
      "actualizado": actualizado,
      "actualizadopor": 35,
      "tipo_direccion": 1,
      "nombrecontacto": nombrecontacto,
      "numExt": Ext,
      "numInt": Int,
      "Fecha_Estimada": creado
    }, { headers: headers });
  }

  CallNuevoDocumento(id, Id_Cotizacion, Id_foto, tipo_docto, tipos_comp, id_forma_pago, id_user): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/agregar_documento', {
      "Id": id,
      "Id_Cotizacion": Id_Cotizacion,
      "Id_foto": Id_foto,
      "tipo_docto": tipo_docto,
      "id_tipo_tipo_pago": tipos_comp,
      "id_forma_pago": id_forma_pago,
      "id_user": id_user
    }, { headers: headers });
  }

  get_Direcciones_Cliente(Id_cliente): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/get_Direcciones_Cliente', {
      "Id": Id_cliente
    }, { headers: headers });
  }

  CrearEditarDireccionCliente(Cat_Direccion): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/crear_editar_direccion_cliente', Cat_Direccion);
  }

  EditaDireccion(id, id_cliente, calle_numero, cp, id_estado, id_municipio, colonia, telefono, estatus, creado, creadopor, actualizado, actualizadopor, tipo_direccion, nombrecontacto, Ext, Int, telefono_movil_env): Observable<any> {
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/actualizar_direccion', {
      "id": id,
      "id_cliente": id_cliente,
      "calle_numero": calle_numero,
      "cp": cp,
      "id_estado": id_estado,
      "id_municipio": id_municipio,
      "colonia": colonia,
      "telefono": telefono,
      "estatus": estatus,
      "creado": creado,
      "creadopor": creadopor,
      "actualizado": actualizado,
      "actualizadopor": actualizadopor,
      "tipo_direccion": tipo_direccion,
      "nombrecontacto": nombrecontacto,
      "numExt": Ext,
      "numInt": Int,
      "telefono_movil": telefono_movil_env,
      "Fecha_Estimada": creado
    }, { headers: headers });
  }


  CallNuevaImg(id): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/agregar_img', {
      "Id": id,
    }, { headers: headers });
  }

  CrearEditarDireccion(Cat_Direccion): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/crear_editar_direccion', Cat_Direccion);
  }

  CrearEditarDireccionesCotizacion(objDirecciones): Observable<any> {
    debugger;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/crear_editar_direcciones_cotizacion', objDirecciones);
  }

  CrearEditarDireccion_cotizacion(direccion_cotizacion): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/crear_editar_direccion_cotizacion', direccion_cotizacion);
  }


  CrearEditarCotizacion(Cat_Direccion): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/crear_editar_cotizacion', Cat_Direccion);
  }

  crear_editar_ckiente(Clientes): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/crear_editar_ckiente', Clientes);
  }


  CrearEditarFiscales(Cat_Fiscales): Observable<any> {
    // console.log(Cat_Fiscales)
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/crear_editar_fiscales', Cat_Fiscales);
  }



  AddProductoCarrito(Id, Id_Cliente, Id_P, id_usuario, fecha_creacion, cantidad_add?): Observable<any> {
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/AddProductosCarrito', {
      //"Id": Id,
      "Id_Cliente": Id_Cliente,
      "Id_Producto": Id_P,
      "id_usuario": id_usuario,
      "fecha_creacion": fecha_creacion,
      "cantidad": cantidad_add
    }, { headers: headers });
  }


  AddProductoCotiza(Id, Id_Cliente, Id_P, id_cotiza, fecha_creacion, cantidad_add): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/AddProductoCotiza', {
      //"Id": Id,
      "Id_Cliente": Id_Cliente,
      "Id_Producto": Id_P,
      "ID_Cotizacion": id_cotiza,
      "fecha_creacion": fecha_creacion,
      "cantidad": cantidad_add
    }, { headers: headers });
  }

  ActualizaCantCotizaProd(id, cant, Id_Cotizacion): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/actualizacantidadcotprod', {
      "Id": id,
      "cantidad": cant,
      "Id_Cotizacion": Id_Cotizacion
    }, { headers: headers });
  }

  ActualizaCantCarritoProd(id, cant, Id_user): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/actualizacantidadcarritoprod', {
      "Id": id
      , "cantidad": cant,
      "id_usuario": Id_user
    }, { headers: headers });
  }

  CrearEdicarSucursal(Cat_Sucursal, dir_suc): Observable<any> {
    debugger;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/crear_editar_sucursal', Cat_Sucursal, dir_suc);
  }


  CrearEdicarCuenta(cuentaObj, formPago): Observable<any> {
    debugger;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/crear_editar_cuenta', cuentaObj, formPago);
  }




  cerrarsesiones(id): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.delete(this.heroesUrl + 'Token/' + id, {});
  }

  service_catalogos(url): Observable<any> {
    //console.log(url)
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.heroesUrl + url, {});
  }

  service_general(url, parametros): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.heroesUrl + url, parametros);
  }

  service_general_get(url, parametros): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.heroesUrl + url, parametros);
  }

  registro(
    username,
    password,
    name,
    paterno,
    materno,
    email,
    avatar,
    telefono,
    telefono_movil,
    creado,
    //tecnicos
    noalmacen,
    id_tipo_tecnico,
    //Actividad
    id_actividad,
    id_cobertura,
    id_producto
  ): Observable<any> {
    ////console.log(name + pass);
    // Los envíos de información deben configurarse a mano
    // esto es fácilmente generalizable y reutilizable
    //let body = JSON.stringify(datoslogin);
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    //let options = new RequestOptions({ headers: headers });
    // declarar la llamada y retornar el observable
    // las variables de configuración y los datos, van como parámetros
    return this.http.post(this.heroesUrl + 'Registro', {
      "username": username,
      "password": password,
      "name": name,
      "paterno": paterno,
      "materno": materno,
      "fecha_nacimiento": "01/01/1900",
      "email": email,
      "avatar": avatar,
      "telefono": telefono,
      "telefono_movil": telefono_movil,
      "estatus": true,
      "creado": creado,
      "creadopor": localStorage.getItem("id"),
      "actualizado": "01/01/1900",
      "actualizadopor": 0,
      "tecnicos": [{
        "noalmacen": noalmacen,
        "id_tipo_tecnico": id_tipo_tecnico,
        "tecnicos_actividad": id_actividad,
        "tecnicos_cobertura": id_cobertura,
        "tecnicos_producto": id_producto
      }]
    });
  }

  perfilme(): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.heroesUrl + 'Registro/' + localStorage.getItem("id"), {});
  }

  recuperarpass(email): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.heroesUrl + 'CambiarPassword/' + email, {});
  }

  cambiarpass(id, passold, passnew): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.heroesUrl + 'CambiarPassword/' + id, {
      "NewPassword": passnew,
      "OldPassword": passold
    }, { headers: headers });
  }

  getToken() {
    if (localStorage.getItem("token") != "usuarios no existe" && localStorage.getItem("token") != "password incorrecto" && localStorage.getItem("token") != null) {
      return true;
    }
    return false;
  }

  verificarsesion() {
    ////console.log(localStorage.getItem("token"));
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.https.post(this.heroesUrl + 'token/token', {
      "token": localStorage.getItem("token"),
      "Fecha": ""
    }).subscribe((value) => {
      ////console.log(value.json().value.token);
      if (value.json().value.token == "") {
        localStorage.clear();
        window.location.href = "";
      }
    });
  }

  ServicioPostGeneralClients(url, parametros): Observable<any> {
    let headers = new HttpHeaders();
    console.log(parametros);
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(this.heroesUrl + 'Clients/' + url, parametros);
  }


  ServicioPostGeneral(url, parametros): Observable<any> {
    let headers = new HttpHeaders();
    console.log(parametros);
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(this.heroesUrl + 'Partners_Cotizacion/' + url, parametros);
  }

  ServicioPostGeneral_prods(url, parametros): Observable<any> {

    // console.log(parametros);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.heroesUrl + 'Partners_Productos/' + url, parametros);
  }

  ServicioPostGeneral_nuevo(url, parametros): Observable<any> {
    //debugger;
    // console.log(parametros);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(this.heroesUrl + url + parametros);
  }

  
  ServicioPostGeneral_Remoto(url, parametros): Observable<any> {
    debugger;
    // console.log(parametros);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(url + parametros);
  }

  getProducts(params?: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = (params != undefined && params.id != undefined && params.id != '' && params.id != 0) ? '/' + params.id : '';
    endpoint = 'Productos' + endpoint;
    debugger;
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  delProductsImage(prodId: number, imgId: number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    //let endpoint = (params != undefined && params.id != undefined && params.id != '' && params.id != 0) ? '/' + params.id : '';
    let endpoint = 'Productos/Image/' + prodId.toString() + "," + imgId.toString();
    debugger;
    return this.http.delete(this.heroesUrl + endpoint, {});
  }

  getMotivosMensajes(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Mensajes/Motivos';
    return this.http.get(this.heroesUrl + endpoint, { headers: headers });
  }

  postAddMensajes(mensaje): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Mensajes';
    return this.http.post(this.heroesUrl + endpoint, mensaje, { headers: headers }); // Verificar que incluya todos los parametros declrados en el back
  }

  getAgregarDireccionCotizacion(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Partners_Cotizacion/Agregar_Direccion';
    return this.http.get(this.heroesUrl + endpoint, { headers: headers });
  }

  get_detalle_marg_comerciales(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'DetalleMargenesComerciales';
    return this.http.post(this.heroesUrl + endpoint, { headers: headers });
  }

}

