import { Component, OnInit, ViewChild, ElementRef, Inject, Output, EventEmitter, OnDestroy, SimpleChange } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Router, convertToParamMap } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { Cat_Direccion, Direccion_Cotizacion } from '../models/cotizacion';
import { Cotizaciones } from '../models/cotizacion';
import { Clientes } from '../models/cotizacion';
import { DatosFiscales } from '../models/cotizacion';
import { permisos_cotizacion_detalle } from '../models/cotizacion';
import * as jquery from 'jquery';
import { DialogEditCP } from '../carshop/carshop.component';
import { ProductsService } from '../services/products.service';
import { DialogCambioDir } from '../cotizacion/cotizacion.component';
import { parse } from 'path';

@Component({
  selector: 'app-detallecotizacion',
  templateUrl: './detallecotizacion.component.html',
  styleUrls: ['./detallecotizacion.component.css']
})
export class DetallecotizacionComponent implements OnInit, OnDestroy {

  ////////////////VARIABLES  /////////////////////

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  public mask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public mask09 = [/[0-9]/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public maskcp = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  displayedColumns = ['imagen', 'sku', 'modelo', 'nombre', 'desccorta', 'cantidad', 'importe_precio_lista', 'importe_total_bruto', 'descuento', 'importetotal', 'margen_cc', 'importe_condiciones_com'];
  prefijos_dir = ['Avenida', 'Av.', 'boulevard', 'Boulevard', 'Blvr', 'Blvr', 'Calzada', 'Calz.', 'avenida', 'av.', 'Calle', 'calle'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  displayedColumns1 = ['id_foto', 'tipo_comp', 'fecha_subida', 'usuario'];
  dataSourceImg = new MatTableDataSource<Element>(ELEMENT_DATAIMG);
  preventAbuse = true;
  color = 'warn';
  numpagos = 0;

  ////////////////// Finales
  idcotiza: any;
  Clientes = new Clientes();
  //dir_en = new Cat_Direccion(); // Dirección de envío del cliente
  //dir_ins = new Cat_Direccion(); // Dirección de instalación del cliente
  dir_en = new Direccion_Cotizacion(); // Dirección de envío de cotización
  dir_ins = new Direccion_Cotizacion(); // Dirección de instalación de cotización
  dir_cte = new Cat_Direccion();
  FsicalesCliente = new DatosFiscales();
  cotizacion = new Cotizaciones();
  permisos = new permisos_cotizacion_detalle();
  Formas_Pago: any[] = [{ "formaPago": "Cargando..." }];
  Vendedores: any[] = []
  CondicionesPago: any[] = []
  tipos_comp: any[] = []; //{ "id": "1", "tipo_pago": "Anticipo 50%" }, { "id": "2", "tipo_pago": "Finiquito 50%" }, { "id": "3", "tipo_pago": "Crédito 100%" }, { "id": "4", "tipo_pago": "Contado 100%" }];
  prefijos_calle: any[] = [{ "id": 1, "prefijo": "Calzada" }, { "id": 2, "prefijo": "Avenida" }, { "id": 3, "prefijo": "Boulevard" }, { "id": 4, "prefijo": "Cerrada" }, { "id": 5, "prefijo": "Calle" }];
  copiar_dir: boolean = false;
  cotiza_result: any;
  condiciones: any;
  formapago_text: string;
  CotizaEstatusDesc: string = "";
  Calle_ins_valido: boolean = true;
  Calle_env_valido: boolean = true;
  Calle_fact_vaido: boolean = true;
  letrero_btn: string = "";
  canalsiglas: string = "";
  requiere_fact: boolean = false;
  tipo_comp: number = 0;
  cambio_ord_comp_generada: string = "";
  f_envio_valida: boolean = true;
  f_ins_valida: boolean = true;
  lista_tarjetas: any[] = [];

  Certificados: boolean = false;
  homeProgram: boolean = false;
  lineas_cert: any[] = [];
  muestra_btn_addHP: boolean = true;
  idHP: number;
  caso: number;
  muestra_dropTarjeta: boolean = false;
  // Variables de Resultado
  message: {};
  estados: any[] = [];
  estados_ins: any[] = [];
  estados_en: any[] = [];
  Municipios_Env: any[] = [];
  Municipios_Ins: any[] = [];
  Localidades_Ins: any[] = [];
  Localidades_Env: any[] = [];
  Municipios_fac: any[] = [];
  Promociones_disponibles: any[] = [];
  myControl: FormControl = new FormControl();
  rol_user: string = "0"; //Es el usuario de Ventas de Kitchen Studio
  creadopor: string = "0";
  sub: any;
  Productos: any[] = [];
  ValActiva: boolean = false;
  url_sitio_files: string = "";

  // montos
  importe_precio_lista: number = 0;
  iva_precio_lista: number = 0;
  importe_condiciones_com: number = 0;
  iva_condiciones_com: number = 0;
  importe_promociones: number = 0;
  iva_promociones: number = 0;
  descuento_acumulado: number = 0;
  descuento_acumulado_cond_com: number = 0;
  comision_vendedor: number = 0;

  //Direccion Envio
  //fec1: Date = new Date(;
  //fec1.setDate(fec1.getDate() + 120);
  date = new FormControl(new Date(moment().add(120, 'days').format("MM/DD/YYYY")));
  fecha_env: string = moment().add(120, 'days').format("MM/DD/YYYY");

  //Direccion Instalacion
  date_ins = new FormControl(new Date(moment().add(120, 'days').format("MM/DD/YYYY")));
  fecha_ins: string = moment().add(120, 'days').format("MM/DD/YYYY");

  fechas_validas: boolean = true;

  //mostrar carrito
  @Output() muestraCarrito = new EventEmitter<any>();

  constructor(private route: ActivatedRoute, private heroService: DatosService, private productService: ProductsService,
    private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public matDatepicker: MatDatepickerModule) { }

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.body.classList.add('skin-blue');
      this.body.classList.add('sidebar-mini');
      this.url_sitio_files = this.heroService.url_sitio_files;
      console.log(this.fecha_env);
      this.dir_ins.fecha_Estimada = (this.date_ins.value.getMonth() + 1) + '/' + this.date_ins.value.getDate() + '/' + this.date_ins.value.getFullYear();
      this.dir_en.fecha_Estimada = (this.date.value.getMonth() + 1) + '/' + this.date.value.getDate() + '/' + this.date.value.getFullYear();
      this.sub = this.route.params.subscribe(params => { this.idcotiza = +params['id']; });
      
      this.creadopor = JSON.parse(localStorage.getItem("user")).id;
      this.rol_user = JSON.parse(localStorage.getItem("user")).rol;
      this.getCargaCotizacionCompleta(true);
      debugger;
      this.heroService.MostrarCarrito = false;
      this.get_cat_tarjetas();
      //this.muestraCarrito.emit(false);
    }

    // this.Validar_comprobantes_obligatorios();
  }

  ngOnDestroy() {
    debugger;
    this.heroService.MostrarCarrito = true;
  }

  ////////////////// DETALLES COTIZACION //////////////////
  ///////////////////////////////////////////////////////

