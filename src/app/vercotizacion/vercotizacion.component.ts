import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { Cat_Direccion, Direccion_Cotizacion } from '../models/cotizacion';
import { Cotizaciones } from '../models/cotizacion';
import { Clientes } from '../models/cotizacion';
import { DatosFiscales } from '../models/cotizacion';
import { permisos_cotizacion_detalle } from '../models/cotizacion';
import { DialogCancelDialog } from '../detallecotizacion/detallecotizacion.component';

@Component({
  selector: 'app-vercotizacion',
  templateUrl: './vercotizacion.component.html',
  styleUrls: ['./vercotizacion.component.css']
})

export class VercotizacionComponent implements OnInit {
  today = Date.now();

  Productos: any[] = [];
  Cuentas: any[] = [];
  Modelos: any[] = [];
  Sucursales: any[] = [];
  filteredOptions: Observable<any[]>;
  filteredOptions1: Observable<any[]>;
  filteredOptionsM: Observable<any[]>;
  selectedValue: string;
  /////// Var Servicio ///
  TextoLibre: string = "";
  fechafin: string = "";
  fechaini: string = "";
  Estatus: string = "";
  Canal: string = "";
  TextoProd: string = "";
  Cuenta: string = "";
  Id_sucursal: string = "0";
  rangofechas: string = "";
  Fechainirango: string = "";
  _Modelo: string = "";
  duplicadas: boolean = false;
  solicitudes: boolean = false;
  canceladas: boolean = false;
  rechazadas: boolean = false;
  Fechafinrango
  estatusCo = [];
  canalesCo = [];
  admon: boolean = true;
  animal: string;
  name: string;

  displayedColumns = ['folio', 'cuenta', 'sucursal', 'cliente', 'fecha', 'cambio_ord_comp_generada', 'vendedor', 'importe', 'importe_c', 'nprod', 'estatus', 'acciones'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  preventAbuse = true;

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  public estatusC: string[];
  email: string;
  password: string;
  token: boolean;
  message: {};
  validar: boolean = false;
  id_app: number;
  rol_user: string = "";
  IDUSR: string = "0";
  carpetaestatus: string = 'estatus'
  user_session: any;
  
  ///////DATE PICKER
  public daterange: any = {};

  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };

  public selectedDate(value: any, datepicker?: any) {
    this.Fechainirango = value.start._d.getDate() + '/' + (value.start._d.getMonth() + 1) + '/' + value.start._d.getFullYear()
    this.Fechafinrango = value.end._d.getDate() + '/' + (value.end._d.getMonth() + 1) + '/' + value.end._d.getFullYear()
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;

  }
  ///////DATE PICKER
  constructor(private heroService: DatosService, private router: Router, public dialog: MatDialog, public matDatepicker: MatDatepickerModule) {
    
  }

  myControl: FormControl = new FormControl();
  myControl1: FormControl = new FormControl();
  myControlM: FormControl = new FormControl();

  cargar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
    
