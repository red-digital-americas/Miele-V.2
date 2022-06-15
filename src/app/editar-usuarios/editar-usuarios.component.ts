import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-editar-usuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {
  public forma: FormGroup;

  public mask = ['(', /[0-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
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
  deshabilita: boolean;
  pass: string = ""; 
  Rol: string = "";

  Niveles: any[] = [{ "id": 1, "nivel": "global" }, { "id": 2, "nivel": "canal" }, { "id": 3, "nivel": "cuenta" }, { "id": 4, "nivel": "sucursal" }];
  nivel: string = "";
  NivelesUser: any[] = [];
  permisos_vend: boolean = false; 


  user_session: any;
  permisos_edicion: boolean = false;
  permisos_niveles: boolean = false;

  sub: any;
  public dat_usr = new usuarios(); 

  confirm_password: string = ""; // para validar el password en la edición de usuario

  // tabla entidades
 
  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  validar_permisos() {
    if (this.user_session.rol == 8)
      this.permisos_edicion = true;
  }

  constructor(private route: ActivatedRoute, private heroService: DatosService, private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public matDatepicker: MatDatepickerModule, public  _formBuilder: FormBuilder) { }

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
      this.user_session = JSON.parse(localStorage.getItem("user"));

      this.aplicar_estilos();
      this.getCat_canales();
      this.getCat_Cuentas();
      this.getCat_Sucursales();
      this.getCat_Roles();

      if (this.IDUSR > 0)
        this.get_usuario_porid();
      this.validar_permisos();
      this.initForm();
    }
    
  }
 
  get_usuario_porid() {
    this.sub = this.route.params.subscribe(params => { this.dat_usr.id = + params['id']; });
    if (this.dat_usr.id > 0) {
      var creadoobj = { Id: this.dat_usr.id };
      this.heroService.ServicioPostGeneral("get_entidades_busqueda_usu_id", creadoobj).subscribe((value) => {
        setTimeout(() => {
          switch (value.result) {
            case "Error":
              console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
              break;
            default:
              if (value.result == "Success") {
                this.Roles
                this.dat_usr = value.item[0];
              //  debugger;
               // this.dat_usr.id_canal;

                this.confirm_password = this.dat_usr.password; // Asigna el password del usuario previamente almacenado 

                this.getCat_Cuentas();
                this.getCat_Sucursales();
               
                 this.dat_usr.id_cuenta; 
                this.dat_usr.id_Sucursales;
                debugger;
              
                if (this.dat_usr.id_rol == 1) {
                  this.permisos_niveles = true;
                }
                else { this.permisos_niveles = false;  }

                console.log(this.dat_usr);

              }
          }
        }, 400);
      });
    }
    else this.dat_usr.estatus = true;
  }
  
  guardar_editar_usu(IsValid: boolean) {
    debugger;
    this.sub = this.route.params.subscribe(params => {
      this.dat_usr.id = + params['id'];
      this.dat_usr.creadopor = this.IDUSR;
    });


    if (IsValid == true) {
      this.heroService.ServicioPostGeneral("crear_editar_usuario", this.dat_usr).subscribe((value) => {
        console.log(value)
        setTimeout(() => {
          switch (value.result) {
            case "Error":
              console.log("Cliente - Ocurrió un error al cargar promoción: " + value.detalle);
              alert(value.detalle);
              break;
            default:
              if (value.result == "Success") {
                debugger;
               this.gotousu(1);

              }
          }
        }, 400);
      });
    }
  }
  getCat_canales(): void {
    var creadoobj = { Id: this.IDUSR };
    this.heroService.ServicioPostGeneral("Canales_por_usuario", creadoobj)
      .subscribe((value) => {
        this.canalesCo = value.item;
      });
  }
  getNiveles(nivel: number): void {
   // debugger;
    if (nivel == 1) { // Rol: Administrador
      this.permisos_niveles = true;
      this.permisos_vend = true; 
      // No muestra canal 1: global
      //this.Niveles = [{ "id": 1, "nivel": "global" }, { "id": 2, "nivel": "canal" }, { "id": 3, "nivel": "cuenta" }, { "id": 4, "nivel": "sucursal" }];
      //Se elimina el nivel gobal para los usuarios con Rol Administrador
      this.Niveles = [{ "id": 2, "nivel": "canal" }, { "id": 3, "nivel": "cuenta" }, { "id": 4, "nivel": "sucursal" }];
    }
    if (nivel == 10004) { // Rol: Vendedor
      this.dat_usr.nivel = "sucursal"; // canal predeterminado 
      this.permisos_niveles = false; // Nivel bloqueado
      this.permisos_vend = true; 
       // Predeterminar canal 2: Own Retail
  }
    if (nivel == 8 || nivel == 9 || nivel == 10005 || nivel == 10006) {
      this.Niveles = [{ "id": 1, "nivel": "global" }, { "id": 2, "nivel": "canal" }, { "id": 3, "nivel": "cuenta" }, { "id": 4, "nivel": "sucursal" }];
      this.dat_usr.nivel = "global"; // canal predeterminado 
      this.permisos_niveles = false; // Nivel bloqueado
      this.permisos_vend = false;
      
      this.dat_usr.id_canal = 2;
      
      
      console.log(this.Cuentas);
      this.dat_usr.id_cuenta = 3;

      console.log(this.Sucursales);

      this.dat_usr.id_Sucursales = 41;
    

// Predeterminar canal 2: Own Retail

    }
  }

  getCat_Cuentas(): void {
    var creadoobj = { Id1: this.dat_usr.id_canal == 0 ? "0" : this.dat_usr.id_canal, Id2: this.IDUSR };
    this.heroService.ServicioPostGeneral("Cuentas_por_Canal_usr", creadoobj)
      .subscribe((value) => {
        this.Cuentas = value.item;
      });
  }

  getCat_Sucursales(): void {
    var creadoobj = { Id1: this.dat_usr.id_canal == 0 ? "0" : this.dat_usr.id_canal, Id2: this.dat_usr.id_cuenta == 0? "0" : this.dat_usr.id_cuenta, Id3: this.IDUSR };
    this.heroService.ServicioPostGeneral("SucursalesPorCanalCuentaUsuario", creadoobj)
      .subscribe((value) => {
        this.Sucursales = value.item;
      });
  }


  getCat_Roles(): void {
    var creadoobj = {  Id: this.IDUSR };
    this.heroService.ServicioPostGeneral("Roles_list", creadoobj)
      .subscribe((value) => {
        this.Roles[0] = value.item[0];
        this.Roles[1] = value.item[3];
        this.Roles[2] = value.item[4];
        this.Roles[3] = value.item[5];
        this.Roles[4] = value.item[6];
        this.Roles[5]  = value.item[7];
      });
  }
  gotousu(tipo: number) {
    if (tipo == 1)
      this.router.navigate(['/usuarios']);
   
  }
  /**
 * @summary Crea nuestro formulario
 */
  private initForm (): void {
    this.forma = this._formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

   passwordsMatch  (_form: FormGroup): boolean {
    if (_form.controls['password'].touched && _form.controls['confirmPassword'].touched) {
      if (_form.value.password === _form.value.confirmPassword) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
 
   verifyPasswords  (_field: string, _form: FormGroup): any {
    let result = false;
    if (!this.passwordsMatch(_form) || !this.isFieldValid(_field, _form)) {
      result = true;
    }
    return { 'is-invalid': result };
  }

  
   isFieldValid(_field: string, _form: FormGroup): boolean {
    let valid = true;
    if (_form.get(_field).invalid && _form.get(_field).touched) {
      valid = false;
    }
    return valid;
  }
}

export interface PeriodicElement {
  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
}

var ELEMENT_DATA_PROD_REGALO: any[] = [
];