  getCargaCotizacionCompleta(muestra_pp: boolean): void {
    var creadoobj = { Id: this.idcotiza, Id_user: this.creadopor };
    this.heroService.ServicioPostGeneral("GetCotizacionCompleta", creadoobj)
      .subscribe((value) => {
        //console.log(value);
        // console.log("todo")
        //console.log(value)
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al cargar la cotización: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {


              console.log("Cotizacion completa: ")
              //console.log(value.item[0])
              //permisos
              this.permisos = value.item[0].permisos_cotizacion;

              //cotizacion
              this.cargarCotizaObj(value);
              this.tipo_comprobantes_fromap();

              /// productos
              this.Productos = value.item[0].productos;
              ELEMENT_DATA = value.item[0].productos;
              if (this.permisos.mostrar_condiciones_comerciales)
                this.displayedColumns = ['imagen', 'sku', 'modelo', 'nombre', 'desccorta', 'cantidad', 'importe_precio_lista', 'importe_total_bruto', 'descuento', 'importetotal', 'margen_cc', 'importe_condiciones_com'];
              else
                this.displayedColumns = ['imagen', 'sku', 'modelo', 'nombre', 'desccorta', 'cantidad', 'importe_precio_lista', 'importe_total_bruto', 'descuento', 'importetotal'];
              this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

              /// Basicos cliente
              this.Clientes = value.item[0].basicos_cliente[0];
              this.Clientes.actualizadopor = parseInt(this.creadopor);

              /// Vendedoresddl
              this.Vendedores = value.item[0].vendedores;
              //debugger;
              this.Clientes.referidopor = value.item[0].basicos_cliente[0].referidopor;
              debugger;
              /// Direccion ins
              this.dir_ins.id_cotizacion = parseInt(this.idcotiza); //cotizacion
              this.dir_ins.tipo_direccion = 1;
              if (value.item[0].direcciones_ins[0]) {
                this.dir_ins = value.item[0].direcciones_ins[0];
                this.getDireccionPorCP(value.item[0].direcciones_ins[0].id_localidad);
                this.date_ins = new FormControl(new Date(this.dir_ins.fecha_Estimada));
                this.dir_ins.fecha_Estimada = (this.date_ins.value.getMonth() + 1) + '/' + this.date_ins.value.getDate() + '/' + this.date_ins.value.getFullYear();
              }
              //this.dir_ins.id_prefijo_calle = 5;
              //// Direccion env
              this.dir_en.id_cotizacion = parseInt(this.idcotiza);
              this.dir_en.tipo_direccion = 2;
              if (value.item[0].direcciones_env[0]) {
                this.dir_en = value.item[0].direcciones_env[0];
                this.getDireccionPorCP_env(value.item[0].direcciones_env[0].id_localidad);
                this.date = new FormControl(new Date(this.dir_en.fecha_Estimada));
                this.dir_en.fecha_Estimada = (this.date.value.getMonth() + 1) + '/' + this.date.value.getDate() + '/' + this.date.value.getFullYear();
              }
              //this.dir_en.id_prefijo_calle = 5;
              // Fiscales

              this.canalsiglas = value.item[0].canalsiglas;
              this.getCat_estados();
              if (value.item[0].canalsiglas == "KD" || value.item[0].canalsiglas == "DS") {
                if (value.item[0].datosFiscales_Cuenta[0])
                  this.FsicalesCliente = value.item[0].datosFiscales_Cuenta[0];
                //console.log(this.FsicalesCliente);
              }
              else {
                if (value.item[0].datosFiscales[0])
                  this.FsicalesCliente = value.item[0].datosFiscales[0];
              }
              this.FsicalesCliente.id_cliente = parseInt(this.cotizacion.Id_Cliente);
              this.getCat_municipios_fac();
              //this.FsicalesCliente.id_prefijo_calle = 5;
              //condiciones
              this.condiciones = value.item[0].condiciones;

              //doctos
              //debugger;
              ELEMENT_DATAIMG = value.item[0].documentos_cotizacion;
              this.dataSourceImg = new MatTableDataSource<Element>(ELEMENT_DATAIMG);
              this.numpagos = ELEMENT_DATAIMG.length;

              //condiciones- formas de pago
              this.Formas_Pago = value.item[0].formas_pago
              this.CondicionesPago = value.item[0].condiciones
              //this.Validar_comprobantes_obligatorios();

              // montos
              this.importe_precio_lista = value.item[0].importe_precio_lista;
              this.iva_precio_lista = value.item[0].iva_precio_lista
              this.importe_condiciones_com = value.item[0].importe_condiciones_com;
              this.iva_condiciones_com = value.item[0].iva_condiciones_com;
              this.importe_promociones = value.item[0].importe_promociones;
              this.iva_promociones = value.item[0].iva_promociones;
              this.descuento_acumulado = value.item[0].descuento_acumulado;
              this.descuento_acumulado_cond_com = value.item[0].descuento_acumulado_cond_com;
              this.comision_vendedor = value.item[0].comision_vendedor;

              ////// Promociones disponibles
              debugger;
              this.Promociones_disponibles = value.promos_aplicables;
              this.Promociones_disponibles.forEach(promo => {
                if (promo.beneficios.includes('Meses Sin')) {
                  this.muestra_dropTarjeta = true;
                }
              })

              /// Servicios Home program y certificados
              //Borra todos los elementos del arreglo
              this.lineas_cert.splice(0, this.lineas_cert.length);
              this.Productos.forEach(item => {

                if (item.id != 388 && item.id_linea != 36 && item.id_linea != 38 && !item.es_regalo) {
                  var encuentra = this.lineas_cert.findIndex(lc => lc.id == item.id_sublinea);

                  if (encuentra >= 0)
                    this.lineas_cert[encuentra].cantidad += item.cantidad;
                  else
                    this.lineas_cert.push({ id: item.id_sublinea, cantidad: item.cantidad });
                }
                
              });
              debugger;
              if (value.item[0].tiene_home < 1) this.homeProgram = false;
              else {
                this.homeProgram = true;
                //Si tiene mas de uno significa que tiene hoe basico y horas extras
                this.muestra_btn_addHP = (value.item[0].tiene_home > 1 ? false : true);
                
              }
              if (value.item[0].faltan_certificados) this.Certificados = false;
              else this.Certificados = true;
              //Si no tiene habilitada la opcion de edicion de direcciones 
              //muestra_pp = !this.permisos.deshabilitar_dir_ins;
              if ((!this.homeProgram || !this.Certificados) && muestra_pp && value.item[0].estatus < 3 && !this.permisos.deshabilitar_agregar_prod) {
                this.openCPialog();
                //console.log(this.lineas_cert);
              }
              //console.log(this.lineas_cert);
              this.preventAbuse = false;
            }
        }
      });
  }

  public cargarCotizaObj(value: any) {
    this.cotizacion.id_tarjeta = value.item[0].id_tarjeta;
    this.cotizacion.Numero = value.item[0].numero;
    this.cotizacion.Id_Cliente = value.item[0].id_Cliente;
    this.cotizacion.Id_Vendedor = value.item[0].id_Vendedor;
    this.cotizacion.fecha_cotiza = value.item[0].fecha_cotiza;
    this.cotizacion.Inporte = value.item[0].inporte;
    this.cotizacion.Inporte_Final = value.item[0].inporte_Final;
    this.cotizacion.Estatus = value.item[0].estatus;
    this.cotizacion.Acciones = value.item[0].aciones;
    this.cotizacion.Id_Canal = value.item[0].id_Canal;
    this.cotizacion.Id_Cuenta = value.item[0].id_Cuenta;
    this.cotizacion.Id_Estado_Instalacion = value.item[0].id_Estado_Instalacion;
    this.cotizacion.Observaciones = value.item[0].observaciones;
    this.cotizacion.creadopor = value.item[0].creadopor;
    this.cotizacion.id_formapago = value.item[0].id_formapago;
    this.cotizacion.ibs = value.item[0].ibs;
    this.cotizacion.Id = value.item[0].id;
    this.cotizacion.motivo_rechazo = value.item[0].motivo_rechazo;
    this.cotizacion.rechazada = value.item[0].rechazada;
    this.cotizacion.id_cotizacion_padre = value.item[0].id_cotizacion_padre;
    this.cotizacion.requiere_fact = value.item[0].requiere_fact;
    this.cotizacion.coment_cancel = value.item[0].coment_cancel;
    this.cotizacion.cancelada = value.item[0].cancelada;
    this.cotizacion.id_user_entrega_sol = value.item[0].id_user_entrega_sol
    this.cotizacion.acepto_terminos_condiciones = value.item[0].acepto_terminos_condiciones
    this.cotizacion.entrega_sol = value.item[0].entrega_sol;
    this.CotizaEstatusDesc = value.item[0].estatus_desc;
    this.letrero_btn = this.permisos.texto_btn_guardar_gral;
    //debugger;
    this.cambio_ord_comp_generada = value.item[0].cambio_ord_comp_generada;
    this.rechazo_click();
    //promociones
    //this.cargar_promociones_disponibles();
  }

  public GuardarDetallesCotizacion(IsValid: boolean) {
    debugger;
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
    if (!this.fechas_validas || (this.cotizacion.acepto_terminos_condiciones == false && this.permisos.mostrar_acepto_terminos) || (this.cotizacion.id_formapago == 0 && !this.permisos.deshabilitar_formas_pago && this.permisos.mostrar_subir_archivos))
      IsValid = false;

    if (this.cotizacion.Estatus == 4)
      IsValid = true;
    this.ValActiva = !IsValid;

    if (!this.f_envio_valida || !this.f_ins_valida) {
      IsValid = false;
    }
    if (IsValid) {
      if (this.cotizacion.Estatus < 5 && this.cotizacion.Estatus != 3 && !this.cotizacion.rechazada) // no pasa del 5 , el 3 se modifica desde buqueda, no rechazada
        this.cotizacion.Estatus = this.cotizacion.Estatus + 1;
      else
        this.cotizacion.Estatus = this.cotizacion.Estatus;

      if (this.cotizacion.Estatus == 3)
        this.cotizacion.Acciones = 1;
      this.CallCrearEditar_cotizacion(this.cotizacion);
      this.crear_editar_ckiente(this.Clientes)
      //this.CallCrearEditardireccion(this.dir_en) // Cat_direccion
      //this.CallCrearEditardireccion(this.dir_ins) // Cat_direccion
      //this.CallCrearEditardireccion_cotizacion(this.dir_en); // Direccion_Cotizacion

      //this.CallCrearEditardireccion_cotizacion(this.dir_ins); // Direccion_Cotizacion
      var direcciones: Direccion_Cotizacion[] = [];
      direcciones.push(this.dir_en);
      direcciones.push(this.dir_ins);
      var obDirecciones = { direcciones: direcciones, Id_cliente: parseInt(this.cotizacion.Id_Cliente), dir_clie: true, cat_dir: false };
      this.CallCrearEditardireccionesCotizacion(obDirecciones);

      if (this.canalsiglas != "DS" && this.canalsiglas != "KD")
        this.CallCrearEditarfiscales();
      this.gotoBuscador();
    }
  }

  gotoBuscador(): void {
    this.router.navigate(['/buscadorcotizaciones']);
  }

  public get_cat_tarjetas() {
    var creadoobj = { Id: 1 };
    this.heroService.ServicioPostGeneral("get_cat_tarjetas", creadoobj)
      .subscribe((value) => {
        if (value != undefined) {
          this.lista_tarjetas = value.res;
        }
      });
  }

  public HabilitaEdiBasico() {
    this.permisos.deshabilitar_cliente = this.permisos.deshabilitar_cliente == true ? false : true;
    this.permisos.deshabilitar_referencia = this.permisos.deshabilitar_referencia == true ? false : true;
    this.permisos.deshabilitar_vendedor = this.permisos.deshabilitar_vendedor == true ? false : true;
    this.permisos.deshabilitar_formas_pago = this.permisos.deshabilitar_formas_pago == true ? false : true;
  }

  public HabilitaEdiDetalles() {
    this.permisos.deshabilitar_dir_ins = this.permisos.deshabilitar_dir_ins == true ? false : true;
    this.permisos.deshabilitar_dir_env = this.permisos.deshabilitar_dir_env == true ? false : true;
    if (this.cotizacion.Id_Canal != 3) {
      this.permisos.deshabilitar_fact = this.permisos.deshabilitar_fact == true ? false : true;
    }

    this.permisos.deshabilitar_referencia == this.permisos.deshabilitar_referencia == true ? false : true;
  }

  regresar(): void {
    this.router.navigate(['/buscadorcotizaciones']);
  }

  cancelar(): void {
    this.openCancelDialog();
  }

  duplicar(): void {
    this.router.navigate(['/buscadorcotizaciones']);
  }

  rechazo_click() {
    //console.log(this.cotizacion.rechazada)
    //if (this.cotizacion.rechazada)
    //  this.permisos.texto_btn_guardar_gral = "Rechazar y Guardar";
    //else
    //  this.permisos.texto_btn_guardar_gral = this.letrero_btn;
  }

  getCat_vendedores(): void {
    var creadoobj = { Id: this.cotizacion.Id };
    this.heroService.ServicioPostGeneral("duplicar_cotizacion", creadoobj)
      .subscribe((value) => {
        //console.log(value);
        debugger;
        if (value.value.response =="Success") {
          this.router.navigate(['/detallecotizacion/' + value.value.id]);
          window.location.reload();
        }
      });
  }

  enviar_cotizacion(): void {
    //debugger;
    var url_serv = this.heroService.heroesUrl + "Estimates/EnviarPDF/";
    this.heroService.ServicioPostGeneral_Remoto(url_serv, this.idcotiza)
      .subscribe((value) => {
        //console.log(value);
        debugger;
        if (value != undefined) {
          this.openSnackBar('se envió documentacion a ' + value.correo);
        }
      });
  }

  imprimir_prefact(): void {
    //debugger;
    var url_serv = this.heroService.heroesUrl + "Estimates/PDF2/";
    this.heroService.ServicioPostGeneral_Remoto(url_serv, this.idcotiza)
      .subscribe((value) => {
        console.log(value);
        debugger
        //var url = value.replace("/Imagenes", "http://23.253.173.64/mieletickets");
        var url = value;
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'precotizacion.pdf';
        a.target = '_blank';
        let link = url;
        window.open(link, "_blank");

      });
  }

  //valida_tel(e: any) {
  //  console.log(this.dir_en.telefono.length);

  //}

  public Validar_comprobantes_obligatorios() {

    if (this.cotizacion.Estatus > 1) {
      if (this.cotizacion.id_formapago > 0) {

        this.tipo_comprobantes_fromap();
        var comprobantes_obligatorios = true;
        for (var forma of this.Formas_Pago) {
          if (this.cotizacion.id_formapago == forma.id) { // se identifica si la forma de pago de la cotización tiene comprobantes obligatorios
            comprobantes_obligatorios = forma.comprobantes_obligatorios
          }
        }


        if (comprobantes_obligatorios) {
          this.permisos.mostrar_sol_entrega = false;
          if (ELEMENT_DATAIMG.length < 1)
            this.permisos.deshablitar_btn_guardar_gral = true; // si no hay comprobantes dehanilita
          else {
            if (this.cotizacion.Estatus < 3) // a partir de OCG solo se activa para ventas y finanzas
              this.permisos.deshablitar_btn_guardar_gral = false; //en el nivel 2 se permite avanzar si hay comprobantes 
            this.heroService.GetDocumentosCotizacion(this.idcotiza, this.rol_user)
              .subscribe((value) => {
                switch (value.token) {
                  case "Error":
                    this.message = "Ocurrio un error al cargar las liquidaciones";
                    break;
                  default:
                    if (value.token == "Success") {
                      this.permisos.mostrar_sol_entrega = value.sol_ent_valido;
                    }
                }
              });
          }
        }
        else {
          this.permisos.mostrar_sol_entrega = true;
          this.permisos.deshablitar_btn_guardar_gral = false;
        }
      }
      else {
        this.permisos.deshablitar_btn_guardar_gral = true;
      }
    }
    // this.permisos.deshablitar_btn_guardar_gral == true ? false  true: 
  }

  public tipo_comprobantes_fromap(): void {
    var creadoobj = { Id: this.cotizacion.id_formapago };
    this.heroService.ServicioPostGeneral("tipo_comprobantes_fromap", creadoobj)
      .subscribe((value) => {
        //
        //console.log(value);
        this.tipos_comp = value.item;
      });
  }

  ////////////////// COTIZACIÓN ///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  public CallCrearEditar_cotizacion(cotizacion: Cotizaciones) {
    this.heroService.CrearEditarCotizacion(cotizacion)
      .subscribe((value) => {
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al guardar la cotización: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              console.log(value.detalle);
            }
        }
      });
  }

  public crear_editar_ckiente(cliente: Clientes) {
    this.heroService.crear_editar_ckiente(cliente)
      .subscribe((value) => {
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al guardar el cliente: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              console.log(value.detalle);
            }
        }
      });
  }


  ////////////////// FUNCIONES PROMOCIONES //////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////


  cargar_promociones_disponibles() {

    var objserv = { Id: this.cotizacion.Id };

    this.heroService.ServicioPostGeneral("cargar_promociones_disponibles", objserv).subscribe((value) => {

      switch (value.result) {
        case "Error":
          console.log("Cliente - Ocurrio un error al cargar las promociones: " + value.detalle);
          break;
        case "Success":
          this.preventAbuse = false;
          console.log(value.item);
          this.Promociones_disponibles = value.item;
          this.Promociones_disponibles.forEach(promo => {
            if (promo.beneficios.includes('Meses Sin')) {
              this.muestra_dropTarjeta = true;
            }
          })
          break;
      }
    });
  }


  ////////////////// FUNCIONES LISTA PRODUCTOS //////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////

  set_productos(event, row, index) {
    var Id_Ctrl = event.srcElement.getAttribute("id")
    Id_Ctrl = Id_Ctrl.replace("cant_", "");
    var Val_Ctrl = event.srcElement.value;
    Val_Ctrl = Val_Ctrl == "" ? 1 : Val_Ctrl;
    this.ActualizaCantCotizaProd(Id_Ctrl, Val_Ctrl, this.idcotiza);
  };

  del_productos(event, row, index) {
    if (!this.permisos.deshabilitar_lista_prods) {
      var Id_Ctrl = event.srcElement.getAttribute("id")
      Id_Ctrl = Id_Ctrl.replace("del_", "");
      var Val_Ctrl = -1;
      this.ActualizaCantCotizaProd(Id_Ctrl, Val_Ctrl, this.idcotiza);
    }
  };

  ActualizaCantCotizaProd(Id, cantidad, id_cotiza) {
    //debugger;
    this.heroService.ActualizaCantCotizaProd(Id, cantidad, id_cotiza)
      .subscribe((value) => {
        debugger;
        switch (value.response) {
          case "Error":
            console.log("Ocurrio un error al editar la cantidad del producto : " + Id);
            break;
          default:
            if (value.response == "Success") {
              ELEMENT_DATA = value.prods;
              this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
              
              this.importe_precio_lista = value.montos[0].importe_precio_lista;
              this.iva_precio_lista = value.montos[0].iva_precio_lista;
              this.importe_condiciones_com = value.montos[0].importe_condiciones_com;
              this.iva_condiciones_com = value.montos[0].iva_condiciones_com;
              this.importe_promociones = value.montos[0].importe_promociones;
              this.iva_promociones = value.montos[0].iva_promociones;
              this.descuento_acumulado = value.montos[0].descuento_acumulado;
              this.descuento_acumulado_cond_com = value.montos[0].descuento_acumulado_cond_com;
              debugger;
              this.comision_vendedor = value.montos[0].comision_vendedor;

              this.Promociones_disponibles = value.promos_aplicables;
              this.Promociones_disponibles.forEach(promo => {
                if (promo.beneficios.includes('Meses Sin')) {
                  this.muestra_dropTarjeta = true;
                }
              })
              if (value.servicios[0].tiene_home < 1)
                this.homeProgram = false;
              else {
                this.homeProgram = true;
                //Si tiene mas de uno significa que tiene home basico y horas extras
                this.muestra_btn_addHP = (value.servicios[0].tiene_home > 1 ? false : true);
              }
              if (value.item[0].tiene_certificado < 1) this.Certificados = false;
              else  this.Certificados = true;
            }
        }
      });
  }

  validacion_promociones(Id: number, agregar_quitar: boolean, beneficio: string) {
    debugger;
    if (beneficio.includes('Meses Sin')) {
      if (agregar_quitar) {
        this.agregar_quitar_promocion(Id, agregar_quitar);
        this.cotizacion.id_tarjeta = 0;
      }
      else {
        //this.cotizacion.id_tarjeta = 1;
        //console.log(this.cotizacion);
        //this.openMesesDialog(Id, agregar_quitar);
      }
    }
    else
      this.agregar_quitar_promocion(Id, agregar_quitar);
  }

 //Funcion que actualiza las promociones seleccionadas
 agregar_quitar_promocion(Id, agregar_quitar) {
  
  var agregar_quitar_ = 1;
  if (agregar_quitar) // si es positivo quire decir que hay que quitar la promocion 
    agregar_quitar_ = 0;
  
 // var chk_promo =  <HTMLInputElement>document.getElementById(event.source.inputId);
  var AddQuitPromocion = { Id_Cotizacion: this.cotizacion.Id, Id: Id, agregar_quitar: agregar_quitar_ };
  this.heroService.ServicioPostGeneral("agregar_quitar_promocion", AddQuitPromocion)
    .subscribe((value) => {
      debugger;
      switch (value.response) {
        
        case "No es posible agregarla, es incompatible con otra obligatoria":
          this.Promociones_disponibles = value.promos_aplicables;
          this.openSnackBar(value.response);
          break;
        case "Error":
          this.openSnackBar(value.response);
          break;
        default:
          if (value.response == "Success") {
            ELEMENT_DATA = value.prods;
            this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

            this.importe_precio_lista = value.montos[0].importe_precio_lista;
            this.iva_precio_lista = value.montos[0].iva_precio_lista;
            this.importe_condiciones_com = value.montos[0].importe_condiciones_com;
            this.iva_condiciones_com = value.montos[0].iva_condiciones_com;
            this.importe_promociones = value.montos[0].importe_promociones;
            this.iva_promociones = value.montos[0].iva_promociones;
            this.descuento_acumulado = value.montos[0].descuento_acumulado;
            this.descuento_acumulado_cond_com = value.montos[0].descuento_acumulado_cond_com;
            this.Promociones_disponibles = value.promos_aplicables;
            
            this.comision_vendedor = value.montos[0].comision_vendedor;
            this.openSnackBar('Promociónes modificadas');
          }
      }
    });
}

  AgregarProd(): void {
    this.router.navigate(['/cargarproductos/' + this.idcotiza]);
  }

  //////////////// DIRECCIONES CLIENTE ////////////////////////
  /////////////////////////////////////////////////////////////


  // Replica dirección de Instalación en dirección de Envío
  public replicarDireccion() {
    debugger
    this.preventAbuse = true;
    this.dir_ins.tipo_direccion = 1;
    this.dir_ins.nombrecontacto = this.dir_en.nombrecontacto;
    this.dir_ins.telefono = this.dir_en.telefono;
    this.dir_ins.telefono_movil = this.dir_en.telefono_movil;
    this.dir_ins.cp = this.dir_en.cp;
    this.getDireccionPorCP(this.dir_en.id_localidad);
    this.dir_ins.calle_numero = this.dir_en.calle_numero;
    this.dir_ins.numExt = this.dir_en.numExt;
    this.dir_ins.numInt = this.dir_en.numInt;
    this.date_ins = new FormControl(new Date(this.dir_en.fecha_Estimada));
    this.dir_ins.fecha_Estimada = (this.date_ins.value.getMonth() + 1) + '/' + this.date_ins.value.getDate() + '/' + this.date_ins.value.getFullYear()
    this.dir_ins.id_prefijo_calle = this.dir_en.id_prefijo_calle
    this.f_ins_valida = this.diaSemana(this.date_ins.value.getMonth() + 1, this.date_ins.value.getDate(), this.date_ins.value.getFullYear());
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
    this.preventAbuse = false;
  }

  // Replica dirección de Envío en dirección de Instalación

  public validar_prefijos(text: any) {
    //console.log("texto: " + text)
    for (var prefijo of this.prefijos_dir) {
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

  public validar_prefijos_env(text: any) {
    for (var prefijo of this.prefijos_dir) {
      if (text == prefijo) {
        this.Calle_env_valido = false;
        break;
      }
      else {
        this.Calle_env_valido = true;
      }
    }
  }

  public validar_prefijos_fact(text: any) {
    for (var prefijo of this.prefijos_dir) {
      //if (text.indexOf(prefijo) > 0) {
      if (text == prefijo) {
        this.Calle_fact_vaido = false;
        break;
      }
      else {
        this.Calle_fact_vaido = true;
      }
    }
  }

  public diaSemana(mes: string, dia: string, anio: string): boolean {
    debugger;
    var valida: boolean = false;
    var ocg = new Date(this.cambio_ord_comp_generada);
    if (ocg.getFullYear() < 2000) {
      ocg = new Date();
    }
    //var fecha = new Date(mes + ' ' + dia + ' ' + anio + ' 00:00:01');
    var fecha = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia), 1);
    //var fmom = moment(dia + ' ' + mes + ' ' + anio, 'DD/MM/YYYY');

    if (fecha.getTime() <= ocg.getTime())
      return valida;
    var oneDay = 24 * 60 * 60 * 1000; // Calculates milliseconds in a day
    //var diff2 = moment(fecha).diff(ocg, 'days');
    //var diff4 = moment(fmom).diff(ocg, 'days', false);
    //var diffDays = Math.abs((fecha.getTime() - ocg.getTime()) / (oneDay));
    var diffDays = moment(fecha).diff(ocg, 'days', true);
    if (diffDays > 119)
      valida = true
    //var dia_sem = dt.getUTCDay();
    return valida;
  };


  asignarFecha_env() {
    //debugger;
    this.dir_en.fecha_Estimada = (this.date.value.getMonth() + 1) + '/' + this.date.value.getDate() + '/' + this.date.value.getFullYear();
    this.f_envio_valida = this.diaSemana(this.date.value.getMonth() + 1, this.date.value.getDate(), this.date.value.getFullYear());
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
  }

  asignarFecha_ins() {
    //debugger;
    this.dir_ins.fecha_Estimada = (this.date_ins.value.getMonth() + 1) + '/' + this.date_ins.value.getDate() + '/' + this.date_ins.value.getFullYear();
    this.f_ins_valida = this.diaSemana(this.date_ins.value.getMonth() + 1, this.date_ins.value.getDate(), this.date_ins.value.getFullYear());
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
  }


  public compare(dateTimeA, dateTimeB) { // Validar fechas de envío e instalación
    debugger;
    var momentA = new Date(dateTimeA); // fecha de envío
    var momentB = new Date(dateTimeB); // fecha de instalación
    if (momentA.getTime() > momentB.getTime())  // fecha de envío >= fecha de instalación
      this.fechas_validas = false;
    else
      this.fechas_validas = true;
  }

  public ValidarServicios(codigop: string, id_cotiza: any) {
    debugger;
    if (this.homeProgram || this.Certificados) {
      let creado = { Id1: codigop, Id2: id_cotiza  }
      this.heroService.ValidaServiciosActCP(creado).subscribe(response => {
        //debugger;
        if (response != undefined) {
          if (response.result == "Success") {
            console.log(response.item);
            if (response.item.valido_cp_home && response.item.valido_cp_cert) {
              console.log("No es necesario recalcular");
            }
            else {
              if (!response.item.valido_cp_home && response.item.valido_cp_cert) {
                //solo home
                this.caso = 0;
              }
              else if (response.item.valido_cp_home && !response.item.valido_cp_cert) {
                this.caso = 1;
                //solo certificados
              }
              else {
                this.caso = 2;
                //home y certificados
                //this.openCambioDir(2);
              }
              debugger;
              if (this.cotizacion.Estatus == 1) this.openCambioDir(this.caso);
              else this.recalcularServicios(this.caso);
            }
            
          }
        }
      });
    }
    else {
      return 0;
    }
  }

  ActualizaDirCP(event) {
    //if ((event.key === "Enter" || event.key === "Tab")) {
      if (this.dir_ins.cp.length == 5) {
        //debugger;
        this.getDireccionPorCP(0);
      }
      else {
        this.limpiarInstalacion();
      }
    //}
  }

  getDireccionPorCP(id_localidad_: any) {
    //debugger;
    if (this.dir_ins.cp) {
      if (this.dir_ins.cp.length == 5) {
        this.limpiarInstalacion();
        this.heroService.GetDireccionPorCP(this.dir_ins.cp)
          .subscribe((value) => {
            switch (value.resultado) {
              case "Error":
                this.openSnackBar('No hay concidencias para el código postal capturado.');
                break;
              default:
                if (value.resultado == "Success") {
                  this.ValidarServicios(this.dir_ins.cp, this.idcotiza);
                  if (value._item.length > 0) {
                    this.estados_ins = [{ id: value._item[0].id_estado, desc_estado: value._item[0].estado }];
                    this.dir_ins.id_estado = value._item[0].id_estado;
                    this.Municipios_Ins = value._item[0].municipios;
                    if (this.Municipios_Ins.length == 1)
                      this.dir_ins.id_municipio = this.Municipios_Ins[0].id_municipio;
                    this.Localidades_Ins = value._item[0].localidades;
                    if (this.Localidades_Ins.length == 1)
                      this.dir_ins.id_localidad = this.Localidades_Ins[0].id_localidad;
                    else {
                      if (id_localidad_ != 0) {
                        this.dir_ins.id_localidad = id_localidad_;
                        this.dir_ins.id_municipio = this.dir_en.id_municipio;
                      }                      
                    }
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

  ActualizaDirCP_env(event) {
    //debugger;
    //if ((event.key === "Enter" || event.key === "Tab")) {
      if (this.dir_en.cp.length == 5) {
        this.getDireccionPorCP_env(this.dir_en.id_localidad);
      }
      else {
        this.limpiarEnvio();
      }
    //}
  }

  getDireccionPorCP_env(id_localidad_: any) {
    if (this.dir_en.cp) {
      if (this.dir_en.cp.length == 5) {
        this.limpiarEnvio();
        this.heroService.GetDireccionPorCP(this.dir_en.cp)
          .subscribe((value) => {
            switch (value.resultado) {
              case "Error":
                this.openSnackBar('No hay concidencias para el código postal capturado.');
                break;
              default:
                if (value.resultado == "Success") {
                  if (value._item.length > 0) {
                    this.estados_en = [{ id: value._item[0].id_estado, desc_estado: value._item[0].estado }];
                    this.dir_en.id_estado = value._item[0].id_estado;
                    this.Municipios_Env = value._item[0].municipios;
                    if (this.Municipios_Env.length == 1)
                      this.dir_en.id_municipio = this.Municipios_Env[0].id_municipio
                    this.Localidades_Env = value._item[0].localidades;
                    if (this.Localidades_Env.length == 1)
                      this.dir_en.id_localidad = this.Localidades_Env[0].id_localidad
                    else {
                      debugger;
                      if (id_localidad_ != 0)
                        this.dir_en.id_localidad = id_localidad_;
                    }
                  }
                  else {
                    this.openSnackBar('No hay concidencias para el código postal capturado.');
                    this.limpiarEnvio();
                  }
                }
            }
          });
      }
      else {
        // this.openSnackBar('No hay concidencias para el código postal capturado.');
        this.limpiarEnvio();
      }
    }
  }

  limpiarEnvio() {
    this.dir_en.id_municipio = -1;
    this.dir_en.id_estado = -1;
    this.dir_en.id_localidad = -1;
    this.Municipios_Env = null;
    this.estados_en = null;
    this.Localidades_Env = null;
  }

  limpiarInstalacion() {
    this.dir_ins.id_municipio = -1;
    this.dir_ins.id_estado = -1;
    this.dir_ins.id_localidad = -1;
    this.Municipios_Ins = null;
    this.estados_ins = null;
    this.Localidades_Ins = null;
  }

  getCat_estados(): void {
    this.heroService.service_catalogos("Catalogos/Estados")
      .subscribe((value) => {
        this.estados = value;
      });
  }

  getCat_municipios_fac(): void {
    this.heroService.GetMunicipios(this.FsicalesCliente.id_estado)
      .subscribe((value) => {
        this.Municipios_fac = value;
        this.FsicalesCliente.id_municipio;
      });
  }

  public CallCrearEditardireccionesCotizacion(direcciones: any) { // NOTA:  Crea-Edita Cat_Direccion
    let cte = parseInt(this.cotizacion.Id_Cliente);
    //debugger;
    this.heroService.CrearEditarDireccionesCotizacion(direcciones)
      .subscribe((value) => {
        debugger;
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al guardar la dirección: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              console.log(value.detalle);
            }
        }
      });
  }

  //Crea-Edita dirección de la cotización en direcciones_cotizacion
  public CallCrearEditardireccion_cotizacion(direccion: Direccion_Cotizacion) {
    //debugger;
    this.heroService.CrearEditarDireccion_cotizacion(direccion)
      .subscribe((value) => {
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al guardar la dirección: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              console.log(value.detalle);
            }
        }
      });
  }

  public CallCrearEditarfiscales() {
    this.heroService.CrearEditarFiscales(this.FsicalesCliente)
      .subscribe((value) => {
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al guardar la dirección: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              console.log(value.detalle);
              this.gotoBuscador();
            }
        }
      });
  }

  ////////////////// DOCUENTOS /////////////////////////////////
  //////////////////////////////////////////////////////////////

  @ViewChild("fileInput") fileInput;
  @ViewChild("fileInput1") fileInput1;
  fileToUpload: any[] = [];
  response: any = { response: 0 };
  UploadID: string = "";
  tipoD: number = 1;

  addFile(): void {
    this.UploadID = event.srcElement.getAttribute("id");
    let fi = null;
    if (this.UploadID == "btncomp") {
      this.tipoD = 1;
      fi = this.fileInput.nativeElement;
    }
    else {
      this.tipoD = 2;
      fi = this.fileInput1.nativeElement;
    }

    if (fi.files && fi.files[0]) {
      this.heroService.upload(fi.files[0]).subscribe((value) => {
        this.response = value;
        this.CallNuevoDocumento(0, this.idcotiza, this.response.response, this.tipoD, this.UploadID == "btncomp" ? this.tipo_comp : 5, this.cotizacion.id_formapago)
      });
    }
  }

  public CallNuevoDocumento(id, Id_Cotizacion, Id_foto, tipo_docto, tipos_comp, id_forma_pago): void {
    this.preventAbuse = true;
    this.heroService.CallNuevoDocumento(id, Id_Cotizacion, Id_foto, tipo_docto, tipos_comp, id_forma_pago, this.creadopor)
      .subscribe((value) => {
        //debugger;
        switch (value.response) {
          case "Error":
            console.log("Ocurrio un error al guardar el documento de la cotizacion: " + Id_Cotizacion);
            break;
          default:
            if (value.response == "Success") {
              this.tipo_comp = 0;
              $("#file_orden_i").val("");
              this.preventAbuse = false;
              console.log('Documento de cotización:  ' + Id_Cotizacion + ' agregado correctamente')
              this.GetDocumentosCotizacion();
            }
        }
      });
  }

  GetDocumentosCotizacion() {
    this.heroService.GetDocumentosCotizacion(this.idcotiza, this.rol_user)
      .subscribe((value) => {
        switch (value.token) {
          case "Error":
            this.message = "Ocurrio un error al cargar los Documentos";
            break;
          default:
            if (value.token == "Success") {

              //this.Productos = value.item;
              ELEMENT_DATAIMG = value.item;
              this.dataSourceImg = new MatTableDataSource<Element>(ELEMENT_DATAIMG);
              this.Validar_comprobantes_obligatorios();
              this.permisos.mostrar_sol_entrega = value.sol_ent_valido;
            }
        }
      });
  }

  ///////////////// Agregar servicios /////////////////////////////
  ///////////////////////////////////////////////////////


  // funcion que incerta el certificado desde el POP UP 
  GuardarCertificado(addSer: number, cer_pr: number, id: number) {
    //debugger;
    //addServ puede traer 3 valores, 0 agrega home Program, 1 agrega certificados y dosagrega ambos
    if (addSer == 0) {
      if (id > 0) {
        this.GuardarHomeP(id);
      }
    }
    else {
      this.productService.saveProductosCertificado(cer_pr).subscribe((value) => {
          debugger;
          this.preventAbuse = false;
          switch (value.token) {
            case "Error":
              break;
            default:
              if (value.token == "Success") {
                console.log("Certificado agregado correctamente");
                this.MostrarAviso("Certificado agregado correctamente");
                if (addSer == 1) {
                  //this.GetProductosCarrito(false);
                  this.getCargaCotizacionCompleta(false);
                }
                else {
                  this.GuardarHomeP(id);
                }
              }
          }
        });

      
    }
  }

  MostrarAviso(texto: string) {
    this.snackBar.open(texto, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });
  }

  GuardarHomeP(id: number) {
    let fecha_creacion = moment().format("MM/DD/YYYY");
    //this.heroService.AddProductoCotiza(0, 0, idcotiza, this.id_usuario, this.fecha_creacion)
    this.heroService.AddProductoCotiza(0, 0, id, this.idcotiza, fecha_creacion, 1)
      .subscribe((value) => {
        debugger;
        this.preventAbuse = false;
        switch (value.value.response) {
          case "Error":
            break;
          default:
            if (value.value.response == "Success") {
              console.log("home program agregado correctamente");
              this.getCargaCotizacionCompleta(false);
              //this.GetProductosCarrito(false);
              //this.ActualizarCarrito();
              this.MostrarAviso("home program agregado correctamente");
            }
        }
      });
  }

  AgregarHE(id: number) {
    //debugger;
    this.gethorasExtrasHP(id);
  }

  gethorasExtrasHP(id: number) {
    //debugger;
    var creadoobj = { Id: id };
    this.heroService.ServicioPostGeneral_prods("ServiciosRelacionados", creadoobj)
      .subscribe((value) => {
        //debugger;
        if (value.productos_all != undefined) {
          console.log(value.productos_all);
          if (value.productos_all.length > 0) {
            this.GuardarHomeP(value.productos_all[0].id);
          }
        }
      });
  }

  ///////////////// POP UPS /////////////////////////////
  ///////////////////////////////////////////////////////

  bloqueo_desbloqueo() {
    if (this.cotizacion.rechazada) {
      var creadoobj = { Id: this.cotizacion.Id, texto: "" };
      this.heroService.ServicioPostGeneral("rechazar_cotizacion", creadoobj)
        .subscribe((value) => {
          this.router.navigate(['/buscadorcotizaciones']);
          console.log(value);
        });
    }
    else {
      this.openRechazarDialog();
    }
  }

  //Popup servicios home program y certificados de mantenimiento
  openCPialog(): void {
    var ppAlto = 470 + ((this.homeProgram == false) ? 95 : 0);
    let dialogCPRef = this.dialog.open(DialogEditCP, {
      width: '680px',
      height: ppAlto.toString() + 'px',

      data: { cp: this.dir_ins.cp, cert: this.Certificados, home: this.homeProgram, lista: this.lineas_cert, altoVentana: (ppAlto - 180).toString() + 'px' }
    });

    dialogCPRef.afterClosed().subscribe(result => {
      //debugger;
      if (result != undefined) {
        this.dir_ins.cp = result.ncer.cp;
        result.ncer.cotizacion_id = this.idcotiza;
        this.getDireccionPorCP(this.dir_en.id_localidad);
        result.ncer.id_usuario = this.creadopor;
        this.GuardarCertificado(result.addSer, result.ncer, result.nhp.id);

      }
      else {
        console.log("Cancelado sin accion")
      }
    });
  }

  //openMesesDialog(Id: number, agregar_quitar: boolean): void {
  //  //var ppAlto = 470 + ((this.homeProgram == false) ? 95 : 0);
  //  let dialogCPRef = this.dialog.open(DialogPromoMeses, {
  //    width: '480px',
  //    height: '300px',
  //    data: { id_tarjeta: this.cotizacion.id_tarjeta }
  //  });

  //  dialogCPRef.afterClosed().subscribe(result => {
  //    debugger;
  //    if (result != undefined) {
  //      if (result.id > 0) {
  //        this.agregar_quitar_promocion(Id, agregar_quitar);
  //      }
  //      //this.dir_ins.cp = result.ncer.cp;
  //      //result.ncer.cotizacion_id = this.idcotiza;
  //      //this.getDireccionPorCP(this.dir_en.id_localidad);
  //      //result.ncer.id_usuario = this.creadopor;
  //      //this.GuardarCertificado(result.addSer, result.ncer, result.nhp.id);

  //    }
  //    else {
  //      this.Promociones_disponibles.forEach(promo => {
  //        if (promo.id == Id) {
  //          promo.aplicada = false;
  //        }
  //      })
  //      console.log("Cancelado sin accion")
  //    }
  //  });
  //}

  openCambioDir(casos: number): void {
    let dialogCambioDir = this.dialog.open(DialogCambioDir, {
      width: '500px',
      height: '300px',

      data: { cp: this.dir_ins.cp }
    });

    dialogCambioDir.afterClosed().subscribe(result => {
      debugger;
      if (result != undefined) {
        
        console.log("realizó cambio");
        this.recalcularServicios(casos);
        
      }
      else {

        if (this.cotizacion.Estatus == 1) {
          this.dir_ins.cp = "";
          this.limpiarInstalacion();
        }
        console.log("Cancelado sin accion")
      }
    });
  }

  recalcularServicios(casos: number) {
    var cer_prod: any = { cp: this.dir_ins.cp, cotizacion_id: this.idcotiza, id_usuario: this.creadopor, lista_sublineas: this.lineas_cert };
    if (casos == 0 || casos == 2) {
      var creado = { "TextoLibre": this.dir_ins.cp };
      this.heroService.ServicioPostGeneral_prods("ConsultaHPbyCp", creado)
        .subscribe((value) => {
          //debugger;
          switch (value.result) {
            case "Error":
              this.idHP = 0;
              break;
            default:
              if (value.result == "Success") {
                if (value.item != null) {
                  this.idHP = value.item.id;
                  this.GuardarCertificado(casos, cer_prod, this.idHP);
                }
              }
          }
        });
    }
    else {
      this.GuardarCertificado(casos, cer_prod, 0);
    }
  }


  openSnackBar(message = "Procesando...", action = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });

  }

  /// abrir dialog-ibs.html
  openIBSDialog(): void {
    let dialogIBSRef = this.dialog.open(DialogIBS, {
      width: '650px',
      height: '450px',
      data: { id: this.cotizacion.Id, ibs: null, emailibs: this.Clientes.email }
    });

    dialogIBSRef.afterClosed().subscribe(result => {

      if (result == this.cotizacion.Id) {
        console.log("si lo cambio ")
      }
      else {
        console.log("Cancelo edición de IBS.")
      }
      console.log(result);
    });
  }

  /// abrir dialog-sol-entrega.html
  _openSolEntregaDialog(): void {
    let dialogSolEntregaRef = this.dialog.open(SolEntregaDialog, {
      width: '380px',
      height: '320px',
      data: { id: this.cotizacion.Id, emailibs: this.cotizacion }
    });

    dialogSolEntregaRef.afterClosed().subscribe(result => {
      debugger;
      if (result == this.cotizacion.Id) {
        
        var creadoobj = { Id: result }; //this.data.id };
        this.heroService.ServicioPostGeneral("solicitar_entrega", creadoobj)
          .subscribe((value) => {

            var direcciones: Direccion_Cotizacion[] = [];
            direcciones.push(this.dir_en);
            direcciones.push(this.dir_ins);
            var obDirecciones = { direcciones: direcciones, Id_cliente: parseInt(this.cotizacion.Id_Cliente), dir_clie: false, cat_dir: true };

            this.CallCrearEditardireccionesCotizacion(obDirecciones);
            this.cotizacion.entrega_sol = true;
            console.log("Solicitid de entrega con éxico id: " + result);
            this.router.navigate(['/buscadorcotizaciones']);
          });

      }
      else {
        $("#CP_ins").prop("disabled", false);
        this.permisos.deshabilitar_dir_ins = false;
        this.permisos.deshabilitar_dir_env = false;
        console.log("Cancelo Solicitud de Envió.")
        $("#CP_ins").focus();

      }
      console.log(result);
    });
  }

  openSolEntregaDialog(id_cotizacion: any): void {
    let dialogRef_ = this.dialog.open(DialogSolEntregaCompleto, {
      width: '1250px',
      height: '620px',
      data: { name: "nombre", animal: "animal", id_cotizacion: id_cotizacion, creadopor: this.creadopor, homeProgram: this.homeProgram, Certificados: this.Certificados, lineas_cert: this.lineas_cert, ocg: this.cambio_ord_comp_generada }
    });
    dialogRef_.afterClosed().subscribe(result => {
      console.log('Pop Up direcciones cerrado');
      //this.CallgetCotizaciones(null);
    });
  }



  openCancelDialog(): void {
    let dialogCancelRef = this.dialog.open(DialogCancelDialog, {
      width: '550px',
      height: '315px',
      data: { id: this.cotizacion.Id, motivo_cancela: "", numero: this.cotizacion.Numero, redirige: true }
    });

    dialogCancelRef.afterClosed().subscribe(result => {
      if (result == this.cotizacion.Id) {
        this.gotoBuscador();
      }
    });
  }

  openRechazarDialog(): void {
    let dialogRechazarRef = this.dialog.open(DialogRechazar, {
      width: '650px',
      height: '365px',
      data: { id: this.cotizacion.Id, motivo_rechazo: "", numero: this.cotizacion.Numero }
    });

    dialogRechazarRef.afterClosed().subscribe(result => {
      if (result == this.cotizacion.Id) {
        this.gotoBuscador();
      }
    });
  }


  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialogD, {
      width: '450px',
      height: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/buscadorcotizaciones']);
    });
  }

}

