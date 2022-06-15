import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Utils } from '../utils/utils'; 
import { Clientes } from '../models/cotizacion';
import { DatosService } from '../datos.service';


@Injectable()
export class ClientesService {
    constructor(private http: HttpClient, private https: Http, private datosService:DatosService) { }

    private apiURL =  this.datosService.getAPI() // 

    public getClientes(params):Observable<any>{
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      let endpoint = 'Clients';
      debugger; 
        return this.http.get(this.apiURL  + endpoint, {});
  }


    /**
     * Functiont that get a client by the given ID
     * @param id The Client ID
     */
    public getCliente(id):Observable<any>{
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        let endpoint = 'Clients/'+id;
        return this.http.get(this.apiURL  + endpoint, {});
    }
    
    /**
     * Functiont that get orders of client by the given ID
     * @param id The Client ID
     */
    public getClientOrders(id):Observable<any>{
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        let endpoint = 'Clients/'+id+'/Estimates';
        return this.http.get(this.apiURL  + endpoint, {});
    }
    
    /**
     * Functiont that get updates the client Informatioj
     * @param client The Client Object
     */
    public updateClient(client:any):Observable<any>{
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        let endpoint = 'Clients/'+client.id;
        return this.http.put(this.apiURL  + endpoint, client);
    }
    
    /**
     * Functiont that creates a new client
     * @param client The Client Object
     */
    public createClient(client):Observable<any>{
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        let endpoint = 'Clients';

        return this.http.post(this.apiURL  + endpoint, client);
    }
    
    
    /**
     * Functiont that renew vigencia
     * @param id The Client Object
     */
    public renovarVigencia(id):Observable<any>{
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        let endpoint = '/Clients/UpdateRefExpiration/'+id;

        return this.http.get(this.apiURL  + endpoint, {});
    }

   

    /**
   * Functiona that make a search of products with given parameters
   * @param params 
   */
    searchClient(params:any): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        let p:any = {};

    
        p.text = Utils.getValue(params.text, '');
        p.id_sucursal = Utils.getValue(params.sucursal, 0); // change to tipo 
        p.id_account = Utils.getValue(params.account, 0);
        p.id_channel = Utils.getValue(params.chanel, 0);
        
        //if(Utils.isDefined(params.status))
        //p.estatus = Utils.getValue(params.status, 0);
    
        let endpoint = 'Clients/Search';
        //return this.http.post(this.apiURL  + endpoint, {"text": p.text,"id_categoria": p.id_categoria,"id_linea": p.id_linea,"id_sublinea": p.id_sublinea,"estatus": true});
        return this.http.post(this.apiURL  + endpoint, p);
    }




}
