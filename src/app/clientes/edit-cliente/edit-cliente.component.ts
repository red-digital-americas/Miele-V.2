import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DatosService } from '../../datos.service';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { producto, linea, categoria, subLinea } from '../../models/producto';
import { Utils } from '../../utils/utils';
import { FormControl } from '@angular/forms';
import {Overlay} from '@angular/cdk/overlay';
import { Clientes } from '../../models/cotizacion';
import { Direccion } from '../../models/clientes';
import { ClientesService } from '../../services/clientes.service';
import { utils } from 'protractor';


@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClientComponent implements OnInit {
    @ViewChild('paginator') paginator: MatPaginator

    public body: HTMLBodyElement = document.getElementsByTagName('body')[0];
    
    public clientId:number = 0;
    public client: Clientes = new Clientes;
    public dir:Direccion[]=[];
    public dirDetails = [];
    public permisos:any = {deshabilitar_dir_ins:false};
    public date_ins:any[] = []
    public idCanal:number = 0;
    public idUser:number = 0;
    public dataSource = new MatTableDataSource<any>([]);
    public displayedColumns = ['folio','cuenta','sucursal','fecha','vendedor','importe','estatus_desc'];
    public columNames:Object = {'folio':'Folio','cuenta':'Cuenta','sucursal':"Sucursal",'fecha':'Fecha',"vendedor":"Vendedor","importe":"Importe",'estatus_desc':'Status'}
    public refered = false;
    // Constantes
    public mask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    public mask09 = [/[0-9]/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    public maskcp = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
    public prefijosCalle: any[] = [{ "id": 1, "prefijo": "Calzada" }, { "id": 2, "prefijo": "Avenida" }, { "id": 3, "prefijo": "Boulevard" }, { "id": 4, "prefijo": "Cerrada" }, { "id": 5, "prefijo": "Calle" }];
    public prefijosDir = ['Avenida', 'Av.', 'boulevard', 'Boulevard', 'Blvr', 'Blvr', 'Calzada', 'Calz.', 'avenida', 'av.', 'Calle', 'calle'];
    public Calle_ins_valido = true;
  public sucursal: string = "";
  desa: boolean = true;
  user_session: any;


    constructor(private route: ActivatedRoute,
                private clientService:ClientesService,
                private datosService:DatosService,
                public snackBar: MatSnackBar,
                public matDatepicker: MatDatepickerModule,
                private router:Router){}

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.user_session = JSON.parse(localStorage.getItem("user"));
      this.date_ins[0] = new FormControl(new Date());
      this.date_ins[1] = new FormControl(new Date());

      this.aplicar_estilos();
      this.validar_permisos();

      this.getClient();

      this.dir[0] = new Direccion;
      this.dir[0].tipo_direccion = 2;

      this.dir[1] = new Direccion;
      this.dir[1].tipo_direccion = 1;



      this.idCanal = parseInt(localStorage.getItem('id_canal'));
      this.idUser = parseInt(localStorage.getItem('id'));
    }
  }

  validar_permisos() {
    if (this.user_session.rol == 1 || this.user_session.rol == 10004 )
      this.desa = false;
    else {
      this.desa = true; 
    }
  }



    aplicar_estilos() {
        this.body.classList.add('skin-blue');
        this.body.classList.add('sidebar-mini');
    }
    
    /**
     * Function that get the cliente iformation
     */

    getClient() {
      // debugger;
      //var creadoobj = { TextoLibre: "", tipo_entidad: this.tipos };
      let urlParams = this.route.params.subscribe(params => { this.clientId = params['id']; });
      if (this.clientId > 0) {
  
          this.clientService.getCliente(this.clientId).subscribe((p) => {
              
              if (p != undefined) {
                //this.client.id_sucursal =
                this.client.nombre = Utils.getValue(p.nombre, "");
                this.client.id = Utils.getValue(p.id, "");
                this.client.paterno = Utils.getValue(p.paterno, "");
                this.client.materno = Utils.getValue(p.materno, "");
                this.client.email = Utils.getValue(p.email, "");
                this.client.telefono = Utils.getValue(p.telefono, "");
                this.client.telefono_movil =  Utils.getValue(p.telefono_movil, "");
                this.client.referidopor = Utils.getValue(p.referidopor, "");
                this.client.actualizadopor = Utils.getValue(p.actualizadopor, "");
                this.client.id_sucursal =  Utils.getValue(p.id_sucursal, "");
                
                this.sucursal =  Utils.getValue(p.sucursal, "");

                this.getClientOrders(this.clientId);
                debugger;
                //Get Directions 
                this.datosService.get_Direcciones_Cliente(this.clientId).subscribe((p) => {
                  if (p.resultado == 'Success' && Utils.isDefined(p.item)) {
                    debugger;
                    for (let d of p.item) {
                      var i = -1;
                      if (Utils.getValue(d.tipo_direccion, 0) == 2) {
                        i = 0;
                        //0 para envio
                      }
                      else if (Utils.getValue(d.tipo_direccion, 0) == 1) {
                        i = 1;
                        //1 para instalacion
                      }
                      if (i >= 0) {
                        this.dir[i] = {

                          calle: Utils.getValue(d.calle, ''),
                          colonia: Utils.getValue(d.colonia, ''),
                          cp: Utils.getValue(d.cp, 0),
                          fecha_Estimada: Utils.getValue(d.fecha_Estimada, ''),
                          id: Utils.getValue(d.id, '0'),
                          id_estado: Utils.getValue(d.id_estado, 0),
                          id_localidad: Utils.getValue(d.id_localidad, 0),
                          id_municipio: Utils.getValue(d.id_municipio, 0),
                          id_prefijo_calle: Utils.getValue(d.id_prefijo_calle, 0),
                          nombre: Utils.getValue(d.nombre, ''),
                          numExt: Utils.getValue(d.numExt, ''),
                          numInt: Utils.getValue(d.numInt, ''),
                          telefono: Utils.getValue(d.telefono, ''),
                          telefono_movil: Utils.getValue(d.telefono_movil, ''),
                          tipo_direccion: d.tipo_direccion
                        }

                        this.date_ins[i] = new FormControl(new Date(this.dir[i].fecha_Estimada));

                      }

                      if (!Utils.isEmpty(d.cp))
                        this.getDirByCP(d.cp, i);
                    }
                  }
                });

              }else{
                console.log("Cliente - Ocurrio un error al cargar el cliente: " + p.detalle);
              }
              
          });
        }else{
            this.client.referidopor = this.idCanal === 3 ? this.idUser : 0; 
        }
      }


  public getDirByCP(cp: string, assign, update?) {
    if (!Utils.isDefined(cp) || (Utils.isDefined(cp) && cp.length !== 5))
      return;
    debugger;
    this.datosService.GetDireccionPorCP(cp).subscribe((r) => {
         let dir: any = {};

         if (Utils.isDefined(r.resultado) && r.resultado == "Success" && Utils.isDefined(r._item)) {
           let d = r._item;
           dir.estado = [{ estado: Utils.getValue(d[0].estado, ''), id: d[0].id_estado }];
           dir.localidades = Utils.getValue(d[0].localidades, [])
           dir.municipios = Utils.getValue(d[0].municipios, [])

           if (update === true) {

             this.dir[parseInt(assign)].id_estado = Utils.getValue(d[0].id_estado, 0);
             this.dir[parseInt(assign)].id_localidad = Utils.getValue(dir.localidades[0].id_localidad, 0);
             this.dir[parseInt(assign)].id_municipio = Utils.getValue(dir.municipios[0].id_municipio, 0);
           }
         } else {

           this.openSnackBar('No hay concidencias para el código postal capturado.');
           //this.limpiarInstalacion();

         }


         this.dir[parseInt(assign)].details = dir;


     });
   }

      openSnackBar(message:string, action = '') {
        this.snackBar.open(message, action, {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      }
      /**
       * Get the client orders
       * @param clientID the id of the client
       */

      public getClientOrders(clientID){
          this.clientService.getClientOrders(clientID).subscribe((r)=>{

              if(!Utils.isEmpty(r)){
                this.dataSource = new MatTableDataSource<any>(r);
                this.dataSource.paginator = this.paginator;
              }
          })
      }

  
      public validar_prefijos(text: any) {
        //console.log("texto: " + text)
        for (var prefijo of this.prefijosDir) {
          // console.log("antes: " + prefijo)
          if (text == prefijo) {
            this.Calle_ins_valido = false;
            //  console.log("encontrado: " + prefijo)
            break;
          }
          else {
            this.Calle_ins_valido = true;
          }
        }
        //return this.Calle_ins_valido = true;
      }
      
      /**
       * function that save the changes on a client
       * @param redirect 
       */

  public saveChanges(isValid: boolean) {
        //redirect = Utils.getValue(redirect, true);
        //console.log(this.prepareDir(this.dir[0]))
        //console.log(this.prepareDir(this.dir[1]));
    
    if (isValid) {
      if (this.clientId == 0) {
        //console.log(this.prepareDir(this.dir[0]))
        //console.log(this.prepareDir(this.dir[1]))
        this.clientService.createClient(this.prepareNewClient(this.client)).subscribe((r) => {
          debugger;
          if (!Utils.isEmpty(r) && Utils.isDefined(r.id)) {
            this.clientId = r.id;
            this.datosService.CrearEditarDireccionCliente(this.prepareDir(this.dir[0])).subscribe((r) => {

              this.datosService.CrearEditarDireccionCliente(this.prepareDir(this.dir[1])).subscribe((r) => {

                if (!Utils.isEmpty(r) && r.result == 'Success') {
                  debugger;
                  this.router.navigate(['/clientes']);
                  return true;


                }
              })
            })
          }
        });
      } else {

        this.clientService.updateClient(this.client).subscribe((r) => {
          if (!Utils.isEmpty(r) && Utils.isDefined(r.id)) {

            this.datosService.CrearEditarDireccionCliente(this.prepareDir(this.dir[0])).subscribe((r) => {

              if (!Utils.isEmpty(r) && r.result == 'Success') {
                this.datosService.CrearEditarDireccionCliente(this.prepareDir(this.dir[1])).subscribe((r) => {

                  if (!Utils.isEmpty(r) && r.result == 'Success') {
                    this.router.navigate(['/clientes']);
                    return true;
                  }
                })
              }
            })
          } else {
            return false;
          }
        });
      }
    }
    else {
      this.openSnackBar('Es necesario llenar todos los campos');
    }
  }

    /**
     * Change the referido stante
     * @param event 
     */
    public referir(e){
      
        if( e.checked && this.idCanal == 3 ){
            this.client.referidopor =  this.idUser;
            this.refered = true;
        } else{
            this.client.referidopor =  0;
            this.refered = false;
        }
        
    }

    /**
     * Function that duplicate the direction
     * @param event the event of the checkbox 
     */
    public copiarDireccion(e){
      if( e!= null ){
        //this.dir[1] = this.dir[0];
        debugger;
        var idt = 0;
        if(Utils.isDefined(this.dir[1].id))
          idt = this.dir[1].id;
          
        this.dir[1] = JSON.parse(JSON.stringify(this.dir[0]));
        this.dir[1].tipo_direccion = 1;

        this.date_ins[1] =  new FormControl(new Date(this.dir[1].fecha_Estimada));

        if(idt != 0)
          this.dir[1].id=idt
      }
    }

    public prepareDir(dir:Direccion){
      //console.log(dir);
      let d:any =  {
        calle_numero: Utils.getValue(dir.calle,''),
        colonia: Utils.getValue(dir.colonia, ""),
        cp: Utils.getValue(dir.cp,""),
        fecha_Estimada: Utils.getValue(dir.fecha_Estimada,""),
        id_cliente: parseInt(Utils.getValue(this.clientId,0)),
        id_estado: Utils.getValue(dir.id_estado,0),
        id_localidad: Utils.getValue(dir.id_localidad,0),
        id_municipio: Utils.getValue(dir.id_municipio,0),
        id_prefijo_calle: Utils.getValue(dir.id_prefijo_calle,0),
        nombrecontacto: Utils.getValue(dir.nombre,0),
        numExt: Utils.getValue(dir.numExt,''),
        numInt: Utils.getValue(dir.numInt,''),
        prefijo_ins: Utils.getValue(dir.prefijo_ins,''),
        telefono: Utils.getValue(dir.telefono,''),
        telefono_movil: Utils.getValue(dir.telefono_movil,''),
        tipo_direccion: dir.tipo_direccion
      }

      if(Utils.isDefined(dir.id))
        d.id = dir.id;
        
      return d;
  }

   /**
     * Function that validates and format the client information before the update
     * @param client 
     */
  private prepareNewClient(client){
    return {
        "nombre": client.nombre,
        "paterno": client.paterno,
        "materno": client.materno,
        "email": client.email,
        "telefono": client.telefono,
        "telefono_movil": client.telefono_movil,
        "referidopor": this.refered && this.idCanal == 3 ? this.idUser : 0,
        "creadopor": this.idUser
      }
  }


  public asignarFecha_ins(t) {
    this.dir[t].fecha_Estimada = (this.date_ins[t].value.getMonth() + 1) + '/' + this.date_ins[t].value.getDate() + '/' + this.date_ins[t].value.getFullYear();
  }
  
  public editCotizacion(id?: number) {
    this.router.navigate(['/detallecotizacion/'+id]);
  }

  public goBack(){
    this.router.navigate(['/clientes']);
  }
}