//@Component({
//  selector: 'snack-bar-component-example-snack',
//  templateUrl: 'snack-bar-component-example-snack.html',
//  styles: [`.example-pizza-party { color: hotpink; }`],
//})
//export class PizzaPartyComponent { }

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})

export class DialogOverviewExampleDialogD {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogD>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-cancel',
  templateUrl: 'dialog-cancel.html',
})

export class DialogCancelDialog {


  constructor(private heroService: DatosService, private router: Router, public dialogCancelRef: MatDialogRef<DialogCancelDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogCancelRef.close();
  }

  CancelDialogClick(): void {
    var creadoobj = { Id: this.data.id, texto: this.data.motivo_cancela };
    this.heroService.ServicioPostGeneral("cancelar_cotizacion", creadoobj)
      .subscribe((value) => {
        if (this.data.redirige) {
          this.router.navigate(['/buscadorcotizaciones']);
        }
        console.log(value);
      });
    console.log("Este id viene del dialog: " + this.data.id);
    this.dialogCancelRef.close();
  }

}
//FIN POP UP CANCEL


//@Component({
//  selector: 'dialog-tarjetas-msi',
//  templateUrl: 'dialog-tarjetas-msi.html',
//})

//export class DialogPromoMeses {
//  lista_tarejtas: any[]  = [];

