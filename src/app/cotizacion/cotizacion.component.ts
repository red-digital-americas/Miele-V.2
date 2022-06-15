import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { TextMaskModule } from 'angular2-text-mask';
import { Cat_Direccion, Direccion_Cotizacion } from '../models/cotizacion';
import { Cotizaciones } from '../models/cotizacion';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  ////////////////VARIABLES  /////////////////////

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  mostrarReferencia: boolean = false;
  public mask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public maskcp = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  prefijos_calle: any[] = [{ "id": 1, "prefijo": "Calzada" }, { "id": 2, "prefijo": "Avenida" }, { "id": 3, "prefijo": "Boulevard" }, { "id": 4, "prefijo": "Cerrada" }, { "id": 5, "prefijo": "Calle" }];

  preventAbuse = false;

  // Cliente
  id: string = "";
  folio: string = "";
  nombre: string = "";
  paterno: string = "";
  materno: string = "";
  nombre_comercial: string = "";
  nombre_contacto: string = "";
  email: string = "";
  telefono: string = "";
  telefono_movil: string = "";
  referencias: string = "";
  estatus: boolean = true;
  creado: string = moment().format("MM/DD/YYYY");
  creadopor: string = "";
  actualizado: string = moment().format("MM/DD/YYYY");
  actualizadopor: string = "";
  Id_Estado_Instalacion: string = "";
  referidopor: string = "0";
  vigencia_ref: string = moment().add(6, 'M').format("MM/DD/YYYY");
  text_busqueda: string = "";
  displayedColumns = ['nombre', 'referidopor', 'vigencia', 'email', 'telefono', 'celular', 'fecha'];
  dataSource = new MatTableDataSource();
  deshabilita: boolean;
  // Direccion Instalacion 
  dir_ins = new Cat_Direccion();
  dir_cot = new Direccion_Cotizacion();
  cotizaobj = new Cotizaciones();


  estados: any[] = [];
  Municipios_Ins: any[] = [];
  Localidades_Ins: any[] = [];

  es_referido: false;
  captura_direc: false;
  deshabilitains: boolean = true;
  ValActiva: string = "0";
  lineas_cert: any[] = [];
  Productos: any[] = [];

  // Cotiza
  Id_Cotiza: string = "";
  Numero: string = "";
  Id_Cliente: string = "1";
  Id_Vendedor: string = "4";
  fecha_cotiza: string = moment().format("MM/DD/YYYY");
  Inporte: string = "1";
  Inporte_Final: string = "1";
  Estatus: string = "1";
  Acciones: string = "0";
  Id_Canal: number = parseInt(localStorage.getItem("id_canal"));
  Id_Cuenta: string = "1";
  Observaciones: string = "";
  animal: string;
  name: string;
  id_find_cliente: number;

  // Vendedor
  AmaternoVen: string;
  TextoVendendor: string;
  IdVende_: string = "";
  IdVende_Ref: string = "0";
  id_suc_ven: number = 0;

  // Variables de Resultado
  message: {};
  TextoLibre: string = "";
  VendedorDatos: any[] = [];
  filteredOptions: Observable<any[]>;


  Vendedores: any[] = [];
  Sucursales: any[] = [];
  myControl: FormControl = new FormControl();
  NombreCompleto_: string = "";
  rol_user: string = "7"; //Es el usuario de Ventas de Kitchen Studio 

  constructor(private heroService: DatosService, private productService: ProductsService, private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog) { }

  // funciones nativas de la clase //

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      //console.log(this.Id_Canal);
      this.body.classList.add('skin-blue');
      this.body.classList.add('sidebar-mini');
      this.creadopor = JSON.parse(localStorage.getItem("user")).id;
      this.rol_user = JSON.parse(localStorage.getItem("user")).rol;
      this.Id_Vendedor = "4";

      this.dir_ins.tipo_direccion = 1;
      this.dir_ins.fecha_Estimada = moment().format("MM/DD/YYYY");
      this.dir_ins.id = 0;
      this.dir_ins.colonia = "";
      this.dir_ins.actualizado = moment().format("MM/DD/YYYY");
      this.dir_ins.actualizadopor = parseInt(this.creadopor);
      this.dir_ins.creado = moment().format("MM/DD/YYYY");
      this.dir_ins.creadopor = parseInt(this.creadopor);

      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(val => this.filter(val))
        );
      //this.getCat_vendedores();
      this.getSucursales_Usuario();
      //this.IdVende_ = this.creadopor;
      this.dir_ins.id_prefijo_calle = 5;
      this.ver = true;
      this.id_find_cliente = 0;

    }
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Funciones de Acceso a Datos //

  //getCat_vendedores(): void {
  //  var creadoobj = { TextoLibre: this.creadopor };
  //  this.heroService.ServicioPostGeneral("usuarios_por_cuenta", creadoobj)
  //    .subscribe((value) => {
  //      this.Vendedores = value;
  //    });
  //}

  getSucursales_Usuario(): void {
    var creadoobj = { TextoLibre: this.creadopor };
    this.heroService.ServicioPostGeneral("sucursales_por_usuario", creadoobj)
      .subscribe((value) => {
        if (value != undefined) {
          this.Sucursales = value;
        }
      });
  }

  getVendedoresSuc() {
    var creadoobj = { Id: this.id_suc_ven };
    this.heroService.ServicioPostGeneral("get_usuarios_suc", creadoobj)
      .subscribe((value) => {
        debugger;
        if (value != undefined) {
          this.Vendedores = value;
          if (value.length == 0) {
            this.IdVende_ = "";
            this.openSnackBar('No hay vendedores asociados');
          }
        }
      });
  }

  filter(val: string) {
    return this.Vendedores.filter(option =>
      option.nombre.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  public CallCrearEditardireccion() {
    this.heroService.CrearEditarDireccion(this.dir_ins)
      .subscribe((value) => {
        debugger;
        switch (value.result) {
          case "Error":
            this.message = "Ocurrio un error al guardar la dirección";
            console.log(this.message);
            break;
          default:
            if (value.result == "Success") {
              this.CallNuevaCotizacion(this.dir_ins.id_cliente.toString());
            }
        }
      });
  }

  public CallNuevaCotizacion(Id_Cli: string) {
    this.cotizaobj.Id = 0;
    this.cotizaobj.Numero = this.Numero;
    this.cotizaobj.Id_Cliente = Id_Cli;
    this.cotizaobj.Id_Vendedor = this.IdVende_;
    this.cotizaobj.fecha_cotiza = this.fecha_cotiza;
    this.cotizaobj.Inporte = this.Inporte;
    this.cotizaobj.Inporte_Final = this.Inporte_Final;
    this.cotizaobj.Estatus = 1;
    this.cotizaobj.Acciones = 0;
    this.cotizaobj.Id_Estado_Instalacion = 0;
    this.cotizaobj.Observaciones = this.Observaciones;
    this.cotizaobj.creadopor = parseInt(this.creadopor);
    this.heroService.ServicioPostGeneral("NuevaCotizacion", this.cotizaobj)
      .subscribe((value) => {
        debugger;
        switch (value.value.response) {
          case "Error":
            console.log("Ocurrio un error al guardar la cotización");
            break;
          default:
            console.log(value.value.response);
            if (value.value.response == "Success") {
              if (this.id_find_cliente > 0) {
                this.CallConsultaDirecciones_cliente(this.id_find_cliente, value.value.id);
              }
              else if (this.captura_direc) {
                this.dir_cot.cp = this.dir_ins.cp;
                this.dir_cot.id_estado = this.dir_ins.id_estado;
                this.dir_cot.id_municipio = this.dir_ins.id_municipio;
                this.dir_cot.id_localidad = this.dir_ins.id_localidad;
                this.dir_cot.id_prefijo_calle = this.dir_ins.id_prefijo_calle;
                this.dir_cot.calle_numero = this.dir_ins.calle_numero;
                this.dir_cot.numExt = this.dir_ins.numExt;
                this.dir_cot.numInt = this.dir_ins.numInt;
                this.dir_cot.nombrecontacto = this.dir_ins.nombrecontacto;
                this.dir_cot.telefono = this.dir_ins.telefono;
                this.dir_cot.telefono_movil = this.dir_ins.telefono_movil;
                this.dir_cot.tipo_direccion = this.dir_ins.tipo_direccion;
                this.dir_cot.creado = this.dir_ins.creado;
                this.dir_cot.id_cotizacion = value.value.id;
                this.CallCrearEditardireccion_Cotizacion(this.dir_cot, true);
              }
              else {
                this.openDialog();
              }
            }
        }
      });
  }

  public CallConsultaDirecciones_cliente(id_cte: number, id_cotiza: number) {
    this.heroService.GetClienteDirecciones(id_cte).subscribe((p) => {
      if (p.resultado == 'Success' && p.item != undefined) {
        debugger;
        var i = 0;
        for (let d of p.item) {
          i += 1;
          this.dir_cot.cp = d.cp;
          this.dir_cot.id_estado = d.id_estado;
          this.dir_cot.id_municipio = d.id_municipio;
          this.dir_cot.id_localidad = d.id_localidad;
          this.dir_cot.id_prefijo_calle = d.id_prefijo_calle;
          this.dir_cot.calle_numero = d.calle;
          this.dir_cot.numExt = d.numExt;
          this.dir_cot.numInt = d.numInt;
          this.dir_cot.nombrecontacto = d.nombre;
          this.dir_cot.telefono = d.telefono;
          this.dir_cot.telefono_movil = d.telefono_movil;
          this.dir_cot.tipo_direccion = d.tipo_direccion;
          this.dir_cot.creado = d.creado;
          this.dir_cot.id_cotizacion = id_cotiza;
          this.CallCrearEditardireccion_Cotizacion(this.dir_cot, (p.item.length == i ? true: false));
        }
        //this.openDialog();
      }
    });

  }

  public CallCrearEditardireccion_Cotizacion(dir_cotiza: Direccion_Cotizacion, muestra_popup: boolean) {

    this.heroService.CrearEditarDireccion_cotizacion(dir_cotiza)
      .subscribe((value) => {
        debugger;
        switch (value.response) {
          case "Error":
            this.message = "Ocurrio un error al guardar la dirección";
            console.log(this.message);
            break;
          default:
            if (value.response == "Success") {
              console.log(value.detalle);
              if (muestra_popup) this.openDialog();
            }
        }
      });
  }

  Guardar(isValid: boolean) {
    debugger;
    var dsss = this.dir_ins;
    if (this.id_find_cliente == 0) {
      this.CallNuevoCliente(isValid)
    }
    else {
      this.CallNuevaCotizacion(this.id_find_cliente.toString());
    }
  }

  CallNuevoCliente(isValid: boolean) {
    if (isValid) {
      if (this.es_referido)
        this.referidopor = this.IdVende_;
      
      this.heroService.CallNuevoCliente(this.id, this.folio, this.nombre, this.paterno, this.materno, this.nombre_comercial, this.nombre_contacto, this.email, this.telefono, this.telefono_movil, this.referencias, this.estatus, this.creado, this.creadopor, this.actualizado, this.creadopor, this.referidopor, this.vigencia_ref)
        .subscribe((value) => {
          debugger;
          switch (value.value.response) {
            case "Error":
              this.message = "Ocurrio un error al guardar el Cliente";
              break;
            default:
              if (value.value.response == "Success") {
                if (this.captura_direc) {
                  this.dir_ins.id_cliente = value.value.id;
                  this.CallCrearEditardireccion();
                }
                else {
                  this.CallNuevaCotizacion(value.value.id);
                }
              }
          }
        });
    } else {
      this.ValActiva = "1";
    }
  }

  getCat_estados(): void {
    this.heroService.service_catalogos("Catalogos/Estados")
      .subscribe((value) => {
        this.estados = value;
      });
  }

  openCambioDir(casos: number): void {
    let dialogCambioDir = this.dialog.open(DialogCambioDir, {
      width: '500px',
      height: '300px',

      data: { cp: this.dir_ins.cp }
    });

    dialogCambioDir.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.actSer) {
          console.log("Ejecutar actualizacion de servicios");
          if (casos == 0 || casos == 2) {
            var creado = { "TextoLibre": this.dir_ins.cp };
            this.heroService.ServicioPostGeneral_prods("ConsultaHPbyCp", creado).subscribe((value) => {
              if (value.result == "Success") {
                if (value.item != null) {
                  this.GuardarServicios(casos, value.item.id);
                }
              }
            });
          }
          else {
            this.GuardarServicios(casos, 0);
          }
        }
      }
      else {
        this.dir_ins.cp = "";
        this.limpiarInstalacion();
        console.log("Cancelado sin accion")
      }
    });
  }

  GuardarServicios(addSer: number, id: number) {
    debugger;
    //addServ puede traer 3 valores, 0 agrega home Program, 1 agrega certificados y dosagrega ambos
    if (addSer == 0) {
      if (id > 0) {
        this.GuardarHomeP(id);
      }
    }
    else {
      //buscar productos del carrito
      this.heroService.GetProductosCarrito(this.creadopor).subscribe(response => {
        if (response != undefined) {
          if (response.token == "Success") {
            this.Productos = response.item[0].productos;
            this.Productos.forEach(item => {

              if (item.id != 388 && item.id_linea != 36 && item.id_linea != 38 && !item.es_regalo) {
                var encuentra = this.lineas_cert.findIndex(lc => lc.id == item.id_sublinea);

                if (encuentra >= 0)
                  this.lineas_cert[encuentra].cantidad += item.cantidad;
                else
                  this.lineas_cert.push({ id: item.id_sublinea, cantidad: item.cantidad });
              }
            });
          }
        }
      });
          
      var cer_prod: any = { cp: this.dir_ins.cp, cotizacion_id: 0, id_usuario: this.creadopor, lista_sublineas: this.lineas_cert };

      this.productService.saveProductosCertificado(cer_prod).subscribe((value) => {
        debugger;
        this.preventAbuse = false;
        switch (value.token) {
          case "Error":
            break;
          default:
            if (value.token == "Success") {
              this.msjDialog("Certificado agregado correctamente");
              if (addSer == 2) {
                //this.GetProductosCarrito(false);
                this.GuardarHomeP(id);
              }
            }
        }
      });


    }
  }

  msjDialog(message: string, action = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });
  }

  GuardarHomeP(id: number) {
    this.heroService.AddProductoCarrito(0, 0, id, this.creadopor, moment().format("MM/DD/YYYY"), 1)
      .subscribe((value) => {
        debugger;
        switch (value.value.response) {
          case "Error":
            break;
          default:
            if (value.value.response == "Success") {
              this.msjDialog("Home Program Agregado correctamente");
            }

        }
      });
  }

  ValidarServicios() {
    let creado = { Id1: this.dir_ins.cp, Id2: 0, Id3: this.creadopor }
    debugger;
    this.heroService.ValidaServiciosActCP(creado).subscribe(response => {
      debugger;
      if (response != undefined) {
        if (response.result == "Success") {
          console.log(response.item);
          if (response.item.valido_cp_home && response.item.valido_cp_cert) {
            console.log("No es necesario recalcular");
          }
          else if (!response.item.valido_cp_home && response.item.valido_cp_cert) {
            this.openCambioDir(0);
            //solo home
          }
          else if (response.item.valido_cp_home && !response.item.valido_cp_cert) {
            //solo certificados
            this.openCambioDir(1);
          }
          else {
            //home y certificados
            this.openCambioDir(2);
          }
        }
      }
    });
  }

  ActualizaDirCP(event) {
    debugger;
    if ((event.key === "Enter" || event.key === "Tab")) {
      if (this.dir_ins.cp.length == 5) {
        this.getDireccionPorCP();
        //this.openCambioDir();
      }
      else {
        this.limpiarInstalacion();
      }
    }
  }


  getDireccionPorCP() {
    if (this.dir_ins.cp) {
      if (this.dir_ins.cp.length == 5) {
        this.deshabilitains = true;
        
        this.heroService.GetDireccionPorCP(this.dir_ins.cp)
          .subscribe((value) => {
            switch (value.resultado) {
              case "Error":
                this.openSnackBar('No hay concidencias para el código postal capturado.');
                this.limpiarInstalacion();
                break;
              default:
                if (value.resultado == "Success") {
                  this.ValidarServicios();
                  if (value._item.length > 0) {
                    this.deshabilitains = false;
                    this.estados = [{ id: value._item[0].id_estado, desc_estado: value._item[0].estado }];
                    this.dir_ins.id_estado = value._item[0].id_estado;
                    this.Municipios_Ins = value._item[0].municipios;
                    if (this.Municipios_Ins.length == 1)
                      this.dir_ins.id_municipio = this.Municipios_Ins[0].id_municipio
                    this.Localidades_Ins = value._item[0].localidades;
                    if (this.Localidades_Ins.length == 1)
                      this.dir_ins.id_localidad = this.Localidades_Ins[0].id_localidad
                  }
                  else {
                    this.openSnackBar('No hay concidencias para el código postal capturado.');
                    this.limpiarInstalacion();
                  }
                }
            }
          });
      }
      else {
        // this.openSnackBar('No hay concidencias para el código postal capturado.');
        this.limpiarInstalacion();
      }
    }
  }

  limpiarInstalacion() {
    this.dir_ins.id_municipio = -1;
    this.dir_ins.id_estado = -1;
    this.dir_ins.id_localidad = -1;
    this.Municipios_Ins = null;
    this.estados = null;
    this.Localidades_Ins = null;
  }

  regresar(): void {
    this.router.navigate(['/cargarproductos/0']);
  }

  openSnackBar(message, action = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });

  }


  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '450px',
      height: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.heroService.NPCarrito = 0;
      this.router.navigate(['/buscadorcotizaciones']);
    });
  }

  mensaje: string = "";
  ver: boolean = false;

  buscar() {
    this.preventAbuse = true;
    this.heroService.service_general("clientes/Busqueda_Cliente_nombre/" + this.creadopor, {
      "texto": this.text_busqueda
    }).subscribe((value) => {
      setTimeout(() => {
        console.log(value);
        if (value.item == "No hay resultado para la busqueda") {
          this.dataSource.data = [];
          this.mensaje = value.item;
          this.ver = false;
        }
        else {
          this.ver = true;
          this.dataSource.paginator = this.paginator;
          this.dataSource.data = value;
          console.log(this.dataSource.data);
          this.mensaje = "";
        }
        this.preventAbuse = false;
      }, 400);
    });
  }

  set_productos(event, row, index) {
    console.log(row);
    debugger;
    var cadea: string = "asterisco";
    this.nombre = row.name;
    this.paterno = row.paterno;
    this.materno = row.materno;
    this.email = row.email.startsWith("***", 0) ? "" : row.email ;
    this.telefono = row.telefono.startsWith("***", 0) ? "" : row.telefono;
    this.telefono_movil = row.telefono_movil.startsWith("***", 0) ? "" : row.telefono_movil;
    this.ver = false;
    this.id_find_cliente = 0;
    this.deshabilitarcontroles(false);
  }

  limpiarcliente() {
    debugger;
    this.nombre = "";
    this.paterno = "";
    this.materno = "";
    this.email = "";
    this.telefono = "";
    this.telefono_movil = "";
    this.id_find_cliente = 0;
    this.deshabilitarcontroles(false);
  }

  deshabilitarcontroles(_deshabilita: boolean) {
    this.deshabilita = _deshabilita;
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


//@Component({
//  selector: 'snack-bar-component-example-snack',
//  templateUrl: 'snack-bar-component-example-snack.html',
//  styles: [`.example-pizza-party { color: hotpink; }`],
//})
//export class PizzaPartyComponent { }



//////////////// Pop up cambio de direccion
@Component({
  selector: 'dialog-cambio-cp',
  templateUrl: 'dialog-cambio-cp.html',
})

export class DialogCambioDir {

  constructor(private heroService: DatosService, public snackBar: MatSnackBar, private router: Router, public DialogCambioDir: MatDialogRef<DialogCambioDir>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }

  onOmitir(): void {
    //debugger;
    this.DialogCambioDir.close();
    //this.router.navigate(['/cargarproductos/0']);
  }

  ActualizarServicios(): void {
    //debugger;
      console.log('click CP carrito');
      //this.hp.modelo = this.cod_p;
      let res = { actSer: true  }
    this.DialogCambioDir.close(res);
  }

  openSnackBarPopup(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']

    });

  }

  ActualizaCP(e: any) {
    //this.getDireccionPorCP(e.target.value);
  }

}
