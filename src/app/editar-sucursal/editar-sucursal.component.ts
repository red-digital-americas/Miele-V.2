import { Component, OnInit, OnDestroy, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Cat_Sucursales, datosFiscales_Sucursales, direccion_Sucursal, condiones_comerciales_sucursal } from '../models/Cat_Sucursales';
import { ImageDetailComponents } from './image-detail/image-detail.components';
import { MatNativeDateModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { Overlay } from '@angular/cdk/overlay';

import * as jquery from 'jquery';
import { Utils } from '../utils/utils';
import { ProductsService } from '../services/products.service';
import { linea } from '../models/producto';


@Component({
  selector: 'app-editar-sucursal',
  templateUrl: './editar-sucursal.component.html',
  styleUrls: ['./editar-sucursal.component.css']
})
export class EditarSucursalComponent implements OnInit {
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  tipos: number = 0;
  public mask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskcp = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  public cc_validadas: boolean = false;
  tipos_entidades: any[] = [{ "id": 0, "tipo": "Todas" }, { "id": 1, "tipo": "Canales" }, { "id": 2, "tipo": "Cuentas" }, { "id": 3, "tipo": "Sucursales" }];
  prefijos_calle: any[] = [{ "id": 1, "prefijo": "Calzada" }, { "id": 2, "prefijo": "Avenida" }, { "id": 3, "prefijo": "Boulevard" }, { "id": 4, "prefijo": "Cerrada" }, { "id": 5, "prefijo": "Calle" }];
  TextoLibre: string = "";
  public id_entidad: number = 0;
  comision: number = 0;
  valorgral_cc: number = 0;
  sub: any;
  estados_ins: any[] = [];
  Municipios_Ins: any[] = [];
  Localidades_Ins: any[] = [];
  prefijos_dir = ['Avenida', 'Av.', 'boulevard', 'Boulevard', 'Blvr', 'Blvr', 'Calzada', 'Calz.', 'avenida', 'av.', 'Calle', 'calle'];
  Calle_ins_valido: boolean = true;
  

  /// tabla afectaciones condiciones comerciales
  public lines: linea[] = [];
  sublineas_aplicables: any[] = [];
  sublineas_filtro: any[] = [];
  sucursales_aplicables: any[] = [];
  dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);
  displayedColumns_suc_part = ['linea', 'sublinea', 'margen_original'];
  _sublinea_filtro: any = 0;
  _linea_filtro: any = 0;
  sucursal_filtro: any = 0;
  margen_adic_gral: number = 0;


  public Cat_Suc = new Cat_Sucursales();

  //Duda si inicializar este obj o con el obj padre es suficiente 
  public DatoFis_Suc = new datosFiscales_Sucursales();
  public dir_suc = new direccion_Sucursal();
  //Variables que se ocupaban en los metodos de donde saque los elementos html 
  Canal: string = "";
  IDUSR: number = 0;
  Cuentas: any[] = [];
  lista_tipos: any[] = [
    { tipo: 'A'},
    { tipo: 'B'},
    { tipo: 'C' },
    { tipo: 'D' },
  ];

  public newImages: any[] = [];

  public newFiles: any[] = [];
  canalesCo: any[] = [];

  estados: any[] = [];
  Municipios_fac: any[] = [];
  // tabla entidades
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  displayedColumns = ['id', 'tipo', 'canal', 'cuenta', 'entidad'];
  @ViewChild('paginator') paginator: MatPaginator

  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  constructor(private route: ActivatedRoute,
    private heroService: DatosService,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public matDatepicker:
      MatDatepickerModule, private productsService: ProductsService,
    public overlay: Overlay
  ) { }

  preventAbuse: boolean = false;
  Rol: string = "";
  user_session: any;
  permisos_edicion: boolean = false;

  validar_permisos() {
    if (this.user_session.rol == 8)
      this.permisos_edicion = true;
  }

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.user_session = JSON.parse(localStorage.getItem("user"));
      this.sub = this.route.params.subscribe(params => { this.id_entidad = +params['id']; });
      this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
      this.aplicar_estilos();
      this.getCat_Cuentas();
      
      this.getCat_canales();
      this.getCat_estados();
      this.getCat_municipios_fac();
      this.validar_permisos();
      this.getLines();
    }
  }

  
  ////  filtrar cc

  filtrar_cc(filtro_linea: boolean) {
    //debugger;
    if (filtro_linea) {
      if (this._linea_filtro > 0) {
        this.sublineas_aplicables = this.sublineas_filtro.filter(sl => sl.id_linea_producto == this._linea_filtro || sl.id == 0);
        this._sublinea_filtro = 0;
      }
      else
        this.sublineas_aplicables = this.sublineas_filtro;
    }

    this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_SUCURSALES_CC.filter(cc => cc.id_Cat_SubLinea_Producto == (this._sublinea_filtro == 0 ? cc.id_Cat_SubLinea_Producto : this._sublinea_filtro)
        && cc.id_linea == (this._linea_filtro == 0 ? cc.id_linea : this._linea_filtro)
        && cc.id_sucursal == (this.sucursal_filtro == 0 ? cc.id_sucursal : this.sucursal_filtro)));
    debugger; 
  }

  //// aplicacion genreal de margen afectaciones CC

  aplicar_margen_gral() {
    for (var cc of ELEMENT_DATA_SUCURSALES_CC) {
      //debugger;
      if (cc.id_Cat_SubLinea_Producto == (this._sublinea_filtro == 0 ? cc.id_Cat_SubLinea_Producto : this._sublinea_filtro)
        && cc.id_linea == (this._linea_filtro == 0 ? cc.id_linea : this._linea_filtro)
          && cc.id_sucursal == (this.sucursal_filtro == 0 ? cc.id_sucursal : this.sucursal_filtro)) {
        cc.margen = this.margen_adic_gral;
      }
    }
    //debugger;
    this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_SUCURSALES_CC.filter(cc => cc.id_Cat_SubLinea_Producto == (this._sublinea_filtro == 0 ? cc.id_Cat_SubLinea_Producto : this._sublinea_filtro)
        && cc.id_linea == (this._linea_filtro == 0 ? cc.id_linea : this._linea_filtro)
        && cc.id_sucursal == (this.sucursal_filtro == 0 ? cc.id_sucursal : this.sucursal_filtro)));


  }

  set_nuevo_margen(event, row, index) {
    //debugger;
    var Id_Ctrl = event.srcElement.getAttribute("id")
    Id_Ctrl = Id_Ctrl.replace("ccs_", "");
    var Val_Ctrl = event.srcElement.value;
    Val_Ctrl = Val_Ctrl == "" ? 0 : Val_Ctrl;

    

    //  var indice_: number = this.dataSource_suc_part.data.indexOf(this.dataSource_suc_part.data.find(x => x.id_condiones_comerciales_sucursal == Id_Ctrl));
    //if (indice_ >= 0) {
    //  this.promocion.afectacion_cc[indice_].margen = Val_Ctrl;
    //  ELEMENT_DATA_SUCURSALES_CC[indice_].margen_adicional = Val_Ctrl;
    //}
  };

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

  getLines() {

    this.productsService.getLines().subscribe((l) => {
      if (!Utils.isEmpty(l)) {
        this.lines = l;
        this.lines.push({ "id": 0, "descripcion": "Todas las Líneas", "estatus": true });
      } else {
        console.error('Error getting product lines')
      }
    })

  }

  getDireccionPorCP(id_localidad_: any) {
    if (this.dir_suc.cp) {
      if (this.dir_suc.cp.length == 5) {
        this.heroService.GetDireccionPorCP(this.dir_suc.cp)
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
                    this.dir_suc.id_estado = value._item[0].id_estado;
                    this.Municipios_Ins = value._item[0].municipios;
                    if (this.Municipios_Ins.length == 1)
                      this.dir_suc.id_municipio = this.Municipios_Ins[0].id_municipio
                    this.Localidades_Ins = value._item[0].localidades;
                    if (this.Localidades_Ins.length == 1)
                      this.dir_suc.id_localidad = this.Localidades_Ins[0].id_localidad;
                    else {
                      if (id_localidad_ != 0)
                        this.dir_suc.id_localidad = id_localidad_;
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
        // this.openSnackBar('No hay concidencias para el código postal capturado.');
        this.limpiarInstalacion();
      }
    }
  }

  limpiarInstalacion() {
    this.dir_suc.id_municipio = 0;
    this.dir_suc.id_estado = 0;
    //this.dir_suc.id_localidad = 0;
    this.Municipios_Ins = null;
    this.estados_ins = null;
    this.Localidades_Ins = null;
  }


  public GuardarEditarSucursal(isValid: boolean) {
    if (isValid == true && this.cc_validadas) {
      //this.Cat_Suc.cat_direccion_sucursales[0] = this.dir_suc;
      //console.log(this.dataSource_suc_part.data);
      //debugger
      this.CallCrearEditarSucursal(this.Cat_Suc, this.DatoFis_Suc, this.dir_suc, this.dataSource_suc_part.data, ELEMENT_DATA_SUCURSALES_CC);
      
    }

  }

  public gotosuc(tipo: number) {

    if (tipo == 1)
      this.router.navigate(['/sucursales']);
  }


  public CallCrearEditarSucursal(cat_suc: Cat_Sucursales, datosFis_Suc: datosFiscales_Sucursales, dir_suc: direccion_Sucursal, cc_suc: any, cc_suc2: any) {
    //debugger;
    this.Cat_Suc.datosFiscales_Sucursales[0] = this.DatoFis_Suc;
    
    this.Cat_Suc.cat_direccion_sucursales[0] = this.dir_suc;
    if (this.route.snapshot.params["id"] < 1) {
      this.Cat_Suc.condiones_comerciales_sucursal = cc_suc;
    }
    //ELEMENT_DATA_SUCURSALES_CC.forEach(item => {
    //   cc: condiones_comerciales_sucursal;
      
    //  this.Cat_Suc.condiones_comerciales_sucursal.push()
    //});
    

    this.heroService.CrearEdicarSucursal(this.Cat_Suc, cc_suc)
      .subscribe((value) => {
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al guardar la dirección: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              //console.log(value.detalle);
              this.gotosuc(1);
            }
        }
      });
  }

  getCat_canales(): void {
    var creadoobj = { Id: this.IDUSR };
    this.heroService.ServicioPostGeneral("Canales_por_usuario", creadoobj)
      .subscribe((value) => {
        this.canalesCo = value.item;
      });

  }

  getCat_Cuentas(): void {
    var creadoobj = { Id1: this.Canal == "" ? "0" : this.Canal, Id2: this.IDUSR };
    this.heroService.ServicioPostGeneral("Cuentas_por_Canal_usr", creadoobj)
      .subscribe((value) => {
        this.Cuentas = value.item;
        if (this.IDUSR > 0)
          this.cargar_datos_Suc();
      });

  }
  cargar_datos_Suc() {
    this.sub = this.route.params.subscribe(params => { this.Cat_Suc.id = + params['id']; });
    if (this.Cat_Suc.id > 0) {
      this.preventAbuse = true;
      var busqueda = { id: this.Cat_Suc.id }
      this.heroService.ServicioPostGeneral("cargar_cat_sucur_id", busqueda).subscribe((value) => {
        //console.log(value)
        setTimeout(() => {
          switch (value.result) {
            case "Error":
              console.log("Cliente - Ocurrio un error al cargar promocion: " + value.detalle);
              break;
            default:
              if (value.result == "Success") {
                debugger;
                this.Cat_Suc = value.item[0];
                if (this.Cat_Suc.cat_direccion_sucursales[0] != undefined) {
                  this.dir_suc = this.Cat_Suc.cat_direccion_sucursales[0];
                }
                this.DatoFis_Suc = this.Cat_Suc.datosFiscales_Sucursales[0];
                this.Cat_Suc.id_Canal;
                this.getDireccionPorCP(this.dir_suc.id_localidad);
                this.getCat_municipios_fac();
                //debugger;
                //this.consultar_condiconesc_comerciales();
                if (value.item[0].condiones_comerciales_sucursal != null) {
                  ELEMENT_DATA_SUCURSALES_CC = value.item[0].condiones_comerciales_sucursal;
                  this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);
                  this.consultar_condiconesc_comerciales(true);
                }
              }
          }
        }, 400);
      });
    }
    else {
      //debugger;
      this.consultar_condiconesc_comerciales(false);
    }

  }


  consultar_condiconesc_comerciales(ban: boolean) {
    
    //debugger;
    this.id_entidad = this.route.snapshot.params["id"];
    var creadoobj = { Id: this.id_entidad };
    this.heroService.ServicioPostGeneral("consultar_cc_sucursal", creadoobj).subscribe((value) => {
      debugger;
      //alert(creadoobj);
      //setTimeout(() => {
      switch (value.result) {
        case "Error":
          console.log("Cliente - Ocurrio un error al cargar las condiciones comerciales: " + value.detalle);
          break;
        case "Success":
          this.sublineas_aplicables = value.subLineas_aplicables;
          this.sublineas_aplicables.push({ "id": 0, "id_linea_producto": 0, "descripcion": "Todas las Sublíneas", "estatus": true });
          this.sublineas_filtro = this.sublineas_aplicables;
          //// contenido condiciones comerciales
          if (ban) {
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
            if (value.item.length > 0) {
              ELEMENT_DATA_SUCURSALES_CC = value.item;
              this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);
            }
          }

          
          this.preventAbuse = false;
          break;
      }
      //}, 400);
    });
  }

  getCat_estados(): void {
    this.heroService.service_catalogos("Catalogos/Estados")
      .subscribe((value) => {
        this.estados = value;
      });

  }


  getCat_municipios_fac(): void {


    this.heroService.GetMunicipios(this.DatoFis_Suc.id_estado)
      .subscribe((value) => {
        this.Municipios_fac = value;
        this.DatoFis_Suc.id_municipio;
      });
  }





  openImage(src, id) {
    //debugger; 
    let imageDOM = <HTMLImageElement>document.getElementById(id);
    let width = 600;
    if (Utils.isDefined(imageDOM)) {
      width = imageDOM.naturalWidth;

      let dialogConfig = new MatDialogConfig();
      dialogConfig.width = width + 'px';
      dialogConfig.data = { src: src }
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();

      let dialogRef = this.dialog.open(ImageDetailComponents, dialogConfig);

      return false;
    }
  }

  prepareImages(e) {

    if (Utils.isDefined(e.srcElement.files)) {
      for (let f of e.srcElement.files) {

        this.newImages.push(f);
      }
    }
  }



  addImages() {
    let url: string = '';
    if (!Utils.isEmpty(this.newImages)) {
      for (let f of this.newImages) {
        this.heroService.UploadImgSuc(f).subscribe((r) => {
          if (Utils.isDefined(r)) {
            url = <string>r.response;

            url = url.replace('/Imagenes', this.heroService.getURL() + 'mieletickets');
            this.Cat_Suc.url_logo = url;
            this.newImages = [];
          }
        })
      }
    }
  }
  //imagenes //
  @ViewChild("fileInput") fileInput;
  @ViewChild("fileInput1") fileInput1;
  fileToUpload: any[] = [];
  response: any = { response: 0 };
  UploadID: string = "";
  tipoD: number = 1;


  addFile(): void {
    let fi = null;
    fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      this.heroService.upload(fi.files[0]).subscribe((value) => {
        //debugger; 
        this.response = value;
      });
    }
  }

  public CallNuevaImg(id): void {
    this.heroService.CallNuevaImg(id)
      .subscribe((value) => {
        switch (value.response) {
          case "Error":
            console.log("Ocurrio un error al guardar el documento de la cotizacion: " + id);
            break;
          default:
            if (value.response == "Success") {
              console.log('Documento de cotización:  ' + id + ' agregado correctamente')
              //this.();
            }
        }
      });
  }

}

export interface PeriodicElement {
  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
}

var ELEMENT_DATA_PROD_REGALO: any[] = [
];

var ELEMENT_DATA_SUCURSALES_CC: any[] = [];