//  constructor(private heroService: DatosService, private router: Router, public dialogPromoMeses: MatDialogRef<DialogPromoMeses>, @Inject(MAT_DIALOG_DATA) public data: any) { }

//  ngOnInit() {
//    //var div = document.getElementById('marco1');
//    //div.setAttribute("style", "height:" + this.data.altoVentana);
//    var creadoobj = { Id: 1 };
//    this.heroService.ServicioPostGeneral("get_cat_tarjetas", creadoobj)
//      .subscribe((value) => {
//        this.lista_tarejtas = value.res;
//        console.log(value);
//      });
//  }

//  onNoClick(): void {
//    this.dialogPromoMeses.close();
//  }

//  ConfirmaPromo(): void {
    
//    let res = { id: this.data.id_tarjeta }
//    this.dialogPromoMeses.close(res);

//  }

//}
//FIN POPUP PROMOCION MESES


@Component({
  selector: 'dialog-rechazar',
  templateUrl: 'dialog-rechazar.html',
})

export class DialogRechazar {


  constructor(private heroService: DatosService, private router: Router, public dialogRechazarRef: MatDialogRef<DialogRechazar>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRechazarRef.close();
  }

  RechazarDialogClick(frmvalida: boolean): void {
    if (frmvalida && this.data.motivo_rechazo.length > 0) {
      var creadoobj = { Id: this.data.id, texto: this.data.motivo_rechazo };
      this.heroService.ServicioPostGeneral("rechazar_cotizacion", creadoobj)
        .subscribe((value) => {
          this.router.navigate(['/buscadorcotizaciones']);
          console.log(value);
        });
      console.log("Este id viene del dialog rechzazar id: " + this.data.id);
      this.dialogRechazarRef.close();
    }
  }

}


