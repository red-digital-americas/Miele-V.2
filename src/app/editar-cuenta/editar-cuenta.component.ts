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
import { cuentas, cat_condicionespago } from '../models/cuentas';
import { MatNativeDateModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { Overlay } from '@angular/cdk/overlay';

import * as jquery from 'jquery';
import { Utils } from '../utils/utils';
import { ProductsService } from '../services/products.service';
import { take } from 'rxjs/operator/take';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-editar-cuenta',
  templateUrl: './editar-cuenta.component.html',
  styleUrls: ['./editar-cuenta.component.css']
})
export class EditarCuentaComponent implements OnInit {
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  tipos: number = 0;

  tipos_entidades: any[] = [{ "id": 0, "tipo": "Todas" }, { "id": 1, "tipo": "Canales" }, { "id": 2, "tipo": "Cuentas" }, { "id": 3, "tipo": "Sucursales" }];
  TextoLibre: string = "";
  id_entidad: number = 0;
  comision: number = 0;
  valorgral_cc: number = 0;
  sub: any;


  public cuentaObj = new cuentas();
  public formPago = new cat_condicionespago();
  //Variables que se ocupaban en los metodos de donde saque los elementos html 
  IDUSR: number = 0;
  Cuentas: any[] = [];
  cuenta: number = 0;
  canal: string = "";


  public newImages: any[] = [];

  public newFiles: any[] = [];
  canalesCo: any[] = [];




  chk_ant: boolean = false;
  chk_cred: boolean = false;
  chk_con: boolean = false;
  chk_ms: boolean = false;

  // tabla entidades
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  displayedColumns = ['id', 'tipo', 'entidad', 'canal'];
  @ViewChild('paginator') paginator: MatPaginator



  datasource_pc = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM)
  displayedColumns_pc = ['id', 'FormPagoExist', 'FormaPago', 'comprobantes_obligatorios'];

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
      this.cargar_datos_Cat_form();
      this.getCat_canales();
      this.validar_permisos();
    }

  }


  CallCrearEditarCuentas() {
    debugger;
    var creadoobj = {
      id: this.cuentaObj.id, id_Canal: this.cuentaObj.id_Canal,
      Cuenta_es: this.cuentaObj.cuenta_es, formPago: this.cuentaObj.cat_condicionespago,
      IDUSR: this.IDUSR
    };
    // debugger;
    this.heroService.ServicioPostGeneral("CrearEditarCuenta", creadoobj).subscribe((value) => {
      //setTimeout(() => {

      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
          break;
        default:
          if (value.result == "Success") {
            //  debugger;
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




  cargar_datos_Cat_form() {
    this.sub = this.route.params.subscribe(params => { this.cuentaObj.id = + params['id']; });
    debugger;
    if (this.cuentaObj.id > 0) {
      var busqueda = { id: this.cuentaObj.id }
      this.heroService.ServicioPostGeneral("cargar_cat_cuenta_id", busqueda).subscribe((value) => {
        console.log(value)
        setTimeout(() => {
          switch (value.result) {
            case "Error":
              console.log("Cliente - Ocurrio un error al cargar cuentaObj: " + value.detalle);
              break;
            default:
              if (value.result == "Success") {

                debugger;
                //this.formPago = 
                /* this.formPago.id = 9;
                 this.formPago.FormPagoExist = true;
                 this.formPago.FormaPago = "asdasdasd";
                 this.formPago.comprobantes_obligatorios = true;
                 */

                this.cuentaObj.cuenta_es = value.item[0].cuenta_es;
                this.cuentaObj.id_Canal = value.item[0].id_Canal;
                this.formPago = value.item[i];
                for (var i = 0; i < value.item.length; i++) {
                  this.cuentaObj.cat_Formas_Pago[i] = value.item[i];
                  ELEMENT_DATA__PROMO_COM[i] = value.item[i];
                  if (value.item[i] != null) {
                    if (value.item[i].cat_Formas_Pago.formaPago == "Anticipo 50%") {
                      this.chk_ant = true;
                    }
                    if (value.item[i].cat_Formas_Pago.formaPago == "Crédito 100% ") {
                      this.chk_cred = true;
                    }
                    if (value.item[i].cat_Formas_Pago.formaPago == "Contado") {
                      this.chk_con = true;
                    }
                    if (value.item[i].cat_Formas_Pago.formaPago == "Crédito 100% con Ticket") {
                      this.chk_ms = true;
                    }

                  }
                }



                this.datasource_pc = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM)
                debugger;
                this.displayedColumns_pc = ['id', 'FormPagoExist', 'FormaPago', 'comprobantes_obligatorios'];

              }
          }
        }, 400);
      });
    }
  }


  public GuardarEditarCuenta(IsValid: boolean) {

    if (IsValid == true)
      this.CallCrearEditarCuenta(this.cuentaObj, this.formPago);

  }

  public gotoedit(tipo: number) {

    if (tipo == 1)
      this.router.navigate(['/cuentas']);
  }


  public CallCrearEditarCuenta(cuentaObj: cuentas, formPago: cat_condicionespago) {
    debugger;

    var flag = this.cuentaObj.cat_Formas_Pago.length;

    for (var i = 0; i < flag; i++) {
      this.cuentaObj.cat_Formas_Pago.pop();
    }

    if (this.chk_ant == true) {

      this.cuentaObj.cat_Formas_Pago.push({ id_Cat_Formas_Pago: 5, FormaPago: "Anticipo 50%", comprobantes_obligatorios: true });
    }
    debugger;

    if (this.chk_cred == true) {
      this.cuentaObj.cat_Formas_Pago.push({ id_Cat_Formas_Pago: 6, FormaPago: "Crédito 100% ", comprobantes_obligatorios: false });

    }
    if (this.chk_con == true) {
      this.cuentaObj.cat_Formas_Pago.push({ id_Cat_Formas_Pago: 7, FormaPago: "Contado", comprobantes_obligatorios: true });

    }
    if (this.chk_ms == true) {
      this.cuentaObj.cat_Formas_Pago.push({ id_Cat_Formas_Pago: 9, FormaPago: "Crédito 100% con Ticket", comprobantes_obligatorios: true });
    }

    debugger;
    this.heroService.CrearEdicarCuenta(cuentaObj, formPago)
      .subscribe((value) => {
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al guardar la dirección: " + value.detalle);
            break;
          default:
            if (value.result == "Success") {
              console.log(value.detalle);
              this.gotoedit(1);
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
var ELEMENT_DATA__PROMO_COM: any[] = [
];
