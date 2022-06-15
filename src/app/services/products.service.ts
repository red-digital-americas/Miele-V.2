import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Utils } from '../utils/utils';
import { linea, producto, subLinea, subLine, rel_categoria, productos_relacionados } from '../models/producto';
import { DatosService } from '../datos.service';


@Injectable()
export class ProductsService {
  constructor(private http: HttpClient, private https: Http, private datosService: DatosService) { }

  public NPCarrito: number = 0;

  //private heroesUrl = 'http://104.130.1.18/miele/api/';  // URL to web api
  //private heroesUrl = 'http://localhost:50570/api/';  // URL to web api 
  private heroesUrl = this.datosService.getAPI() // URL to web api 



  getProducts(params?: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = (params != undefined && params.id != undefined && params.id != '' && params.id != 0) ? '/' + params.id : '';
    endpoint = 'Productos' + endpoint;
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  getAllProducts(params?: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = (params != undefined && params.id != undefined && params.id != '' && params.id != 0) ? '/' + params.id : '';
    endpoint = 'Productos/GetAllProducts' + endpoint;
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  /**
   * Functiona that make a search of products with given parameters
   * @param params 
   */
  searchProducts(params: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let p: any = {};


    p.text = Utils.getValue(params.text, 'string');
    p.id_categoria = Utils.getValue(params.tipo, 0); // change to tipo 
    p.id_linea = Utils.getValue(params.lineID, 0);
    p.id_sublinea = Utils.getValue(params.subLineID, 0);

    if (Utils.isDefined(params.status))
      p.estatus = Utils.getValue(params.status, 0);

    let endpoint = 'Productos/Search';
    return this.http.post(this.heroesUrl + endpoint, { "text": p.text, "id_categoria": p.id_categoria, "id_linea": p.id_linea, "id_sublinea": p.id_sublinea, "estatus": true });
  }


  getLines(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'ProductLines'
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  /**
   * Get sublines by ID
   * @param id 
   */
  getSubLines(id): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'ProductSubLines/ProductLine/' + id;
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  get_car_base(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Partners_Productos/CaracteristicaBase';
    return this.http.get(this.heroesUrl + endpoint, {});
  }


  /**
   * Get all categories¡
   */
  getCategories(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'ProductCategories';
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  /**
   * Functioan that adds a new line
   * @param line the line name
   */

  addLine(line: linea): Observable<any> {
    if (Utils.isDefined(line.descripcion) && Utils.isDefined(line.id_categoria)) {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');

      let params = {
        "id_categoria": line.id_categoria,
        "descripcion": line.descripcion,
        "estatus": true
      }

      let endpoint = 'ProductLines';
      return this.http.post(this.heroesUrl + endpoint, params);
    }
    return Observable.of(false);
  }

  /**
   * Functioan that adds a new subline
   * @param subline the line name
   */

  addSubLine(subline: subLinea): Observable<any> {

    if (Utils.isDefined(subline.descripcion) && Utils.isDefined(subline.lineaID)) {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');

      let params = {
        "id_linea_producto": subline.lineaID,
        "descripcion": subline.descripcion,
        "estatus": true
      }

      let endpoint = 'ProductSubLines';
      return this.http.post(this.heroesUrl + endpoint, params);
    }
    return Observable.of(false);
  }

  saveProduct(prod: producto, rel: productos_relacionados[]): Observable<any> {

    if (!Utils.isEmpty(prod)) {
      console.log(prod);
      let params = this.prepareData(prod, rel);

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      let endpoint = 'Productos/Create';

      //return Observable.of(true);
      return this.http.post(this.heroesUrl + endpoint, params);

    }
  }
  /**
   * Function that updates a given product
   * @param prod product object 
   */
  updateProduct(prod: producto, rel: productos_relacionados[]): Observable<any> {
    if (!Utils.isEmpty(prod) && Utils.getValue(prod.id, 0) !== 0) {
      let params = this.prepareData(prod, rel);
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      let endpoint = 'Productos/' + prod.id;
      //return Observable.of(true);
      return this.http.put(this.heroesUrl + endpoint, params);

    }
  }


  prepareData(prod: producto, rel: productos_relacionados[]) {
    let prodObj = {};
    if (!Utils.isEmpty(prod)) {
      prodObj = {
        "sku": Utils.getValue(prod.sku, ''),
        "no_serie": "string",
        "modelo": Utils.getValue(prod.modelo, ''),
        "nombre": Utils.getValue(prod.nombre, ''),
        "descripcion_corta": Utils.getValue(prod.descripcion, ''),
        "descripcion_larga": Utils.getValue(prod.descripcionLarga, ''),
        "atributos": Utils.getValue(prod.atributos, ''),
        "precio_sin_iva": Utils.getValue(prod.precio, 0),
        "precio_con_iva": Utils.getValue(prod.precioIVA, 0),
        "id_categoria": 1,
        "id_linea": Utils.getValue(prod.lienaID, 0),
        "id_sublinea": Utils.getValue(prod.subLineaID, 0),
        "id_caracteristica_base": Utils.getValue(prod.caracteristicaBId, 0),
        "ficha_tecnica": Utils.getValue(prod.fichaTecnica, 0),
        "horas_tecnico": 0,
        "no_tecnico": 0,
        "precio_hora": Utils.getValue(prod.precioHora, 0),
        "estatus": Utils.getValue(prod.status, true),
        "tipo": Utils.getValue(prod.tipoID, 0),
        "url_guia": Utils.getValue(prod.guiaURL, ''),
        "url_manual": Utils.getValue(prod.manualURL, ''),
        "url_impresion": Utils.getValue(prod.impresionURL, ''),
        "requiere_instalacion": Utils.getValue(prod.instalacion, false),
        "visible_partners": Utils.getValue(prod.visiblePartners, false),
        "cat_imagenes_producto": Utils.getValue(prod.imagenes, [{ "url": "string", "estatus": true }]),
        "relacionados": rel
      }
    }
    console.log(prodObj);
    return prodObj;
  }

  public ecategoria = new rel_categoria();

  getSubLineById(id): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Sublinea_Producto/' + id;
    return this.http.get(this.heroesUrl + endpoint, {});
  }


  saveSubLine(item: subLine): Observable<any> {

    if (!Utils.isEmpty(item)) {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      let endpoint = 'Sublinea_Producto';

      //return Observable.of(true);
      return this.http.post(this.heroesUrl + endpoint, item, { headers: headers });

    }
  }

  UpdateSubLine(item: subLine): Observable<any> {

    if (!Utils.isEmpty(item)) {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      let endpoint = 'Sublinea_Producto/' + item.id;

      //return Observable.of(true);
      return this.http.put(this.heroesUrl + endpoint, item, { headers: headers });

    }
  }

  getAllSubLines(params?: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Sublinea_Producto';
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  getSubLineasHomeProgram(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Partners_Productos/getSubineasHomeProgram';
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  getSubLineasCertificados(params?: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Partners_Productos/getLineasCertificados';
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  getProductosCertificado(lista: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Partners_Productos/get_productos_certificado';
    return this.http.post(this.heroesUrl + endpoint, lista);
  }

  saveProductosCertificado(lista: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Partners_Productos/save_productos_certificado';
    return this.http.post(this.heroesUrl + endpoint, lista);
  }

  searchSubLines(params: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let p: any = {};


    p.text = Utils.getValue(params.text, 'string');
    p.id_linea_producto = Utils.getValue(params.lineID, 0);


    let endpoint = 'Sublinea_Producto/Search';
    return this.http.post(this.heroesUrl + endpoint, { "text": p.text, "id_linea_producto": p.id_linea_producto, "estatus": true });
  }

  getTypeServices(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Catalogos/TipoServicio';
    return this.http.get(this.heroesUrl + endpoint, {});
  }

  getPlantilla(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    let endpoint = 'Productos/Download_xls';
    return this.http.get(this.heroesUrl + endpoint, {});
  }
}