@Component({
  selector: 'dialog-sol-entrega',
  templateUrl: 'dialog-sol-entrega.html',
})

export class SolEntregaDialog {

  constructor(private heroService: DatosService,
    public dialogSolEntrega: MatDialogRef<SolEntregaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  NoSolEntClick(): void {
    this.dialogSolEntrega.close();
  }

  SolEntregaRefClick(): void {

    // this.dialogSolEntrega.close();
  }

}


@Component({
  selector: 'dialog-ibs',
  templateUrl: 'dialog-ibs.html',
})

export class DialogIBS {
  emaild1_ibs = new FormControl(this.data.emailibs, [Validators.email]);
  emaild2_ibs = new FormControl('', [Validators.email]);
  emaild3_ibs = new FormControl('', [Validators.email]);

  private correos: string[] = [];

  constructor(private heroService: DatosService, private router: Router,
    public dialogIBS: MatDialogRef<DialogIBS>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  NoIBSClick(): void {
    this.dialogIBS.close();
  }

  IBSRefClick(ibsvalido: boolean): void {
    if (ibsvalido) {
      if (this.data.emailibs != null) {
        this.correos.push(this.data.emailibs);
      }
      if (this.emaild2_ibs.valid && this.emaild2_ibs != this.emaild1_ibs) {
        this.correos.push(this.emaild2_ibs.value);

      }
      if (this.emaild3_ibs.valid && this.emaild3_ibs != this.emaild2_ibs && this.emaild3_ibs != this.emaild1_ibs) {
        this.correos.push(this.emaild3_ibs.value);

      }
      //var creadoobj = { Id: this.data.id, ibs: this.data.ibs }; //this.data.id };
      var creadoobj = { Id: this.data.id, ibs: this.data.ibs, correos: this.correos }; //this.data.id };
      this.heroService.ServicioPostGeneral("edita_cotizacion_ibs", creadoobj)
        .subscribe((value) => {
          // this.cotizacion.ibs = creadoobj.ibs;
          this.router.navigate(['/buscadorcotizaciones']);
          this.dialogIBS.close();
          console.log("Edición de IBS éxitosa id: " + this.data.id);
        });
    }

  }

}

var ELEMENT_DATA: Element[] = [];
var ELEMENT_DATAIMG: Element[] = [];

///////////////////////////////////////////////////////////////////////////////////////////////POP UP 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Editar Direcciones envio


@Component({
  selector: 'dialog-editar-direcciones',
  templateUrl: 'dialog-editar-direcciones.html',
})
 
export class DialogSolEntregaCompleto {

