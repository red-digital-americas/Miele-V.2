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
import * as jquery from 'jquery';


@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {
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
  preventAbuse: boolean = false;
  cuentafiltro: any = 0; 
  // tabla entidades
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  displayedColumns = ['id', 'tipo', 'entidad', 'canal'];
  @ViewChild('paginator') paginator: MatPaginator

  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  Rol: string = "";
  user_session: any;
  permisos_edicion: boolean = false;
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
      this.getCat_canales();
    //  this.getCat_Cuentas();
      this.validar_permisos();
    }

  }

  /*
  selectCanal(event) {
   

  //  debugger;
    console.log(event.source);
    this.dataSource.filter = (event.source);
  }
  selectCuenta(event) {
    console.log(event);

  //  debugger;
    this.dataSource.filter= (event.value);
  }
  */

  get_entidades_busqueda() {
    // debugger;
    var creadoobj = { TextoLibre: this.TextoLibre, tipo_entidad: this.tipos, Canal: this.Canal, Cuenta: this.Cuenta, IDUSR: this.IDUSR };
    // debugger;
    this.preventAbuse = true;
    this.heroService.ServicioPostGeneral("get_entidades_busqueda_cuentas", creadoobj).subscribe((value) => {
      //setTimeout(() => {

      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
          break;
        default:
          if (value.result == "Success") {
            this.preventAbuse = false
              debugger;
            ELEMENT_DATA_PROD_REGALO = value.item;
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
            this.dataSource.paginator = this.paginator;
          }
      }
      //}, 400);
    });
  }


  selectCanal(event) {


    console.log(event.source);
    console.log(event.value);
    console.log(ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.Canal == '' ? cc.id_canal : this.Canal)));
    this.dataSource = new MatTableDataSource<any>
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.Canal == '' ? cc.id_canal : this.Canal)));
    this.dataSource.paginator = this.paginator;
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();

  }
 public  limpiar() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
    this.dataSource.paginator = this.paginator;
    debugger; 
  }


  selectCuenta(event) {
    console.log(event);

    this.dataSource = new MatTableDataSource<any>
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.Canal == '' ? cc.id_canal : this.Canal)
        && cc.id_cuenta == (this.cuentafiltro == 0 ? cc.id_cuenta : this.cuentafiltro)));

    this.dataSource.paginator = this.paginator;
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

  gotoedit(tipo: number) {

    if (tipo == 1)
      this.router.navigate(['/editar-cuenta/0']);
    if (tipo == 2)
      this.router.navigate(['/editar-sucursal/0']);
  }

}




export interface PeriodicElement {
  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
}

var ELEMENT_DATA_PROD_REGALO: any[] = [
];
