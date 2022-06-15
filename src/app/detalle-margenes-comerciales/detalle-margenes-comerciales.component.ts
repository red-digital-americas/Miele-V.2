import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DatosService } from '../datos.service';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as jquery from 'jquery';
import { comisiones } from '../models/comisiones';

@Component({
  selector: 'app-detalle-margenes-comerciales',
  templateUrl: './detalle-margenes-comerciales.component.html',
  styleUrls: ['./detalle-margenes-comerciales.component.css']
})
export class DetalleMargenesComercialesComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  tipos: number = 0;
  tipos_entidades: any[] = [{ "id": 0, "tipo": "Todas" }, { "id": 1, "tipo": "Canales" }, { "id": 2, "tipo": "Cuentas" }, { "id": 3, "tipo": "Sucursales" }];
  TextoLibre: string = "";
  IDUSR: number = 0;
  canalesCo: any[] = [];
  Canal: string = "";
  Cuenta: string = "";
  Cuentas: any[] = [];
  sucur: string = "";
  Sucursales: any[] = [];
  Roles: any[] = [];
  Rol: string = "";
  user_session: any;
  permisos_edicion: boolean = false;
  id_sucursal: number = 39;
  nombre_sucursal: string = "Espere un momento...";
  vtotales: number = 0;
  ctotales: number = 0;
  cpendientes: number = 0;
  cpagadas: number = 0;
  comisionpagada: number = 0;
  rangofechas: string = "";
  Fechainirango: string = "";
  public daterange: any = {};
  Fechafinrango: string = ""; 
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM)
  displayedColumns = ['id', 'referido', 'ibs', 'f_generacion', 'venta_cotizacion', 'comision_cotizacion', 'pagado'];
  //resumenColumns = ["vtotales","ctotales","cpendientes"];
  @ViewChild('paginator') paginator: MatPaginator

  sub: any;
  public com = new comisiones();

  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };

  // tabla entidades

  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  validar_permisos() {
    if (this.user_session.rol == 8)
      this.permisos_edicion = true;
  }

  constructor(private route: ActivatedRoute, private heroService: DatosService, private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public matDatepicker: MatDatepickerModule) { }

  ngOnInit() {

    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
      this.user_session = JSON.parse(localStorage.getItem("user"));
      this.aplicar_estilos();
      this.get_entidades_busqueda();
      this.validar_permisos();
    } 
  }

  get_entidades_busqueda() {
    this.sub = this.route.params.subscribe(params => { this.com.id = + params['id']; });
    var creadoobj = {
      Id: this.com.id, FecIni: this.Fechainirango,
      FecFin: this.Fechafinrango };
    debugger;
    this.heroService.ServicioPostGeneral("get_detalle_marg_comerciales", creadoobj).subscribe((value) => {
      debugger;
      switch (value.result) {
         
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
          break;
        default:
          if (value.result == "Success") {
            debugger;
            this.vtotales = 0;
            this.ctotales = 0;
            this.cpendientes = 0;
            this.comisionpagada = 0;
            for (var i = 0; i < value.item.length; i++) {
              if (value.item[i].comision_cotizacion != 0) {
                ELEMENT_DATA_PROD_REGALO.push(value.item[i]);
              }
              if (value.item[i].pagado != "boton:Pagar")
                this.comisionpagada += (value.item[i].comision_cotizacion);
            }
            console.log(this.comisionpagada);

            this.nombre_sucursal = value.item3.sucursal;
            //ELEMENT_DATA_PROD_REGALO = value.item;
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
            this.vtotales = value.item2[0].vtotales;
            this.ctotales = value.item2[0].ctotales;
            this.cpendientes = this.ctotales - this.comisionpagada;
            this.dataSource.paginator = this.paginator;
          }
      }
      //}, 400);
    });
  }

  public selectedDate(value: any, datepicker?: any) {
    this.Fechainirango = value.start._d.getDate() + '/' + (value.start._d.getMonth() + 1) + '/' + value.start._d.getFullYear()
    this.Fechafinrango = value.end._d.getDate() + '/' + (value.end._d.getMonth() + 1) + '/' + value.end._d.getFullYear()
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
    debugger;
    ELEMENT_DATA_PROD_REGALO = []; 
    
    this.get_entidades_busqueda();

  }
  pagar_comision(id_comi: number, id_estatus: number) {
    this.sub = this.route.params.subscribe(params => {
      this.com.id = + params['id'];
      this.IDUSR;
    });
    debugger;
    var creadoobj = { id_cotizacion: id_comi, id_cat_tipo_comision: id_estatus, id_quienpago: this.IDUSR };
    this.heroService.ServicioPostGeneral("pagar_comision_suc", creadoobj).subscribe((value) => {
      console.log(value)
      setTimeout(() => {
        switch (value.result) {
          case "Error":
            console.log("Cliente - Ocurrio un error al cargar promocion: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              debugger;

              //this.com = value.item[0];
              this.get_entidades_busqueda();
            }
        }
      }, 400);
    });

  }

  pagadas() {
    this.dataSource.filter = "20";
  }

  porpagar() {
    debugger;
    this.dataSource.filter = "";
  }

  gotousu(tipo: number) {
    if (tipo == 1)
      this.router.navigate(['/margenes-comerciales']);
  }

}

export interface PeriodicElement {
  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
}

var ELEMENT_DATA__PROMO_COM: any[] = [
];

var ELEMENT_DATA_PROD_REGALO: any[] = [
];