  dir_en = new Direccion_Cotizacion();
  dir_ins = new Direccion_Cotizacion();
  id_cliente: number;
  direccions: Direccion_Cotizacion[] = [];
  public mask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public mask09 = [/[0-9]/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public maskcp = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  prefijos_dir = ['Avenida', 'Av.', 'boulevard', 'Boulevard', 'Blvr', 'Blvr', 'Calzada', 'Calz.', 'avenida', 'av.', 'Calle', 'calle'];
  prefijos_calle: any[] = [{ "id": 1, "prefijo": "Calzada" }, { "id": 2, "prefijo": "Avenida" }, { "id": 3, "prefijo": "Boulevard" }, { "id": 4, "prefijo": "Cerrada" }, { "id": 5, "prefijo": "Calle" }];
  copiar_dir: boolean = false;

  //Direccion Envio
  date = new FormControl(new Date());
  fecha_env: string = moment().format("MM/DD/YYYY");

  //Direccion Instalacion
  date_ins = new FormControl(new Date());
  fecha_ins: string = moment().format("MM/DD/YYYY");

  Calle_ins_valido: boolean = true;
  Calle_env_valido: boolean = true;
  estados: any[] = [];
  estados_ins: any[] = [];
  estados_en: any[] = [];
  Municipios_Env: any[] = [];
  Municipios_Ins: any[] = [];
  Localidades_Ins: any[] = [];
  Localidades_Env: any[] = [];
  Municipios_fac: any[] = [];
  f_envio_valida: boolean = true;
  f_ins_valida: boolean = true;
  fechas_validas: boolean = true;
  idHP: number;
  caso: number;
  //detCot: DetallecotizacionComponent = new DetallecotizacionComponent();
  //////////funciones

  public validar_prefijos(text: any) {
    for (var prefijo of this.prefijos_dir) {
      if (text == prefijo) {
        this.Calle_ins_valido = false;
        break;
      }
      else {
        this.Calle_ins_valido = true;
      }
    }
  }

  public validar_prefijos_env(text: any) {
    for (var prefijo of this.prefijos_dir) {
      if (text == prefijo) {
        this.Calle_env_valido = false;
        break;
      }
      else {
        this.Calle_env_valido = true;
      }
    }
  }

  public GuardarSolcitar(esvalido: boolean) {
    this.ValidarServicios(this.dir_ins.cp, this.data.id_cotizacion);
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
    if (esvalido && this.f_envio_valida && this.f_ins_valida && this.fechas_validas) {

      this.direccions.push(this.dir_en);
      this.direccions.push(this.dir_ins);
      var obDirecciones = { direcciones: this.direccions, Id_cliente: this.id_cliente, dir_clie: false, cat_dir: true };
      this.heroService.CrearEditarDireccionesCotizacion(obDirecciones)
        .subscribe((value) => {
          debugger;
          switch (value.result) {
            case "Error":
              console.log("Ocurrio un error al guardar la dirección: " + value.detalle);
              break;
            default:
              if (value.result == "Success") {
                console.log(value.detalle);
                this.CallGuardarSolicitud();
              }
          }
        });

      
    }
  }

  public diaSemana(mes: string, dia: string, anio: string): boolean {
    //debugger;
    var valida: boolean = false;
    var ocg = new Date(this.data.ocg);
    if (ocg.getFullYear() < 2000) {
      ocg = new Date();
    }
    //var hoy = new Date();
    var fecha = new Date(mes + ' ' + dia + ', ' + anio + ' 00:00:01');
    if (fecha.getTime() <= ocg.getTime())
      return valida;
    var oneDay = 24 * 60 * 60 * 1000; // Calculates milliseconds in a day
    var diffDays = Math.abs((fecha.getTime() - ocg.getTime()) / (oneDay));
    debugger;
    if (diffDays > 119)
      valida = true
    //var dia_sem = dt.getUTCDay();
    return valida;
  };

  asignarFecha_env() {
    this.dir_en.fecha_Estimada = (this.date.value.getMonth() + 1) + '/' + this.date.value.getDate() + '/' + this.date.value.getFullYear()
    this.f_envio_valida = this.diaSemana(this.date.value.getMonth() + 1, this.date.value.getDate(), this.date.value.getFullYear());
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
  }

  asignarFecha_ins() {
    this.dir_ins.fecha_Estimada = (this.date_ins.value.getMonth() + 1) + '/' + this.date_ins.value.getDate() + '/' + this.date_ins.value.getFullYear();
    this.f_ins_valida = this.diaSemana(this.date_ins.value.getMonth() + 1, this.date_ins.value.getDate(), this.date_ins.value.getFullYear());
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
  }

  public compare(dateTimeA, dateTimeB) {
    //debugger;
    var momentA = new Date(dateTimeA);
    var momentB = new Date(dateTimeB);
    if (momentA.getTime() > momentB.getTime())
      this.fechas_validas = false;
    else
      this.fechas_validas = true;
  }

  //public CallCrearEditardireccion(direccion: Cat_Direccion) {
  public CallGuardarSolicitud() {
    var creadoobj = { Id: this.data.id_cotizacion };
    this.heroService.ServicioPostGeneral("solicitar_entrega", creadoobj)
      .subscribe((value) => {
        debugger;
        if (value.result != undefined) {
          if (value.result == "Success") {
            console.log("Solicitid de entrega con éxito id: " + this.data.id_cotizacion);
            this.dialogRef.close();
            this.router.navigate(['/buscadorcotizaciones']);
          }
          else {
            console.log("Error en la cotizacion " + this.data.id_cotizacion + ": " + value.detalle);
          }
        }
      });
  }

  

  ngOnInit() {
    var creadoobj = { Id: this.data.id_cotizacion, Id_user: this.data.creadopor };
    this.heroService.ServicioPostGeneral("GetCotizacionCompleta", creadoobj)
      .subscribe((value) => {
        debugger;
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al cargar la cotización: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              this.id_cliente = value.item[0].id_Cliente;
              /// Direccion ins

              this.dir_ins.id_cotizacion = parseInt(value.item[0].Id);
              this.dir_ins.tipo_direccion = 1;
              if (value.item[0].direcciones_ins[0]) {
                this.dir_ins = value.item[0].direcciones_ins[0];
                this.getDireccionPorCP(value.item[0].direcciones_ins[0].id_localidad);
                this.date_ins = new FormControl(new Date(this.dir_ins.fecha_Estimada));
                this.dir_ins.fecha_Estimada = (this.date_ins.value.getMonth() + 1) + '/' + this.date_ins.value.getDate() + '/' + this.date_ins.value.getFullYear();
                this.f_ins_valida = this.diaSemana(this.date_ins.value.getMonth() + 1, this.date_ins.value.getDate(), this.date_ins.value.getFullYear());
                this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
              }
              //// Direccion env
              this.dir_en.id_cotizacion = parseInt(value.item[0].Id);
              this.dir_en.tipo_direccion = 2;
              if (value.item[0].direcciones_env[0]) {
                this.dir_en = value.item[0].direcciones_env[0];
                this.getDireccionPorCP_env(value.item[0].direcciones_ins[0].id_localidad);
                this.date = new FormControl(new Date(this.dir_en.fecha_Estimada));
                this.dir_en.fecha_Estimada = (this.date.value.getMonth() + 1) + '/' + this.date.value.getDate() + '/' + this.date.value.getFullYear();
                this.f_envio_valida = this.diaSemana(this.date.value.getMonth() + 1, this.date.value.getDate(), this.date.value.getFullYear());
                this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
              }
            }
        }
      });
  }

