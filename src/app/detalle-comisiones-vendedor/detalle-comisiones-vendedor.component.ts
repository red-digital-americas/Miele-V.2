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
import { comisiones } from '../models/comisiones';

@Component({
  selector: 'app-detalle-comisiones-vendedor',
  templateUrl: './detalle-comisiones-vendedor.component.html',
  styleUrls: ['./detalle-comisiones-vendedor.component.css']
})
export class DetalleComisionesVendedorComponent implements OnInit {

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
  ventas_totales: number = 0; 
  comisiones_por_pagar: number = 0;
  comisiones_pagadas: number = 0;
  permisos_edicion: boolean = false;
  ComisionFilter: string = "";
  rangofechas: string = "";
  Fechainirango: string = "";

  pagadaFilter: boolean ; 
  desa1: boolean = false  ; 
  desa2: boolean = false  ; 
  desa3: boolean = false  ; 

  public daterange: any = {};
  Fechafinrango

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM)
  displayedColumns = ['id', 'nombre', 'paterno', 'username','fec_generacion', 'comisiones', 'acciones'];



  sub: any;
  public com = new comisiones();
  public cantidades = new comisiones();

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
      this.get_comision_id();

      this.validar_permisos();
    }
    
  }

 
  get_comision_id() {
    this.sub = this.route.params.subscribe(params => { this.com.id = + params['id']; });
    if (this.com.id > 0) {
      var creadoobj = {
        Id: this.com.id  ,  FecIni: this.Fechainirango,
        FecFin: this.Fechafinrango };

     

      this.heroService.ServicioPostGeneral("get_entidades_busqueda_com_id", creadoobj).subscribe((value) => {
        setTimeout(() => {
          debugger;
          switch (value.result) {
            case "Error":
              console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
              break;
            default:
              if (value.result == "Success") {
                ELEMENT_DATA__PROMO_COM = []; 
                this.com = value.item[0];
                this.ventas_totales = 0;
                this.comisiones_por_pagar = 0;
                this.comisiones_pagadas = 0;
                //this.com.comisiontotal = 0;
                //this.com.comisiontotalpagada = 0;
                // this.com.mostrar_pagadas = false;
                debugger;
                if (this.com.fec_generacion != 0 && value.vendedor != undefined) {
                  for (var i = 0; i < value.vendedor.length; i++) {

                    //ELEMENT_DATA__PROMO_COM[i] = value.item[i];
                    this.ventas_totales += (value.vendedor[i].importe_promociones + value.vendedor[i].iva_promociones);
                    this.comisiones_pagadas += (value.vendedor[i].comisiontotalpagada[0]);
                    //this.ventas_totales  =  (this.com.importe_promociones + this.com.iva_promociones);
                  }
                  this.comisiones_por_pagar = (this.com.comisiontotal - this.comisiones_pagadas);
                  for (var i = 0; i < value.item.length; i++) {
                    if (value.item[i].comision != 0) {
                      ELEMENT_DATA__PROMO_COM.push(value.item[i]);
                    }
                    
                    

                  }

                }
                debugger; 
                this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM)
                this.displayedColumns = ['id', 'nombre', 'paterno', 'username', 'fec_generacion','tipo_comision', 'comisiones', 'acciones'];


              }
          }
        }, 400);
      });
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

    
    console.log(this.daterange.label);
    console.log(this.daterange.start);
    console.log(this.daterange.end);

    this.get_comision_id();
  }

  limpiafecha() {
    this.Fechainirango = null;
    this.Fechafinrango = null;

  }

  pagar_comision(id_comi:number , id_estatus : number ) {
    this.sub = this.route.params.subscribe(params => {
      this.com.id = + params['id'];
       this.IDUSR;
    });
    debugger;
    var creadoobj = { id_cotizacion: id_comi, id_cat_tipo_comision: id_estatus, id_quienpago: this.IDUSR };
    this.heroService.ServicioPostGeneral("pagar_comision", creadoobj).subscribe((value) => {
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
                this.get_comision_id();
              }
          }
        }, 400);
      });
    
  }

  pagadas(event: any) {
   // this.pagadaFilter= true
    if (event.checked) {
      console.log((ELEMENT_DATA__PROMO_COM.filter(cc => cc.pagada == true)));
      this.dataSource = new MatTableDataSource<PeriodicElement>
        (ELEMENT_DATA__PROMO_COM.filter(cc => cc.pagada == true));
      this.desa1 = true;
      this.desa3 = true; 
    }
    else {
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM);
      this.desa1 = false ;
      this.desa3 = false; 
    }

  }

  porpagar(event : any ) {

    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM);

  }

  com_directas(event: any) {
    console.log(event.checked)

    if (event.checked) {
      this.ComisionFilter = 'directa';
      console.log((ELEMENT_DATA__PROMO_COM.filter(cc => cc.tipo_comision == (this.ComisionFilter == '' ? cc.tipo_comision : this.ComisionFilter))));
      this.dataSource = new MatTableDataSource<PeriodicElement>
        (ELEMENT_DATA__PROMO_COM.filter(cc => cc.tipo_comision == (this.ComisionFilter == '' ? cc.tipo_comision : this.ComisionFilter)));
       this.desa1 = true; 
       this.desa2 = true; 
    }
    else {
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA__PROMO_COM);
      this.desa1 = false ; 
      this.desa2 = false; 

    }
  }


 
  
  gotousu(tipo: number) {
    if (tipo == 1)
      this.router.navigate(['/comisiones-vendedor']);
  }

}






export interface PeriodicElement {
  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
}


var ELEMENT_DATA__PROMO_COM: any[] = [
];
