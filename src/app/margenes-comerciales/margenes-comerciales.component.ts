import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DatosService } from '../datos.service';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import * as jquery from 'jquery';

@Component({
  selector: 'app-margenes-comerciales',
  templateUrl: './margenes-comerciales.component.html',
  styleUrls: ['./margenes-comerciales.component.css']
})

export class MargenesComercialesComponent implements OnInit {

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
  Sucursal: string = "";
  Sucursales: any[] = [];
  nivel: string = "";
  cuentafiltro: any = 0;
  sucursalfiltro: any = 0;

  rangofechas: string = "";
  Fechainirango: string = "";
  public daterange: any = {};
  Fechafinrango
  public filters: any = {};

  // tabla entidades
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  displayedColumns = ['sucursal', 'cuenta', 'canal', 'ventas_totales', 'comisiones_totales', 'comisiones_pendientes'];
  @ViewChild('paginator') paginator: MatPaginator

  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };


  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  constructor(private route: ActivatedRoute, private heroService: DatosService, private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public matDatepicker: MatDatepickerModule) { }

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
      this.aplicar_estilos();
      this.get_entidades_busqueda();
      this.getCat_canales();
      //this.getCat_Cuentas();
    }
  }

  public selectedDate(value: any, datepicker?: any) {
    this.Fechainirango = value.start._d.getDate() + '/' + (value.start._d.getMonth() + 1) + '/' + value.start._d.getFullYear()
    this.Fechafinrango = value.end._d.getDate() + '/' + (value.end._d.getMonth() + 1) + '/' + value.end._d.getFullYear()
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  selectCanal(event) {
    console.log(event.source);
    console.log(event.value);
    console.log((ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == event.value)));
    this.dataSource = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.Canal == '' ? cc.id_canal : this.Canal)));
    this.dataSource.paginator = this.paginator;
  }

  selectCuenta(event) {
    console.log(event);
    this.dataSource = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.Canal == '' ? cc.id_canal : this.Canal)
&& cc.id_cuenta == (this.cuentafiltro == 0 ? cc.id_cuenta : this.cuentafiltro)));
    this.dataSource.paginator = this.paginator;
  }

  selectSucursal(event) {
    console.log(event);
    this.dataSource.filter = (event.value);
    this.dataSource = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.Canal == '' ? cc.id_canal : this.Canal)
        && cc.id_cuenta == (this.cuentafiltro == 0 ? cc.id_cuenta : this.cuentafiltro)
        && cc.id == (this.sucursalfiltro == 0 ? cc.id : this.sucursalfiltro)));
    //this.sublineas_aplicables = this.sublineas_filtro.filter(sl => sl.id_linea_producto == this._linea_filtro || sl.id == 0);
    this.dataSource.paginator = this.paginator;
  }

  limpiafecha() {
    this.Fechainirango = null;
    this.Fechafinrango = null;
  }

  clearFilters() {
    this.filters = {};
  }

  get_entidades_busqueda() {
    // debugger;
    var creadoobj = {
      TextoLibre: this.TextoLibre, tipo_entidad: this.tipos, Canal: this.Canal, Cuenta: this.Cuenta, IDUSR: this.IDUSR, Sucursales: this.Sucursal, FecIni: this.Fechainirango,
      FecFin: this.Fechafinrango
    };
    debugger;
    //this.preventAbuse = true;
    this.heroService.ServicioPostGeneral("get_margenes_comerciales", creadoobj).subscribe((value) => {
      //setTimeout(() => {
      //this.preventAbuse = false;
      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
          break;
        default:
          if (value.result == "Success") {
            debugger;
            
            
               
                  ELEMENT_DATA_PROD_REGALO= value.item; 

            debugger;
          //  ELEMENT_DATA_PROD_REGALO = value.item;
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
            this.displayedColumns = ['sucursal', 'cuenta', 'canal', 'ventas_totales', 'comisiones_totales', 'comisiones_pendientes'];


            //  this.dataSource.filteredData.toLocaleString("Sucursal");
            this.dataSource.paginator = this.paginator;
          }
      }
      //}, 400);
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
      });
  }

  getCat_Sucursales(): void {
    var creadoobj = { Id1: this.Canal == "" ? "0" : this.Canal, Id2: this.Cuenta == "" ? "0" : this.Cuenta, Id3: this.IDUSR };
    this.heroService.ServicioPostGeneral("SucursalesPorCanalCuentaUsuario", creadoobj)
      .subscribe((value) => {
        this.Sucursales = value.item;
      });
  }

}

export interface PeriodicElement {
  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
}

var ELEMENT_DATA_PROD_REGALO: any[] = [
];