  // Replica dirección de Envío en dirección de Instalación
  public replicarDireccion() {
    debugger
    this.dir_ins.tipo_direccion = 1;
    this.dir_ins.nombrecontacto = this.dir_en.nombrecontacto;
    this.dir_ins.telefono = this.dir_en.telefono;
    this.dir_ins.telefono_movil = this.dir_en.telefono_movil
    this.dir_ins.cp = this.dir_en.cp
    this.getDireccionPorCP(this.dir_en.id_localidad);
    this.dir_ins.calle_numero = this.dir_en.calle_numero;
    this.dir_ins.numExt = this.dir_en.numExt;
    this.dir_ins.numInt = this.dir_en.numInt;
    this.date_ins = new FormControl(new Date(this.dir_en.fecha_Estimada));
    this.dir_ins.fecha_Estimada = (this.date_ins.value.getMonth() + 1) + '/' + this.date_ins.value.getDate() + '/' + this.date_ins.value.getFullYear()
    this.dir_ins.id_prefijo_calle = this.dir_en.id_prefijo_calle;
    this.f_ins_valida = this.diaSemana(this.date_ins.value.getMonth() + 1, this.date_ins.value.getDate(), this.date_ins.value.getFullYear());
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
  }

  GuardarHomeP(id: number) {
    let fecha_creacion = moment().format("MM/DD/YYYY");
    //this.heroService.AddProductoCotiza(0, 0, idcotiza, this.id_usuario, this.fecha_creacion)
    this.heroService.AddProductoCotiza(0, 0, id, this.data.id_cotizacion, fecha_creacion, 1)
      .subscribe((value) => {
        debugger;
        //this.preventAbuse = false;
        switch (value.value.response) {
          case "Error":
            break;
          default:
            if (value.value.response == "Success") {
              console.log("home program agregado correctamente");
              //this.getCargaCotizacionCompleta(false);
              //this.GetProductosCarrito(false);
              //this.ActualizarCarrito();
              this.MostrarAviso("home program actualizado por dirección correctamente");
            }
        }
      });
  }