    this.heroService.ServicioPostGeneral_nuevo("Token/GetUserToken/", this.IDUSR).subscribe(response => {
      debugger;
      if (response != undefined) {
        if (response.result == "Error") {
          localStorage.clear();
          window.location.href = "";
        }
      }
    });
  }

  ngOnInit() {

    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.user_session = JSON.parse(localStorage.getItem("user"));
      this.rol_user = JSON.parse(localStorage.getItem("user")).rol;
      this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
      this.cargar_estilos();

      if ((this.rol_user == "1" && this.user_session.id_canal == 3 && this.user_session.nivel != "sucursal") || (this.rol_user == "8" || this.rol_user == "9" || this.rol_user == "10005")) {
        this.displayedColumns = ['folio', 'cuenta', 'sucursal', 'cliente', 'fecha', 'cambio_ord_comp_generada', 'vendedor', 'importe', 'importe_c', 'ibs', 'nprod', 'estatus', 'acciones'];
        this.admon = true;
        if (this.rol_user == "8" || this.rol_user == "9" || this.rol_user == "10005")
          this.carpetaestatus = 'estatusadmin';
      }
      else {
        this.admon = false;
        this.displayedColumns = ['folio', 'cuenta', 'sucursal', 'cliente', 'fecha', 'cambio_ord_comp_generada', 'vendedor', 'importe', 'ibs', 'nprod', 'estatus', 'acciones'];
      }
      this.duplicadas = true;
      this.solicitudes = true;
      this.rechazadas = true;
      this.canceladas = true;
      this.getEstatusC();
      this.getCat_canales();
      this.getCat_productos();
      this.getCat_Cuentas();
      this.getModelos();
      this.getCat_Sucursales();
      
      this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), map(val => this.filter(val)));
      this.filteredOptionsM = this.myControlM.valueChanges.pipe(startWith(''), map(val => this.filterM(val)));

    }
  }

  goTodetalle(id: number) {
    this.router.navigate(['/detallecotizacion/' + id]);
  }

  filter(val: string) {
    return this.Productos.filter(option => option.nombre.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }


  filterM(val: string) {
    return this.Modelos.filter(option => option.modelo.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  getEstatusC(): void {
    this.heroService.service_catalogos("Catalogos/EstatusCotizacion")
      .subscribe((value) => {
        this.estatusCo = value;
      });
  }

  getCat_canales(): void {
    var creadoobj = { Id: this.IDUSR };
    this.heroService.ServicioPostGeneral("Canales_por_usuario", creadoobj)
      .subscribe((value) => {
        this.canalesCo = value.item;
      });

  }

  LiberarCotizacion(id: number): void {
    var creadoobj = { Id: id };
    this.heroService.ServicioPostGeneral("liberar_cotizacion", creadoobj)
      .subscribe((value) => {
        this.CallgetCotizaciones(null);
      });
  }

  getCat_Cuentas(): void {
    var creadoobj = { Id1: this.Canal == "" ? "0" : this.Canal, Id2: this.IDUSR };
    this.heroService.ServicioPostGeneral("Cuentas_por_Canal_usr", creadoobj)
      .subscribe((value) => {
        this.Cuentas = value.item;
      });
  }

  getCat_Sucursales(): void {
    var creadoobj = { Id1: this.Canal == "" ? "0" : this.Canal, Id2: this.Cuenta == "" ? "0" : this.Cuenta, Id3: this.IDUSR };
    this.heroService.ServicioPostGeneral("SucursalesPorCanalCuentaUsuario", creadoobj)
      .subscribe((value) => {
        this.Sucursales = value.item;
        this.CallgetCotizaciones(null);
      });
  }

  getModelos(): void {
    var creadoobj = { TextoLibre: "" };
    this.heroService.ServicioPostGeneral("modelos_autocomplete", creadoobj)
      .subscribe((value) => {
        this.Modelos = value.item;
      });
  }

  getCat_productos(): void {
    this.heroService.service_catalogos("Catalogos/Cat_Productos")
      .subscribe((value) => {
        debugger; 
        this.Productos = value.item;
      });
  }

  ngOnDestroy() {
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  setservicio(id) {
    //console.log(id);
  }


  ToAddProd(): void {
    this.router.navigate(['/cargarproductos/0']);
  }

  imprimir_cotizacion(id_cotiza: number): void {
    debugger;
    var url_serv = this.heroService.heroesUrl + "Estimates/PDF2/";
    this.heroService.ServicioPostGeneral_Remoto(url_serv, id_cotiza)
      .subscribe((value) => {
        console.log(value);
        debugger;
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

  Cancelar_cotizacion(id_cotiza: number): void {
    debugger;
    this.openCancelDialog(id_cotiza);
  }


  openCancelDialog(id_cotiza: number): void {
    debugger;
    let dialogCancelRef = this.dialog.open(DialogCancelDialog, {
      width: '550px',
      height: '315px',
      data: { id: id_cotiza, motivo_cancela: "", numero: id_cotiza, redirige: false }
    });

    dialogCancelRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        //this.gotoBuscador();
        //Refresh
        this.CallgetCotizaciones(null);
      }
    });
  }


  CallgetCotizaciones(obj) {
    debugger;
    this.heroService.getCotizaciones(
      this.TextoLibre,
      this.Fechainirango,
      this.Fechafinrango,
      this.Estatus == "" ? "0" : this.Estatus, this.Cuenta == "" ? "0" : this.Cuenta,
      this.Canal == "" ? "0" : this.Canal,
      this.TextoProd,
      this.IDUSR,
      this._Modelo,
      this.duplicadas,
      this.Id_sucursal == "" ? "0" : this.Id_sucursal,
      this.solicitudes,
      this.canceladas,
      this.rechazadas
    ).subscribe((value) => {
      switch (value.token) {
        case "Error":
          this.message = "Ocurrio un error al cargar las Cotizaciones";
          this.validar = true;
          break;
        default:
          if (value.token == "Success") {
            debugger;
            ELEMENT_DATA = value.item;
            this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.preventAbuse = false;
          }
      }
    });
  }
  limpia() {
    debugger;
    this.TextoLibre = "";
    this.Fechainirango = "";
    this.Fechafinrango = "";
    this.Estatus = "";
    this.Cuenta = "";
    this.Canal = "";
    this.TextoProd = "";
     
    this._Modelo = "";
    this.Id_sucursal = "";
    this.solicitudes = true;
    this.canceladas = true;
    this.rechazadas = true;
    this.getCat_Cuentas();
    this.getCat_Sucursales();
    this.CallgetCotizaciones(null);


  }
  //public CallEditaIbs(id, ibs, correos): void {
  //  this.heroService.CallEditaIbs(id, ibs, correos)
  //    .subscribe((value) => {
  //      this.CallgetCotizaciones(null);
  //      switch (value.response) {
  //        case "Error":
  //          console.log("Ocurrio un error al editar condiciones cotizació: " + id);
  //          break;
  //        default:
  //          if (value.response == "Success") {
  //            console.log('Cotización: ' + id + ' editada correctamente')
  //          }
  //      }
  //    });
  //}

  openDialog_(cotizacion: any): void {

    console.log(cotizacion);
    let dialogRef_ = this.dialog.open(DialogOverviewExampleDialogF, {
      width: '1250px',
      height: '620px',
      data: { name: this.name, animal: this.animal, id_cotizacion: cotizacion.id, creadopor: this.IDUSR, ocg: cotizacion.cambio_ord_comp_generada }
    });
    dialogRef_.afterClosed().subscribe(result => {
      console.log('Pop Up direcciones cerrado');
      this.CallgetCotizaciones(null);
    });
  }

  /// abrir dialog-ibs.html
  openIBSDialog(id_cotizacion: any, correo: any): void {
    //debugger;
    let dialogIBSRef = this.dialog.open(DialogIBSLista, {
      width: '650px',
      height: '450px',
      data: { id: id_cotizacion, ibs: null, emailibs: correo }
    });

    dialogIBSRef.afterClosed().subscribe(result => {
      //debugger;
      if (result == id_cotizacion) {
        console.log("si lo cambio ")

      }
      else {
        console.log("Cancelo edición de IBS.")
      }
      this.CallgetCotizaciones(null);
      console.log('holaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    });
  }
}

var ELEMENT_DATA: Element[] = [];

/////////////////////////////////////////////////////////////////// POP UP /////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'dialog-editar-direcciones',
  templateUrl: 'dialog-editar-direcciones.html',
})
export class DialogOverviewExampleDialogF {

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
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);

    if (esvalido && this.f_envio_valida && this.f_ins_valida && this.fechas_validas) {
      //primero guarda direcciones para despues guardar los cambios en la cotizacion
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
    debugger;
    var valida: boolean = false;
    var cocg = new Date();
    if (this.data.ocg != "") {
      if (new Date(this.data.ocg).getFullYear() > 2000) {
        cocg = new Date(this.data.ocg);
      }
    }
    
    var fecha = new Date(mes + ' ' + dia + ', ' + anio + ' 00:00:01');
    if (fecha.getTime() <= cocg.getTime())
      return valida;
    var oneDay = 24 * 60 * 60 * 1000; // Calculates milliseconds in a day
    var diffDays = Math.abs((fecha.getTime() - cocg.getTime()) / (oneDay));
    if (diffDays > 119)
      valida = true
    //var dia_sem = dt.getUTCDay();
    return valida;
  };

  public asignarFecha_env() {
    this.dir_en.fecha_Estimada = (this.date.value.getMonth() + 1) + '/' + this.date.value.getDate() + '/' + this.date.value.getFullYear()
    this.f_envio_valida = this.diaSemana(this.date.value.getMonth() + 1, this.date.value.getDate(), this.date.value.getFullYear());
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
  }

  public asignarFecha_ins() {
    this.dir_ins.fecha_Estimada = (this.date_ins.value.getMonth() + 1) + '/' + this.date_ins.value.getDate() + '/' + this.date_ins.value.getFullYear();
    this.f_ins_valida = this.diaSemana(this.date_ins.value.getMonth() + 1, this.date_ins.value.getDate(), this.date_ins.value.getFullYear());
    this.compare(this.dir_en.fecha_Estimada, this.dir_ins.fecha_Estimada);
  }

  public compare(dateTimeA, dateTimeB) {
    debugger;
    var momentA = new Date(dateTimeA);
    var momentB = new Date(dateTimeB);
    if (momentA.getTime() > momentB.getTime())
      this.fechas_validas = false;
    else
      this.fechas_validas = true;
  }

  public CallGuardarSolicitud() { // NOTA:  Crea-Edita Direccion cotizacion
    var creadoobj = { Id: this.data.id_cotizacion };
    this.heroService.ServicioPostGeneral("solicitar_entrega", creadoobj)
      .subscribe((value) => {
        debugger;
        if (value.result != undefined) {
          if (value.result == "Success") {
            console.log("Solicitid de entrega con éxito id: " + this.data.id_cotizacion);
            this.dialogRef.close();
          }
          else {
            console.log( "Error en la cotizacion " + this.data.id_cotizacion + ": " + value.detalle);
          }
        }
      });
  }

  //public CallCrearEditardireccion(direccion: Direccion_Cotizacion) {
  //  //debugger;
  //  this.heroService.CrearEditarDireccion_cotizacion(direccion)
  //    .subscribe((value) => {
  //      switch (value.result) {
  //        case "Error":
  //          console.log("Ocurrio un error al guardar la dirección: " + value.detalle);
  //          break;
  //        default:
  //          if (value.result == "Success") {
  //            console.log(value.detalle);
  //          }
  //      }
  //    });
  //}

  ngOnInit() {
    var creadoobj = { Id: this.data.id_cotizacion, Id_user: this.data.creadopor };
    this.heroService.ServicioPostGeneral("GetCotizacionCompleta", creadoobj)
      .subscribe((value) => {
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
              /// Direccion env
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
                      if (id_localidad_ != 0)
                        this.dir_ins.id_localidad = id_localidad_;
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

  // Aquí voy, aplicar cambios - Borrar las líneas comentadas una vez probado -
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

  constructor(private heroService: DatosService, public dialogRef: MatDialogRef<DialogOverviewExampleDialogF>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'dialog-ibs',
  templateUrl: 'dialog-ibs.html',
})

export class DialogIBSLista {
  email1_ibs = new FormControl(this.data.emailibs, [Validators.email]);
  email2_ibs = new FormControl('', [Validators.email]);
  email3_ibs = new FormControl('', [Validators.email]);

  getErrorMessage1() {
    return this.email1_ibs.hasError('email1_ibs') ? 'Formato invalido' : '';
  }

  getErrorMessage2() {
    return this.email2_ibs.hasError('email2_ibs') ? 'Formato invalido' : '';
  }
  getErrorMessage3() {
    return this.email3_ibs.hasError('email3_ibs') ? 'Formato invalido' : '';
  }
  private correos: string[] = [];

  constructor(private heroService: DatosService, private router: Router,
    public dialogIBS: MatDialogRef<DialogIBSLista>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  NoIBSClick(): void {
    this.dialogIBS.close();
  }

  IBSRefClick(ibsvalido: boolean): void {
    if (ibsvalido && this.email1_ibs.valid) {
      if (this.data.emailibs != null) {
        this.correos.push(this.data.emailibs);
      }
      if (this.email2_ibs.valid && this.email2_ibs != this.email1_ibs) {
        this.correos.push(this.email2_ibs.value);

      }
      if (this.email3_ibs.valid && this.email3_ibs != this.email2_ibs && this.email3_ibs != this.email1_ibs) {
        this.correos.push(this.email3_ibs.value);

      }
      var creadoobj = { Id: this.data.id, ibs: this.data.ibs, correos: this.correos }; //this.data.id };
      this.heroService.ServicioPostGeneral("edita_cotizacion_ibs", creadoobj)
        .subscribe((value) => {
          this.router.navigate(['/buscadorcotizaciones']);
          this.dialogIBS.close();
          console.log("Edición de IBS éxitosa id: " + this.data.id);
        });
    }

  }

}
