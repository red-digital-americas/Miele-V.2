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
import { usuarios } from '../models/usuarios';
import { MatNativeDateModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import * as jquery from 'jquery';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

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
  Roles: any[] = [];
  nivel: string = "";
  rol: string = "";
  rolvar: any = 0;
  nivel_var: string = ""; 
  user_session: any;
  canalfiltro: any = 0;
  rolfiltro: any = 0;
  nivelfiltro: any = 0;
  cuentafiltro: any = 0;
  sucursalfiltro: any = 0;
  txtBuscar: string = "";

  Niveles: any[] = [{ "id": 1, "nivel": "global" }, { "id": 2, "nivel": "canal" }, { "id": 3, "nivel": "cuenta" }, { "id": 4, "nivel": "sucursal" }];
  NivelesUser: any[] = [];


  permisos_niveles: boolean = false;
  permisos_edicion: boolean = false;

  tablecontent: any[] = [];


  public dat_usr = new usuarios(); 


  validar_permisos() {
    if (this.user_session.rol == 8)
      this.permisos_edicion = true;
  }

  // tabla entidades
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  displayedColumns = ['nombre', 'rol', 'nivel', 'canal', 'cuenta', 'sucursal', 'email'];


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
      this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
      this.user_session = JSON.parse(localStorage.getItem("user"));
      this.aplicar_estilos();
      this.get_entidades_busqueda();
      this.getCat_canales();

      this.getCat_Roles();
      this.validar_permisos();
    }
  }
  public limpiar() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
    this.dataSource.paginator = this.paginator;
    this.Canal = '';
    this.cuentafiltro = '';
    this.sucursalfiltro = '';
    this.rolvar = '';
    this.nivelfiltro = '';
    this.txtBuscar = '';
    debugger;
  }


  selectCanal(event) {


    console.log(event.source);
    console.log(event.value);
    console.log((ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == event.value))); 
     this.dataSource = new MatTableDataSource<PeriodicElement>
       (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.Canal == '' ? cc.id_canal : this.Canal)));
   
    this.dataSource.paginator = this.paginator;

    debugger;

  }


  selectCuenta(event) {
    console.log(event);

    this.dataSource = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.canalfiltro == 0 ? cc.id_canal : this.canalfiltro)
      && cc.id_cuenta == (this.cuentafiltro == 0 ? cc.id_cuenta : this.cuentafiltro)));

    this.dataSource.paginator = this.paginator;
  }

  selectSucursal(event) {
    console.log(event);

    this.dataSource.filter = (event.value);
    this.dataSource = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_canal == (this.canalfiltro == 0 ? cc.id_canal : this.canalfiltro)
      && cc.id_cuenta == (this.cuentafiltro == 0 ? cc.id_cuenta : this.cuentafiltro)
      && cc.id_Sucursales == (this.sucursalfiltro == 0 ? cc.id_Sucursales : this.sucursalfiltro)));

    //this.sublineas_aplicables = this.sublineas_filtro.filter(sl => sl.id_linea_producto == this._linea_filtro || sl.id == 0);
    this.dataSource.paginator = this.paginator;
  }
  selectRol() {
  

    this.dataSource = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.id_rol == (this.rolvar == 0 ? cc.id_rol : this.rolvar)));

    //this.sublineas_aplicables = this.sublineas_filtro.filter(sl => sl.id_linea_producto == this._linea_filtro || sl.id == 0);
    this.dataSource.paginator = this.paginator;
    this.getNiveles(this.user_session.rol);

  }
  selectNivel() {
   

      this.dataSource = new MatTableDataSource<PeriodicElement>
        (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.nivel == (this.nivelfiltro == '' ? cc.nivel : this.nivelfiltro)
          && (cc => cc.id_rol == (this.rolvar == 0 ? cc.id_rol : this.rolvar))));

    this.dataSource.paginator = this.paginator;

  }


  get_entidades_busqueda() {
    // debugger;
    var creadoobj = { TextoLibre: this.TextoLibre, tipo_entidad: this.tipos, Canal: this.Canal, Cuenta: this.Cuenta, IDUSR: this.IDUSR, Sucursales: this.Sucursal };
    // debugger;
    this.heroService.ServicioPostGeneral("get_entidades_busqueda_usu", creadoobj).subscribe((value) => {
      //setTimeout(() => {

      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
          break;
        default:
          if (value.result == "Success") {
            debugger;
            ELEMENT_DATA_PROD_REGALO = value.item;
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
           // ELEMENT_DATA_SUCURSALES_CC = value.item[0].condiones_comerciales_sucursal;
           // this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);

            //  this.dataSource.filteredData.toLocaleString("Sucursal");
            if (this.user_session.rol == 1) {
              this.permisos_niveles = true;
            }
            else { this.permisos_niveles = false; }
            console.log(this.user_session.rol );

            this.dataSource.paginator = this.paginator;
          }
      }
      //}, 400);
    });
  }



  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();

  }


  getCat_canales(): void {
    var creadoobj = { Id: this.IDUSR };
    this.heroService.ServicioPostGeneral("Canales_por_usuario", creadoobj)
      .subscribe((value) => {
        this.canalesCo = value.item;
      });
   

  }

  getCat_Roles(): void {
    var creadoobj = { Id: this.IDUSR };
    this.heroService.ServicioPostGeneral("Roles_list", creadoobj)
      .subscribe((value) => {
        this.Roles[0] = value.item[0];
        this.Roles[1] = value.item[3];
        this.Roles[2] = value.item[4];
        this.Roles[3] = value.item[5];
        this.Roles[4] = value.item[6];
        this.Roles[5] = value.item[7];
      });
    
  }

  getNiveles(nivel: number): void {
    this.permisos_niveles = true;
     //debugger;
    /*if (nivel == 1) {
      //this.dat_usr.nivel = false;
      this.permisos_niveles = true;
    }
    if (nivel == 10004) {
      this.dat_usr.nivel = "sucursal";
      this.permisos_niveles = false;
    }
    if (nivel == 8 || nivel == 9 || nivel == 10005 || nivel == 10006) {
      this.dat_usr.nivel = "global";
      this.permisos_niveles = false;
    }*/ 
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