  GuardarCertificado(addSer: number, cer_pr: number, id: number) {
    //debugger;
    //addServ puede traer 3 valores, 0 agrega home Program, 1 agrega certificados y dosagrega ambos
    if (addSer == 0) {
      if (id > 0) {
        this.GuardarHomeP(id);
      }
    }
    else {
      this.productService.saveProductosCertificado(cer_pr).subscribe((value) => {
        debugger;
        switch (value.token) {
          case "Error":
            break;
          default:
            if (value.token == "Success") {
              console.log("Certificado agregado correctamente");
              this.MostrarAviso("Certificado actualizado por dirección correctamente");
              if (addSer == 1) {
                //this.GetProductosCarrito(false);
                //this.getCargaCotizacionCompleta(false);
              }
              else {
                this.GuardarHomeP(id);
              }
            }
        }
      });


    }
  }

  recalcularServicios(casos: number) {
    debugger;
    var cer_prod: any = { cp: this.dir_ins.cp, cotizacion_id: this.data.id_cotizacion, id_usuario: this.data.creadopor, lista_sublineas: this.data.lineas_cert };
    if (casos == 0 || casos == 2) {
      var creado = { "TextoLibre": this.dir_ins.cp };
      this.heroService.ServicioPostGeneral_prods("ConsultaHPbyCp", creado)
        .subscribe((value) => {
          debugger;
          switch (value.result) {
            case "Error":
              this.idHP = 0;
              break;
            default:
              if (value.result == "Success") {
                if (value.item != null) {
                  this.idHP = value.item.id;
                  this.GuardarCertificado(casos, cer_prod, this.idHP);
                }
              }
          }
        });
    }
    else {
      this.GuardarCertificado(casos, cer_prod, 0);
    }
  }

  ValidarServicios(codigop: string, id_cotiza: any) {
    //debugger;
    if (this.data.homeProgram || this.data.Certificados) {
      let creado = { Id1: codigop, Id2: id_cotiza }
      this.heroService.ValidaServiciosActCP(creado).subscribe(response => {
        debugger;
        if (response != undefined) {
          if (response.result == "Success") {
            console.log(response.item);
            if (response.item.valido_cp_home && response.item.valido_cp_cert) {
              console.log("No es necesario recalcular");
            }
            else {
              if (!response.item.valido_cp_home && response.item.valido_cp_cert) {
                //solo home
                this.caso = 0;
              }
              else if (response.item.valido_cp_home && !response.item.valido_cp_cert) {
                this.caso = 1;
                //solo certificados
              }
              else {
                this.caso = 2;
                //home y certificados
                //this.openCambioDir(2);
              }
              debugger;
              //if (this.cotizacion.Estatus == 1) this.openCambioDir(this.caso);
              //else
              this.recalcularServicios(this.caso);
            }

          }
        }
      });
    }
    else {
      return 0;
    }
  }

  getDireccionPorCP(id_localidad_: any) {
    
    if (this.dir_ins.cp) {
      if (this.dir_ins.cp.length == 5) {
        
        this.heroService.GetDireccionPorCP(this.dir_ins.cp)
          .subscribe((value) => {
            switch (value.resultado) {
              case "Error":
                //this.openSnackBar('No hay concidencias para el código postal capturado.');
                this.limpiarInstalacion();
                break;
              default:
                if (value.resultado == "Success") {
                   (this.dir_ins.cp, this.data.id_cotizacion);
                  if (value._item.length > 0) {
                    this.estados_ins = [{ id: value._item[0].id_estado, desc_estado: value._item[0].estado }];
                    this.dir_ins.id_estado = value._item[0].id_estado;
                    this.Municipios_Ins = value._item[0].municipios;
                    if (this.Municipios_Ins.length == 1)
                      this.dir_ins.id_municipio = this.Municipios_Ins[0].id_municipio
                    this.Localidades_Ins = value._item[0].localidades;
                    if (this.Localidades_Ins.length == 1)
                      this.dir_ins.id_localidad = this.Localidades_Ins[0].id_localidad;
                    else {
                      if (id_localidad_ != 0) {
                        this.dir_ins.id_localidad = id_localidad_;
                        this.dir_ins.id_municipio = this.dir_en.id_municipio;
                      }
                    }
                  }
                  else {
                    //this.openSnackBar('No hay concidencias para el código postal capturado.');
                    this.limpiarInstalacion();
                  }
                }
            }
          });
      }
      else {
        // //this.openSnackBar('No hay concidencias para el código postal capturado.');
        this.limpiarInstalacion();
      }
    }
  }

  MostrarAviso(texto: string) {
    this.snackBar.open(texto, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });
  }

  getDireccionPorCP_env(id_localidad_: any) {
    if (this.dir_en.cp) {
      if (this.dir_en.cp.length == 5) {
        this.heroService.GetDireccionPorCP(this.dir_en.cp)
          .subscribe((value) => {
            switch (value.resultado) {
              case "Error":
                //this.openSnackBar('No hay concidencias para el código postal capturado.');
                this.limpiarEnvio();
                break;
              default:
                if (value.resultado == "Success") {
                  if (value._item.length > 0) {
                    this.estados_en = [{ id: value._item[0].id_estado, desc_estado: value._item[0].estado }];
                    this.dir_en.id_estado = value._item[0].id_estado;
                    this.Municipios_Env = value._item[0].municipios;
                    if (this.Municipios_Env.length == 1)
                      this.dir_en.id_municipio = this.Municipios_Env[0].id_municipio
                    this.Localidades_Env = value._item[0].localidades;
                    if (this.Localidades_Env.length == 1)
                      this.dir_en.id_localidad = this.Localidades_Env[0].id_localidad
                    else {
                      if (id_localidad_ != 0)
                        this.dir_en.id_localidad = id_localidad_;
                    }
                  }
                  else {
                    //this.openSnackBar('No hay concidencias para el código postal capturado.');
                    this.limpiarEnvio();
                  }
                }
            }
          });
      }
      else {
        // //this.openSnackBar('No hay concidencias para el código postal capturado.');
        this.limpiarEnvio();
      }
    }
  }

  limpiarEnvio() {
    this.dir_en.id_municipio = 0;
    this.dir_en.id_estado = 0;
    this.dir_en.id_localidad = 0;
    this.Municipios_Env = null;
    this.estados_en = null;
    this.Localidades_Env = null;
  }

  limpiarInstalacion() {
    this.dir_ins.id_municipio = 0;
    this.dir_ins.id_estado = 0;
    this.dir_ins.id_localidad = 0;
    this.Municipios_Ins = null;
    this.estados_ins = null;
    this.Localidades_Ins = null;
  }

  constructor(private heroService: DatosService, private productService: ProductsService, private router: Router,
    public dialogRef: MatDialogRef<DialogSolEntregaCompleto>, @Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar) { }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
//////////////////fin editar direcciones envio 
