import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { Cat_Direccion } from '../models/cotizacion';
import { Cotizaciones } from '../models/cotizacion';
import { cat_promos, promocion, entidades_participantes } from '../models/promocion'
import { Clientes } from '../models/cotizacion';
import { DatosFiscales } from '../models/cotizacion';
import { permisos_cotizacion_detalle } from '../models/cotizacion';
import * as jquery from 'jquery';
import { linea } from '../models/producto';
import { ProductsService } from '../services/products.service';
import { Utils } from '../utils/utils';
import { config_conmisionesv } from '../models/config-comisionesv';

//import { Refacciones } from '../models/refaccion';

@Component({
  selector: 'app-config-comisionesv',
  templateUrl: './config-comisionesv.component.html',
  styleUrls: ['./config-comisionesv.component.css']
})
export class ConfigComisionesvComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  editar_cc: boolean = false;
  _editar_cc: boolean = false;
  cc_validadas: boolean = false;
  preventAbuse: boolean = true;
  ////// declaración objetos de modelos principales

  catalogos_promo = new cat_promos();
  promocion = new config_conmisionesv();
  sub: any;
  /// multi selección canales participantes 

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  EntidadesPartCtrl = new FormControl();
  filteredEntidadesPart: Observable<string[]>;
  entidades_chips: any[] = [];
  entidades_participantes: any[] = [];
  allEntidades: any[] = [];
  @ViewChild('ent_partInput__') ent_partInput: ElementRef;

  /// multi selección canales participantes 

  visible_e = true;
  selectable_e = true;
  removable_e = true;
  addOnBlur_e = false;
  separatorKeysCodes_e: number[] = [ENTER, COMMA];
  EntidadesPartCtrl_e = new FormControl();
  filteredEntidadesPart_e: Observable<string[]>;
  entidades_chips_e: any[] = [];
  entidades_participantes_e: any[] = [];


  allEntidades_e: any[] = [];
  @ViewChild('ent_partInput_e') ent_partInput_e: ElementRef;

  /// multi selección canales prod_excl 

  visible_p = true;
  selectable_p = true;
  removable_p = true;
  addOnBlur_p = false;
  separatorKeysCodes_p: number[] = [ENTER, COMMA];
  EntidadesPartCtrl_p = new FormControl();
  filteredEntidadesPart_p: Observable<string[]>;
  entidades_chips_p: any[] = [];
  allProductos: any[] = [];
  @ViewChild('ent_partInput_p') ent_partInput_p: ElementRef;


  // buscador productos condiciones

  validar: boolean = false;
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  TextoLibre: string = "";

  // tabla productos participantes
  dataSource_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_PART);
  displayedColumns = ['tipo', 'descripcion', 'cantidad', 'acciones'];

  // buscador regalos

  Productos_reg: any[] = [];
  myControl_reg: FormControl = new FormControl();
  filteredOptions_reg: Observable<any[]>;
  TextoLibre_reg: string = "";
  Cat_Suc: number = 0;

  dataSourcecom = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_CONF_COM);
  displayedColumns_conf_com = ['sucursal','linea', 'sublinea', 'margen_original'];

  // tabla productos participantes
  dataSource_reg = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  displayedColumns_reg = ['tipo', 'descripcion', 'cantidad', 'acciones'];

  //Direccion inicio
  fecha_hoy: string = moment().format("MM/DD/YYYY");
  date_ini = new FormControl(new Date(this.fecha_hoy));
  hora: string = moment().format("HH:mm");
  f_inicio_valida: boolean = true;
  f_fin_valida: boolean = true;

  //Direccion fin
  date_fin = new FormControl(new Date(this.fecha_hoy));
  horafin: string = moment().format("HH:mm");

  //tipos descuento 
  favoriteSeason: number;
  tipos_descuento: any[] = [{ "id": 1, "desc": "Monto sin IVA" }, { "id": 2, "desc": "Porcentaje" }];

  ////checks beneficios
  chk_desc: boolean = false;
  chk_reg: boolean = false;
  chk_msi: boolean = false;

  /// beneficio descuento

  tipo_descuento: number = 0;
  monto_descuento: number = 0;

  // beneficio msi
  tipo_msi: number = 0;

  /// multi selección canales obligatorios 

  visible_o = true;
  selectable_o = true;
  removable_o = true;
  addOnBlur_o = false;
  separatorKeysCodes_o: number[] = [ENTER, COMMA];
  EntidadesPartCtrl_o = new FormControl();
  filteredEntidadesPart_o: Observable<string[]>;
  entidades_chips_o: any[] = [];
  entidades_participantes_o: any[] = [];
  allEntidades_o: any[] = [];
  @ViewChild('ent_obligaInput') ent_obligaInput: ElementRef;

  /// tabs condiciones comerciales

  tabs = ['First', 'Second', 'Third'];
  selected_tab = new FormControl(0);
  public lines: linea[] = [];

  /// tabla afectaciones condiciones comerciales
  public sublineas_aplicables: any[] = [];
  public sucursales_aplicables: any[] = [];
  public lineas_aplicables: any[] = [];
  public canales_aplicables: any[] = [];


  dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);
  displayedColumns_suc_part = ['sucursal', 'margen_original', 'margen_adicional', 'sublinea'];
  margen_adic_gral: number = 0;

  sublineas_filtro: any[] = [];

  _linea_filtro: any = 0;
  _sublinea_filtro: any = 0;
  sucursal_filtro: any = 0;
  canal_filtro: any = 0;


  //// tabla promociones compatibles

  datasource_pc = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM)
  displayedColumns_pc = ['id', 'nombre', 'fecha_hora_inicio', 'fecha_hora_fin'];


  constructor(private route: ActivatedRoute, private heroService: DatosService, private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public matDatepicker: MatDatepickerModule, private productsService: ProductsService) {
    this.filteredEntidadesPart_p = this.EntidadesPartCtrl_p.valueChanges.pipe(startWith(null), map((ent_part_e: any | null) => ent_part_e ? this._filter_p(ent_part_e) : this.catalogos_promo[3]));
    this.filteredEntidadesPart_e = this.EntidadesPartCtrl_e.valueChanges.pipe(startWith(null), map((ent_part_e: any | null) => ent_part_e ? this._filter_e(ent_part_e) : this.catalogos_promo[6]));
    this.filteredEntidadesPart_o = this.EntidadesPartCtrl_o.valueChanges.pipe(startWith(null), map((ent_part_e: any | null) => ent_part_e ? this._filter_o(ent_part_e) : this.catalogos_promo[6]));
    this.filteredEntidadesPart = this.EntidadesPartCtrl.valueChanges.pipe(startWith(null), map((ent_part: any | null) => ent_part ? this._filter(ent_part) : this.catalogos_promo[5]));
  }

  ngOnInit() {
    //
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.body.classList.add('skin-blue');
      this.body.classList.add('sidebar-mini');
      ////////////// CARGAS INICIALES ///////////////////////////////////////////////
      this.get_catalogos_promocion();
      this.cargar_datos_Suc();

      this.set_fechas_promocion();
      this.getLines();
    }

  }

  /////////////////// FUNCIONES DE CARGAS INICIALES //////////////////////////////////
  cargar_datos_Suc() {
//    this.sub = this.route.params.subscribe(params => { this.Cat_Suc = + params['id']; });
    if (this.Cat_Suc > 0) {
      this.preventAbuse = true;

      var busqueda = { id: this.Cat_Suc }
      this.heroService.ServicioPostGeneral("cargar_cat_sucur_id", busqueda).subscribe((value) => {
        //console.log(value)
        setTimeout(() => {
          switch (value.result) {
            case "Error":
              console.log("Cliente - Ocurrio un error al cargar promocion: " + value.detalle);
              break;
            default:
              if (value.result == "Success") {
                ////debugger;
           
                //debugger;
              
                ELEMENT_DATA_CONF_COM = value.item[0].condiones_comerciales_sucursal;
                this.dataSourcecom = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_CONF_COM);
                this.dataSourcecom.paginator = this.paginator
                this.consultar_condiconesc_comerciales(true);

              }
          }
        }, 400);
      });
    }
    else {
      ////debugger;
      this.consultar_condiconesc_comerciales(false);
    }

  }


  getLines() {
    var i = 0; 
    this.productsService.getLines().subscribe((l) => {

      if (!Utils.isEmpty(l)) {
        this.lines = l;
        this.lines.push({ "id": 0, "descripcion": "Todas las Líneas", "estatus": true });
       /* for (var cc of l) {
          this.getSubLines(this.lines[i].id);
          i++;
        }*/ 
        
      } else {
        console.error('Error getting product lines')
      }
    })

  }
  consultar_condiconesc_comerciales_comisiones() {
    this.preventAbuse = true;
    debugger;
    this.heroService.ServicioPostGeneral("consultar_condiconesc_comerciales_comisiones", this.promocion).subscribe((value) => {
      // debugger;
      //setTimeout(() => {
      switch (value.result) {
        case "Error":
          console.log("Cliente - Ocurrio un error al cargar las condiciones comerciales: " + value.detalle);
          this.editar_cc = false; this.cc_validadas = false;
          break;
        case "Success":
          debugger;
          this.sublineas_aplicables = value.item[0].subLineas_aplicables;
          this.sublineas_aplicables.push({ "id": 0, "id_linea_producto": 0, "descripcion": "Todas las Sublíneas", "estatus": true });
          this.sucursales_aplicables = value.item[0].sucursales_aplicables;
          this.sucursales_aplicables.push({ "id": 0, "id_Cuenta": 0, "sucursal": "Todas las Sucursales" });

          this.canales_aplicables = value.item[0].canales_aplicables;
          this.canales_aplicables.push({ "id": 0, "canal": "Todos los Canales" });

          this.lineas_aplicables = value.item[0].lineas_aplicables;
          this.lineas_aplicables.push({ "id": 0, "descripcion": "Todas las líneas" });

          this.preventAbuse = false;
          //// contenido condiciones comerciales
          if (value.item[0].cc_res.length > 0) {
            ELEMENT_DATA_SUCURSALES_CC = value.item[0].cc_res;
            this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);
            //debugger;
            this.promocion.afectacion_cc = value.item[0].afectacion_cc;
            this.editar_cc = true;
          }
          else {
            if (this.sucursales_aplicables.length == 1) {
              alert('En las combinaciones de inclusión/exclusión no quedaron sucursales participantes, verifique y calcule condiciones comerciales de nuevo.');
            }
            if (this.sublineas_aplicables.length == 1) {
              alert('En las combinaciones de inclusión/exclusión no quedaron sublíneas participantes,, verifique y calcule condiciones comerciales de nuevo.');
            }

          }


          break;
      }
      //}, 400);
    });
  }



  consultar_condiconesc_comerciales(ban: boolean) {
   

    //debugger;
    //this.id_entidad = this.route.snapshot.params["id"];
    var creadoobj = { Id: this.route.snapshot.params["id"] };
    debugger; 
    this.heroService.ServicioPostGeneral("consultar_cc_sucursal", creadoobj).subscribe((value) => {
      debugger;
      //alert(creadoobj);
      //setTimeout(() => {
      switch (value.result) {
        case "Error":
          console.log("Cliente - Ocurrio un error al cargar las condiciones comerciales: " + value.detalle);
          break;
        case "Success":
          //debugger;
          this.sublineas_aplicables = value.subLineas_aplicables;
          this.sublineas_aplicables.push({ "id": 0, "id_linea_producto": 0, "descripcion": "Todas las Sublíneas", "estatus": true });
          this.sublineas_filtro = this.sublineas_aplicables;
          //// contenido condiciones comerciales
          if (ban==true) {
            //Valida si sublineas_cambio y agrega los nuevos
            //for (var i = 0; i < value.item.length; i++) {
            //  let exist = ELEMENT_DATA_SUCURSALES_CC.filter(cc => cc.id_Cat_SubLinea_Producto == value.item.id_Cat_SubLinea_Producto);
            //  if (exist == null) {
            //    ELEMENT_DATA_SUCURSALES_CC.push(value.item[i]);
            //  }
            //}
            //ELEMENT_DATA_SUCURSALES_CC = value.item;
            //this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);
          }
          else {
            {
              
              ELEMENT_DATA_CONF_COM = value.item;
              this.dataSourcecom = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_CONF_COM);
              this.dataSourcecom.paginator = this.paginator
            }
          }

        

          this.preventAbuse = false;
          break;
      }
      //}, 400);
    });
  }

  getSubLines(number: any) {
    this.productsService.getSubLines(number).subscribe((l) => {
      if (!Utils.isEmpty(l)) {
        //debugger;
        var i = 0; 
        for (var cc of l) {
          this.sublineas_aplicables.push({ "id": l[i].id, "id_linea_producto": l[i].id_linea_producto, "descripcion": l[i].descripcion, "estatus":true }); 
          i++
        }
      } else {
        console.error('Error getting product  sublines')
      }
    })

    //this.sublineas_aplicables.push({ "id": 0, "id_linea_producto": 0, "descripcion": "Todas las Sublíneas", "estatus": true });
    //this.sublineas_filtro = this.sublineas_aplicables;
  }

  
  get_catalogos_promocion() {
    var creadoobj = { TextoLibre: "" };
    this.heroService.ServicioPostGeneral("get_catalogos_conf_com", creadoobj).subscribe((value) => {
      setTimeout(() => {
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {

              this.catalogos_promo = value.item;
              this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), map(val => this.filter(val)));
              this.filteredOptions_reg = this.myControl_reg.valueChanges.pipe(startWith(''), map(val => this.filter_reg(val)));

              ///// promos compatibles
              var indice: number = this.catalogos_promo[9].indexOf(this.catalogos_promo[9].find(x => x.id == this.promocion.id));
              if (indice >= 0) this.catalogos_promo[9].splice(indice, 1);

              ELEMENT_DATA__PROMO_COM = this.catalogos_promo[9];
              this.datasource_pc = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM)
              this.displayedColumns_pc = ['id', 'nombre', 'fecha_hora_inicio', 'fecha_hora_fin'];

              //// contenido condiciones comerciales
              //ELEMENT_DATA_SUCURSALES_CC = this.catalogos_promo[8];
              //this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);
              this.cargar_promocion_por_id();
            }
        }
      }, 400);
    });
  }


  ////  filtrar cc

  filtrar_ccsub(filtro_linea: boolean) {
    //debugger;
    if (filtro_linea) {
      if (this._linea_filtro > 0) {
        this.sublineas_aplicables = this.sublineas_filtro.filter(sl => sl.id_linea_producto == this._linea_filtro || sl.id == 0);
        this._sublinea_filtro = 0;
      }
      else
        this.sublineas_aplicables = this.sublineas_filtro;
    }

    this.dataSourcecom = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_CONF_COM.filter(cc => cc.id_Cat_SubLinea_Producto == (this._sublinea_filtro == 0 ? cc.id_Cat_SubLinea_Producto : this._sublinea_filtro)
        && cc.id_linea == (this._linea_filtro == 0 ? cc.id_linea : this._linea_filtro)
        && cc.id_sucursal == (this.sucursal_filtro == 0 ? cc.id_sucursal : this.sucursal_filtro)));

    this.dataSourcecom.paginator = this.paginator;

    //debugger;
  }


  //// aplicacion genreal de margen afectaciones CC

  //aplicar_margen_gralsub() {
  //  for (var cc of ELEMENT_DATA_CONF_COM) {

  //    if (cc.id_Cat_SubLinea_Producto == (this._sublinea_filtro == 0 ? cc.id_Cat_SubLinea_Producto : this._sublinea_filtro) && cc.id_sucursal == (this.sucursal_filtro == 0 ? cc.id_sucursal : this.sucursal_filtro)) {
  //      cc.margen = this.margen_adic_gral;
  //    }
  //  }
  //  //debugger;
  //  this.dataSourcecom = new MatTableDataSource<PeriodicElement>
  //    (ELEMENT_DATA_CONF_COM.filter(cc => cc.id_Cat_SubLinea_Producto == (this._sublinea_filtro == 0 ? cc.id_Cat_SubLinea_Producto : this._sublinea_filtro)
  //      && cc.id_sucursal == (this.sucursal_filtro == 0 ? cc.id_sucursal : this.sucursal_filtro)));


  //}

  set_fechas_promocion() {

    this.date_ini = new FormControl(new Date(this.promocion.fecha_hora_inicio));
    this.date_fin = new FormControl(new Date(this.promocion.fecha_hora_fin));
    var fi = new Date(this.promocion.fecha_hora_inicio);
    var ff = new Date(this.promocion.fecha_hora_fin);
    if (!isNaN(fi.valueOf()))
      this.hora = ("0" + fi.getHours()).slice(-2) + ":" + ("0" + fi.getMinutes()).slice(-2);
    else
      this.hora = "00:00";
    if (!isNaN(ff.valueOf()))
      this.horafin = ("0" + ff.getHours()).slice(-2) + ":" + ("0" + ff.getMinutes()).slice(-2);
    else
      this.horafin = "00:00";
  }



  ////////////////////////////// FUNCIONES CARGA PROMOCION ////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

  cargar_promocion_por_id() {
    //debugger; 
    this.sub = this.route.params.subscribe(params => { this.promocion.id = + params['id']; });
    ELEMENT_DATA_PROD_PART = [];
    ELEMENT_DATA_PROD_REGALO = [];
    this.dataSource_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_PART);
    this.dataSource_reg = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
    if (this.promocion.id > 0) {
      var busqueda = { id: this.promocion.id }
      this.heroService.ServicioPostGeneral("cargar_promocion_por_id_comision", busqueda).subscribe((value) => {
        console.log(value)
        setTimeout(() => {
          switch (value.result) {
            case "Error":
              console.log("Cliente - Ocurrio un error al cargar promocion: " + value.detalle);
              break;
            default:
              if (value.result == "Success") {
                //debugger; 
                this.promocion = value.item[0];
                this.poblar_cotizacion();
                this.preventAbuse = false;
              }
          }
        }, 400);
      });
    }
    else {
      this.preventAbuse = false;
      this.promocion.id_tipos_herencia_promo = 1;
    }

  }
  //////////////////////////////////////////////// POBLAR PROMOCION //////////////////////////////////
  poblar_cotizacion() {

    ////// set fechas
    this.set_fechas_promocion();
    //debugger;
    ////// entidades participantes
    for (var ep of this.promocion.entidades_participantes) {
      var obj = this.catalogos_promo[5].filter(x => x.id == ep.id_entidad && x.id_tipo == ep.id_tipo_entidad);
      this.entidades_chips.push(obj[0].descripcion)
    }
    //debugger;
    ////// entidades excluidas
    if (this.promocion.entidades_excluidas != undefined) {
      for (var ex of this.promocion.entidades_excluidas) {
        var obj = this.catalogos_promo[6].filter(x => x.id == ex.id_entidad && x.id_tipo == ex.id_tipo_entidad);
        this.entidades_chips_e.push(obj[0].descripcion);
      }

    }
    //debugger;
    ////// entidades obligatorias
    if (this.promocion.entidades_obligatorias != undefined) {
      for (var ex of this.promocion.entidades_obligatorias) {
        var obj = this.catalogos_promo[6].filter(x => x.id == ex.id_entidad && x.id_tipo == ex.id_tipo_entidad);
        this.entidades_chips_o.push(obj[0].descripcion)
      }
    }
    //debugger;
    ////// productos participantes
    if (this.promocion.productos_excluidos != undefined) {
      for (var pe of this.promocion.productos_excluidos) {
        var obj = this.catalogos_promo[3].filter(x => x.id == pe.id_producto && x.id_tipo == pe.id_tipo_categoria);
        this.entidades_chips_p.push(obj[0].descripcion)
      }
    }

    //debugger;
    //////////////productos participantes
    for (var pp of this.promocion.productos_condicion) {
      var obj = this.catalogos_promo[3].filter(x => x.id == pp.id_producto && x.id_tipo == pp.id_tipo_categoria);
      ELEMENT_DATA_PROD_PART.push({
        tipo: obj[0].tipo, descripcion: obj[0].descripcion, cantidad: 1, acciones: "Eliminar", id_producto: obj[0].id
      });

      this.dataSource_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_PART);
      this.dataSource_part.paginator = this.paginator;
      //debugger;
      //////// cargar cc 
      //  this.consultar_condiconesc_comerciales();
    }

    //////////// tabla promociones compatibles
    if (this.promocion.promociones_compatibles != undefined) {
      for (var pc of this.promocion.promociones_compatibles) {
        var i = 0;
        for (var promo of this.catalogos_promo[9]) // marca los checks
        {
          if (pc.id_promocion == promo.id || pc.id_promocion_2 == promo.id) {
            this.catalogos_promo[9][i].compatible = true
          }
          i++;
        }
      }
    }
    
    //debugger;
    var indice: number = this.catalogos_promo[9].indexOf(this.catalogos_promo[9].find(x => x.id == this.promocion.id));
    if (indice >= 0) this.catalogos_promo[9].splice(indice, 1);

    ELEMENT_DATA__PROMO_COM = this.catalogos_promo[9];
    this.datasource_pc = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM)
    this.displayedColumns_pc = ['id', 'nombre', 'fecha_hora_inicio', 'fecha_hora_fin'];

    /////////////////////////////// beneficio descuento
    if (this.promocion.beneficios_promocion != undefined) {
      for (var b of this.promocion.beneficios_promocion) {
        if (b.id_cat_beneficios == 1) {
          this.chk_desc = true;
          this.tipo_descuento = this.promocion.beneficio_desc[0].es_porcentaje == true ? 2 : 1;
          this.monto_descuento = this.promocion.beneficio_desc[0].cantidad;
        }

    }
      /////////////////////////////// beneficio regalos

      if (b.id_cat_beneficios == 2) {
        ELEMENT_DATA_PROD_REGALO = [];
        this.chk_reg = true;
        for (var pg of this.promocion.beneficio_productos) {
          var obj = this.catalogos_promo[4].filter(x => x.id == pg.id_producto);
          ELEMENT_DATA_PROD_REGALO.push({
            tipo: obj[0].tipo, descripcion: obj[0].descripcion, cantidad: 1, acciones: "Eliminar", id_producto: obj[0].id
          });
        }

      }
      //debugger;
      this.dataSource_reg = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
      this.dataSource_reg.paginator = this.paginator_reg;

      /////////////////////////////// beneficio msi
      if (b.id_cat_beneficios == 3) {
        this.chk_msi = true;
        this.tipo_msi = this.promocion.beneficio_msi[0].id_cat_msi;
      }
    }

    /////////////////////////////// afectaciona a cc
    //debugger;
    this.mostrar_ocultar_afecaciones_cc(this.promocion.id != 0)
    //debugger;
  }


  ////////////////////////////// FUNCIONES GUARDAR PROMOCION ////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

  crear_editar_promocion() {

    //this.set_sipo_beneficio();
    //debugger; 
    this.asignarFecha_fin();
    this.promocion.fecha_hora_fin = this.promocion.fecha_hora_fin + " " + this.horafin;
    this.asignarFecha_inicio();
    //debugger;
   
    if (this.promocion.id_cat_tipo_condicion == 2) {
      this.promocion.monto_condicion = 0;
      this.promocion.monto_superior = 0;
    }
    this.promocion.fecha_hora_inicio = this.promocion.fecha_hora_inicio + " " + this.hora;
    debugger; 
    this.heroService.ServicioPostGeneral("crear_editar_config_comision", this.promocion).subscribe((value) => {
      setTimeout(() => {
        debugger;
        switch (value.result) {
          case "Error":
            console.log("Cliente - Ocurrio un error al crear-editar una promocion: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              // console.log(value.detalle);
              this.goTobuscador();
            }
        }
      }, 400);
    });
  }

  goTobuscador() {
    this.router.navigate(['/buscarcomisiones']);
  }

  
  
  ///  editar margenes

  set_nuevo_margen(event, row, index) {

    var Id_Ctrl = event.srcElement.getAttribute("id")
    Id_Ctrl = Id_Ctrl.replace("ccs_", "");
    var Val_Ctrl = event.srcElement.value;
    Val_Ctrl = Val_Ctrl == "" ? 0 : Val_Ctrl;
    var indice_: number = this.promocion.afectacion_cc.indexOf(this.promocion.afectacion_cc.find(x => x.id_condiones_comerciales_sucursal == Id_Ctrl));
    if (indice_ >= 0) {
      this.promocion.afectacion_cc[indice_].margen = Val_Ctrl;
      ELEMENT_DATA_SUCURSALES_CC[indice_].margen_adicional = Val_Ctrl;
    }
  };

  ////  filtrar cc

  filtrar_cc() {
    debugger;
    this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_SUCURSALES_CC.filter(cc => cc.id_sublinea == (this._sublinea_filtro == 0 ? cc.id_sublinea : this._sublinea_filtro)
        && cc.id_sucursal == (this.sucursal_filtro == 0 ? cc.id_sucursal : this.sucursal_filtro)
        && cc.id_canal == (this.canal_filtro == 0 ? cc.id_canal : this.canal_filtro)
        && cc.id_linea == (this._linea_filtro == 0 ? cc.id_linea : this._linea_filtro)));
  }

  //// aplicacion genreal de margen afectaciones CC

  aplicar_margen_gral() {
    for (var cc of ELEMENT_DATA_SUCURSALES_CC) {

      if (cc.id_sublinea == (this._sublinea_filtro == 0 ? cc.id_sublinea : this._sublinea_filtro)
        && cc.id_sucursal == (this.sucursal_filtro == 0 ? cc.id_sucursal : this.sucursal_filtro)
        && cc.id_canal == (this.canal_filtro == 0 ? cc.id_canal : this.canal_filtro)
        && cc.id_linea == (this._linea_filtro == 0 ? cc.id_linea : this._linea_filtro)) {
        cc.margen_adicional = this.margen_adic_gral;

        var indice_: number = this.promocion.afectacion_cc.indexOf(this.promocion.afectacion_cc.find(x => x.id_condiones_comerciales_sucursal == cc.id));
        if (indice_ >= 0) {
          this.promocion.afectacion_cc[indice_].margen = this.margen_adic_gral;
        }
      }
    }
    //debugger;
    this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_SUCURSALES_CC.filter(cc => cc.id_sublinea == (this._sublinea_filtro == 0 ? cc.id_sublinea : this._sublinea_filtro)
        && cc.id_sucursal == (this.sucursal_filtro == 0 ? cc.id_sucursal : this.sucursal_filtro)
        && cc.id_canal == (this.canal_filtro == 0 ? cc.id_canal : this.canal_filtro)
        && cc.id_linea == (this._linea_filtro == 0 ? cc.id_linea : this._linea_filtro)));


  }

  ///////////////////////////////////////////////////////////////////////////  COMPORTAMIENTO CONTROLES  ////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////get_productos_promo sucursal_filtro


  //// definir fechas

  public diaSemana(mes: string, dia: string, anio: string, hora: string): boolean {

    var valida: boolean = false;
    var hoy = new Date();
    var fecha = new Date(mes + ' ' + dia + ', ' + anio + ' ' + hora);
    if (fecha.getTime() >= hoy.getTime())
      valida = true
    //  return valida;
    //var oneDay = 24 * 60 * 60 * 1000; // Calculates milliseconds in a day
    //var diffDays = Math.abs((fecha.getTime() - hoy.getTime()) / (oneDay));
    //if (diffDays > 4)
    //  valida = true
    //var dia_sem = dt.getUTCDay();
    return valida;
  };

  public asignarFecha_inicio() {
    this.promocion.fecha_hora_inicio = (this.date_ini.value.getMonth() + 1) + '/' + this.date_ini.value.getDate() + '/' + this.date_ini.value.getFullYear();
    this.f_inicio_valida = this.diaSemana(this.date_ini.value.getMonth() + 1, this.date_ini.value.getDate(), this.date_ini.value.getFullYear(), this.hora);
  }

  public asignarFecha_fin() {
    this.promocion.fecha_hora_fin = (this.date_fin.value.getMonth() + 1) + '/' + this.date_fin.value.getDate() + '/' + this.date_fin.value.getFullYear();
    this.f_fin_valida = this.diaSemana(this.date_fin.value.getMonth() + 1, this.date_fin.value.getDate(), this.date_fin.value.getFullYear(), this.horafin);
  }

  public change_check_indefinido() {
    this.date_fin = new FormControl(new Date(this.fecha_hoy));
    this.horafin = moment().format("HH:mm");
    this.asignarFecha_fin();
  }

  /// multi selección canales participantes 

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
  }

  remove(ent_part: any): void {
    //debugger;
    const index = this.entidades_chips.indexOf(ent_part);
    if (index >= 0) {
      this.entidades_chips.splice(index, 1);
      this.entidades_chips_o.splice(index, 1);
    }

    for (var forma of this.catalogos_promo[5]) {
      if (ent_part == forma.descripcion) {
        var indice: number = this.promocion.entidades_participantes.indexOf(this.promocion.entidades_participantes.find(x => x.id_entidad == forma.id && x.id_tipo_entidad == forma.id_tipo));
        if (indice >= 0) {
          this.promocion.entidades_participantes.splice(indice, 1);
          this.promocion.entidades_obligatorias.splice(indice, 1);
        }
        this.editar_cc = false; this.cc_validadas = false;
      }
    }
  }

  private _filter(value: any): string[] {
    if (value.id == undefined) {
      const filterValue = value.toLowerCase();
      return this.catalogos_promo[5].filter(ent_part => ent_part.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
    else {
      const filterValue = value.descripcion.toLowerCase();
      return this.catalogos_promo[5].filter(ent_part => ent_part.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.push_id_search_entidades(event.option.value);
    this.push_id_search_entidades_o(event.option.value); //agrega los mismos al obligatorios

    //
    this.entidades_chips.push(event.option.viewValue);
    this.entidades_chips_o.push(event.option.viewValue); //agrega los mismos al obligatorios 
    this.ent_partInput.nativeElement.value = '';
    this.EntidadesPartCtrl.setValue(null);
    this.editar_cc = false; this.cc_validadas = false;
  }

  push_id_search_entidades(cadena: string) {
    var id_: number = 0;
    var tipo_: number = 0;
    for (var forma of this.catalogos_promo[5]) {
      if (cadena == forma.descripcion) {
        this.promocion.entidades_participantes.push({
          "id": 0, "id_promocion": this.promocion.id, "id_entidad": forma.id, "id_tipo_entidad": forma.id_tipo //cat_tipo_entidades
        });
        break;
      }
    }
  }


  /// multi selección canales excluidas 

  add_e(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
  }

  remove_e(ent_part: any): void {
    const index = this.entidades_chips_e.indexOf(ent_part);
    if (index >= 0) {
      this.entidades_chips_e.splice(index, 1);
    }

    for (var forma of this.catalogos_promo[6]) {
      if (ent_part == forma.descripcion) {
        //
        var indice: number = this.promocion.entidades_excluidas.indexOf(this.promocion.entidades_excluidas.find(x => x.id_entidad == forma.id && x.id_tipo_entidad == forma.id_tipo));
        if (indice >= 0) this.promocion.entidades_excluidas.splice(indice, 1);
        this.editar_cc = false; this.cc_validadas = false;
      }
    }
  }

  private _filter_e(value: any): string[] {
    if (value.id == undefined) {
      const filterValue = value.toLowerCase();
      return this.catalogos_promo[6].filter(ent_part => ent_part.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
    else {
      const filterValue = value.descripcion.toLowerCase();
      return this.catalogos_promo[6].filter(ent_part => ent_part.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
  }


  selected_e(event: MatAutocompleteSelectedEvent): void {
    this.push_id_search_entidades_e(event.option.value);
    this.entidades_chips_e.push(event.option.viewValue);
    this.ent_partInput_e.nativeElement.value = '';
    this.EntidadesPartCtrl_e.setValue(null);
    this.editar_cc = false; this.cc_validadas = false;
  }

  push_id_search_entidades_e(cadena: string) {
    var id_: number = 0;
    var tipo_: number = 0;
    for (var forma of this.catalogos_promo[6]) {
      if (cadena == forma.descripcion) {
        this.promocion.entidades_excluidas.push({
          "id": 0, "id_promocion": this.promocion.id, "id_entidad": forma.id, "id_tipo_entidad": forma.id_tipo //cat_tipo_entidades
        });
        break;
      }
    }
  }

  /// multi selección productos excluidos  

  add_p(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
  }

  remove_p(ent_part: any): void {
    const index = this.entidades_chips_p.indexOf(ent_part);
    if (index >= 0) {
      this.entidades_chips_p.splice(index, 1);
    }

    for (var forma of this.catalogos_promo[3]) {
      if (ent_part == forma.descripcion) {
        var indice: number = this.promocion.productos_excluidos.indexOf(this.promocion.productos_excluidos.find(x => x.id_producto == forma.id && x.id_tipo_categoria == forma.id_tipo));
        if (indice >= 0) this.promocion.productos_excluidos.splice(indice, 1);
        this.editar_cc = false; this.cc_validadas = false;
      }
    }
  }

  private _filter_p(value: any): string[] {
    debugger;
    if (value.id == undefined) {
      const filterValue = value.toLowerCase();
      return this.catalogos_promo[3].filter(ent_part => ent_part.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
    else {
      const filterValue = value.descripcion.toLowerCase();
      return this.catalogos_promo[3].filter(ent_part => ent_part.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  selected_p(event: MatAutocompleteSelectedEvent): void {
    this.push_id_search_pntidades_p(event.option.value);
    this.entidades_chips_p.push(event.option.viewValue);
    this.ent_partInput_p.nativeElement.value = '';
    this.EntidadesPartCtrl_p.setValue(null);
    this.editar_cc = false; this.cc_validadas = false;
  }

  push_id_search_pntidades_p(cadena: string) {
    var id_: number = 0;
    var tipo_: number = 0;
    for (var forma of this.catalogos_promo[3]) {
      if (cadena == forma.descripcion) {
        this.promocion.productos_excluidos.push({
          "id": 0, "id_promocion": this.promocion.id, "id_producto": forma.id, "id_tipo_categoria": forma.id_tipo//cat_tipo_entidades
        });
        break;
      }
    }
  }

  ////////// sleccion condicion

  herencia_change() {
    this.editar_cc = false; this.cc_validadas = false;
  }



  selected_promomo_com(id_promo: any): void {
    var id_: number = 0;
    var tipo_: number = 0;
    var indice_: number = this.promocion.promociones_compatibles.indexOf(this.promocion.promociones_compatibles.find(x => x.id_promocion == id_promo || x.id_promocion_2 == id_promo));
    if (indice_ >= 0)
      this.promocion.promociones_compatibles.splice(indice_, 1);
    else {
      this.promocion.promociones_compatibles.push({ id: 0, id_promocion: this.promocion.id, id_promocion_2: id_promo });
    }
  }

  ////////// sleccion condicion

  condicion_change() {
    this.editar_cc = false; this.cc_validadas = false;
  }


  ///////// filtro productos part


  filter(val: string) {
    debugger;
    return this.catalogos_promo[3].filter(option => option.descripcion.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  selected_prod_part(event: MatAutocompleteSelectedEvent): void {
    var id_: number = 0;
    var tipo_: number = 0;
    for (var prod of this.catalogos_promo[3]) {
      if (event.option.value == prod.descripcion) {
        ELEMENT_DATA_PROD_PART.push({
          tipo: prod.tipo, descripcion: event.option.value, cantidad: 1, acciones: "Eliminar", id_producto: prod.id
        });
        this.promocion.productos_condicion.push({
          "id": 0, "id_promocion": this.promocion.id, "id_producto": prod.id, "cantidad": 1, "id_tipo_categoria": prod.id_tipo // 1 Línea , 2 Sublínea , 3 producto 
        });
        this.dataSource_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_PART);
        this.dataSource_part.paginator = this.paginator;
        this.editar_cc = false; this.cc_validadas = false;
        break;
      }
    }
    $("#_TextoLibre").val('');
    console.log(this.promocion);
  }

  remove_prod_part(event: MatAutocompleteSelectedEvent, element: any, indice: any): void {
    //
    var id_: number = 0;
    var tipo_: number = 0;
    for (var prod of this.catalogos_promo[3]) {
      if (element.descripcion == prod.descripcion) {
        var indice_: number = this.promocion.productos_condicion.indexOf(this.promocion.productos_condicion.find(x => x.id_producto == prod.id && x.id_tipo_categoria == prod.id_tipo));
        if (indice_ >= 0) this.promocion.productos_condicion.splice(indice_, 1);
        ELEMENT_DATA_PROD_PART.splice(indice, 1)
        this.dataSource_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_PART);
        this.dataSource_part.paginator = this.paginator;
        this.editar_cc = false; this.cc_validadas = false;
        break;

      }
    }
  }

  cantidad_prod_part(element: any, indice: any): void {
    var val_input = $("#cant_" + element.id_producto + "_" + element.tipo).val();
    var id_: number = 0;
    var tipo_: number = 0;
    for (var prod of this.catalogos_promo[3]) {
      if (element.descripcion == prod.descripcion) {
        var indice_: number = this.promocion.productos_condicion.indexOf(this.promocion.productos_condicion.find(x => x.id_producto == prod.id && x.id_tipo_categoria == prod.id_tipo));
        if (indice_ >= 0) this.promocion.productos_condicion[indice_].cantidad = Number(val_input);
        ELEMENT_DATA_PROD_PART[indice_].cantidad = Number(val_input);
        this.dataSource_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_PART);
        this.dataSource_part.paginator = this.paginator;
        break;
      }
    }
  }

  /// checks beneficios

  click_beneficio_desc() {
    if (this.chk_desc) {
      var indice_: number = this.promocion.beneficios_promocion.indexOf(this.promocion.beneficios_promocion.find(x => x.id_cat_beneficios == 1));
      if (indice_ < 0) this.promocion.beneficios_promocion.push({ id: 0, id_promocion: this.promocion.id, id_cat_beneficios: 1 });
      if (this.promocion.beneficio_desc.length == 0)
        this.promocion.beneficio_desc.push({ id: 0, id_promocion: this.promocion.id, cantidad: 0, es_porcentaje: false });
    }
    else {
      var indice_: number = this.promocion.beneficios_promocion.indexOf(this.promocion.beneficios_promocion.find(x => x.id_cat_beneficios == 1));
      if (indice_ >= 0) this.promocion.beneficios_promocion.splice(indice_, 1);
      this.monto_descuento = 0;
      this.tipo_descuento = 0;
      this.promocion.beneficio_desc.splice(0, 1);
    }

  }
  click_beneficio_reg() {
    if (this.chk_reg) {
      var indice_: number = this.promocion.beneficios_promocion.indexOf(this.promocion.beneficios_promocion.find(x => x.id_cat_beneficios == 2));
      if (indice_ < 0) this.promocion.beneficios_promocion.push({ id: 0, id_promocion: this.promocion.id, id_cat_beneficios: 2 });
    }
    else {
      var indice_: number = this.promocion.beneficios_promocion.indexOf(this.promocion.beneficios_promocion.find(x => x.id_cat_beneficios == 2));
      if (indice_ >= 0) this.promocion.beneficios_promocion.splice(indice_, 1);
      this.promocion.beneficio_productos.splice(0, 1000);
      ELEMENT_DATA_PROD_REGALO.splice(0, 1000);
      this.dataSource_reg = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
      this.dataSource_reg.paginator = this.paginator_reg;
    }
  }

  set_sipo_beneficio() {
    //debugger;
    if (this.promocion.beneficios_promocion.length > 1)
      this.promocion.id_tipo_beneficio = 4;
    else
      this.promocion.id_tipo_beneficio = this.promocion.beneficios_promocion[0].id_cat_beneficios;
  }

  click_beneficio_msi() {
    //
    if (this.chk_msi) {
      var indice_: number = this.promocion.beneficios_promocion.indexOf(this.promocion.beneficios_promocion.find(x => x.id_cat_beneficios == 3));
      if (indice_ < 0) this.promocion.beneficios_promocion.push({ id: 0, id_promocion: this.promocion.id, id_cat_beneficios: 3 });
      if (this.promocion.beneficio_msi.length == 0)
        this.promocion.beneficio_msi.push({ id: 0, id_promocion: this.promocion.id, id_cat_msi: 0 });
    }
    else {
      var indice_: number = this.promocion.beneficios_promocion.indexOf(this.promocion.beneficios_promocion.find(x => x.id_cat_beneficios == 3));
      if (indice_ >= 0) this.promocion.beneficios_promocion.splice(indice_, 1);
      this.tipo_msi = 0;
      this.promocion.beneficio_msi.splice(0, 1000);
    }

  }

  /////// promociones compatibles


  /////// filtros prod part

  @ViewChild('paginator') paginator: MatPaginator
  @ViewChild('paginator_reg') paginator_reg: MatPaginator;
  @ViewChild('paginator_pc') paginator_pc: MatPaginator;

  ngAfterViewInit() {
    this.dataSource_part.paginator = this.paginator;
    this.dataSource_reg.paginator = this.paginator_reg;
    this.datasource_pc.paginator = this.paginator_pc;
  }


  ///////////// filtro porductos regalo 

  filter_reg(val: string) {
    return this.catalogos_promo[4].filter(option =>
      option.descripcion.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  ///////////// beneficio montos  descuento

  asignar_montos_desc() {
    this.promocion.beneficio_desc[0].cantidad = this.monto_descuento;
  }

  asignar_tipo_desc() {
    this.promocion.beneficio_desc[0].es_porcentaje = this.tipo_descuento == 2 ? true : false;
  }

  //////////// beneficio msi opcion

  asignar_tipo_msi() {
    //
    this.promocion.beneficio_msi[0].id_cat_msi = this.tipo_msi;
  }


  /////////// beneficio tabla regalos

  selected_prod_reg(event: MatAutocompleteSelectedEvent): void {
    //
    var id_: number = 0;
    var tipo_: number = 0;
    for (var prod of this.catalogos_promo[4]) {
      if (event.option.value == prod.descripcion) {

        ELEMENT_DATA_PROD_REGALO.push({
          tipo: prod.tipo, descripcion: event.option.value, cantidad: 1, acciones: "Eliminar", id_producto: prod.id
        });
        this.promocion.beneficio_productos.push({
          "id": 0, "id_promocion": this.promocion.id, "id_producto": prod.id, "cantidad": 1 // 1 Línea , 2 Sublínea , 3 producto 
        });
        this.dataSource_reg = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
        this.dataSource_reg.paginator = this.paginator_reg;
        break;
      }
    }
    $("#_TextoLibre_reg").val('');
    console.log(this.promocion);
  }

  remove_prod_reg(event: MatAutocompleteSelectedEvent, element: any, indice: any): void {
    //
    var id_: number = 0;
    var tipo_: number = 0;
    for (var prod of this.catalogos_promo[4]) {
      if (element.descripcion == prod.descripcion) {
        var indice_: number = this.promocion.beneficio_productos.indexOf(this.promocion.beneficio_productos.find(x => x.id_producto == prod.id));
        if (indice_ >= 0) this.promocion.beneficio_productos.splice(indice_, 1);
        ELEMENT_DATA_PROD_REGALO.splice(indice, 1)
        this.dataSource_reg = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
        this.dataSource_reg.paginator = this.paginator_reg;
        break;
      }
    }
  }

  /// multi selección canales excluidas 

  add_o(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
  }

  remove_o(ent_part: any): void {
    const index = this.entidades_chips_o.indexOf(ent_part);
    if (index >= 0) {
      this.entidades_chips_o.splice(index, 1);
    }

    for (var forma of this.catalogos_promo[6]) {
      if (ent_part == forma.descripcion) {
        //
        var indice: number = this.promocion.entidades_obligatorias.indexOf(this.promocion.entidades_obligatorias.find(x => x.id_entidad == forma.id && x.id_tipo_entidad == forma.id_tipo));
        if (indice >= 0) this.promocion.entidades_obligatorias.splice(indice, 1);
      }
    }
  }

  private _filter_o(value: any): string[] {
    if (value.id == undefined) {
      const filterValue = value.toLowerCase();
      return this.catalogos_promo[6].filter(ent_part => ent_part.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
    else {
      const filterValue = value.descripcion.toLowerCase();
      return this.catalogos_promo[6].filter(ent_part => ent_part.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
  }


  selected_o(event: MatAutocompleteSelectedEvent): void {
    this.push_id_search_entidades_o(event.option.value);
    this.entidades_chips_o.push(event.option.viewValue);
    this.ent_obligaInput.nativeElement.value = '';
    this.EntidadesPartCtrl_o.setValue(null);
  }

  push_id_search_entidades_o(cadena: string) {
    var id_: number = 0;
    var tipo_: number = 0;
    for (var forma of this.catalogos_promo[6]) {
      if (cadena == forma.descripcion) {
        this.promocion.entidades_obligatorias.push({
          "id": 0, "id_promocion": this.promocion.id, "id_entidad": forma.id, "id_tipo_entidad": forma.id_tipo //cat_tipo_entidades
        });
        break;
      }
    }
  }

  //// tabs modificar condiciones comerciales

  addTab(selectAfterAdding: boolean) {
    this.tabs.push('New');

    if (selectAfterAdding) {
      this.selected_tab.setValue(this.tabs.length - 1);
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }

  mostrar_ocultar_afecaciones_cc(mostrar: boolean) {
    //this.editar_cc = mostrar;
    if (mostrar) {

    }
    else {

    }
  }

  regresar() {
    this.router.navigate(['/promociones']);
  }

}



export interface PeriodicElement {
  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
}

var ELEMENT_DATA_PROD_PART: PeriodicElement[] = [];

var ELEMENT_DATA_PROD_REGALO: PeriodicElement[] = [];

var ELEMENT_DATA_SUCURSALES_CC: any[] = [];
var ELEMENT_DATA_CONF_COM: any[] = [];

var ELEMENT_DATA__PROMO_COM: any[] = [
];


