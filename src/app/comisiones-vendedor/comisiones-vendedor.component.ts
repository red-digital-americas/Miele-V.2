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
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { usuarios } from '../models/usuarios';
import { MatNativeDateModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import * as jquery from 'jquery';
import { parse } from 'url';

@Component({
  selector: 'app-comisiones-vendedor',
  templateUrl: './comisiones-vendedor.component.html',
  styleUrls: ['./comisiones-vendedor.component.css']
})
export class ComisionesVendedorComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  tipos: number = 0;
  tipos_entidades: any[] = [{ "id": 0, "tipo": "Todas" }, { "id": 1, "tipo": "Canales" }, { "id": 2, "tipo": "Cuentas" }, { "id": 3, "tipo": "Sucursales" }];
  TextoLibre: string = "";
  IDUSR: number = 0;
  id_rol: string = "0";
  canalesCo: any[] = [];
  Canal: string = "";
  Cuenta: string = "";
  Cuentas: any[] = [];
  Sucursal: string = "";
  Sucursales: any[] = [];
  nivel: string = "";
  cuentafiltro: any = 0; 
  sucursalfiltro: any =  0; 

  rangofechas: string = "";
  Fechainirango: string = "";

  public daterange: any = {};
  Fechafinrango

  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };

  // tabla entidades
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  displayedColumns = ['id', 'name', 'canal', 'cuenta', 'sucursal', 'email', 'nivel', 'ventas_totales', 'comisiones'];
  @ViewChild('paginator') paginator: MatPaginator

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
      debugger;
      this.id_rol = localStorage.getItem("rol_user");
      //columna ventas totales solo se muestra a finanzas
      if (this.id_rol == "8") {
        this.displayedColumns = ['id', 'name', 'canal', 'cuenta', 'sucursal', 'email', 'nivel', 'ventas_totales', 'comisiones'];
      }
      else {
        this.displayedColumns = ['id', 'name', 'canal', 'cuenta', 'sucursal', 'email', 'nivel', 'comisiones'];
      }
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
    debugger;
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
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.Canal == ''? cc.id_canal : this.Canal)
        && cc.id_cuenta == (this.cuentafiltro == 0 ? cc.id_cuenta : this.cuentafiltro)
      && cc.id_sucursal == (this.sucursalfiltro == 0 ? cc.id_sucursal : this.sucursalfiltro)));

    //this.sublineas_aplicables = this.sublineas_filtro.filter(sl => sl.id_linea_producto == this._linea_filtro || sl.id == 0);
    this.dataSource.paginator = this.paginator;
  }
  limpiafecha() {
    this.Fechainirango = null;  
    this.Fechafinrango = null;

  }
  get_entidades_busqueda() {
    // debugger;
    var creadoobj = {
      TextoLibre: this.TextoLibre, tipo_entidad: this.tipos, Canal: this.Canal, Cuenta: this.Cuenta, IDUSR: this.IDUSR, Sucursales: this.Sucursal, FecIni : this.Fechainirango,
     FecFin:  this.Fechafinrango};
     debugger;
    this.heroService.ServicioPostGeneral("get_entidades_busqueda_com", creadoobj).subscribe((value) => {
      //setTimeout(() => {
        debugger;
      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargas las comisiones : " + value.detalle);
          break;
        default:
          if (value.result == "Success") {
            debugger;
            ELEMENT_DATA_PROD_REGALO = value.item;
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
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



  gotoedit(tipo: number) {

    if (tipo == 1)
      this.router.navigate(['/editar-usuarios/0']);
    if (tipo == 2)
      this.router.navigate(['/editar-usuarios/0']);
  }

}




export interface PeriodicElement {
  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
}

var ELEMENT_DATA_PROD_REGALO: any[] = [
];

