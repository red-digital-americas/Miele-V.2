import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as jquery from 'jquery';
import { Router } from '@angular/router';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { Element } from '@angular/compiler';


@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit {

  text_busqueda: string = "";
  fecha_inicio: string = "";
  fecha_fin: string = "";
  id_cat_tipo_condicion: number = 0;
  rangofechas: string = "";
  Fechainirango: string = "";
  public daterange: any = {};
  Fechafinrango: string = ""; 

  //Direccion inicio
  date_ini = new FormControl(new Date());
  fecha_hoy: string = moment().format("MM/DD/YYYY");
  hora: string;

  //Direccion fin
  date_fin = new FormControl(new Date());
  horafin: string;

  tipos_concdicion: any[] = [{ "id": 1, "desc": "Monto" }, { "id": 2, "desc": "Paquetes" }, { "id": 3, "desc": "Combinado" }];

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];


  displayedColumns = ['id', 'nombre', 'fecha_hora_inicio', 'fecha_hora_fin', 'tipos_herencia_promo', 'tipo_condicion', 'obligatoria', 'tipo_beneficios'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  preventAbuse = false;

  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };

  constructor(private router: Router, private heroService: DatosService, public matDatepicker: MatDatepickerModule) { }


  Rol: string = "";
  user_session: any;
  permisos_edicion: boolean = false;

  validar_permisos() {
    if (this.user_session.rol == 8 || this.user_session.rol == 9)
      this.permisos_edicion = true;
  }


  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.user_session = JSON.parse(localStorage.getItem("user"));
      this.body.classList.add('skin-blue');
      this.body.classList.add('sidebar-mini');
      this.busqueda_promociones();
      this.validar_permisos();
    }

  }

  public selectedDate(value: any, datepicker?: any) {
    this.Fechainirango = (value.start._d.getMonth() + 1) + '/' + value.start._d.getDate() + '/' + value.start._d.getFullYear()
    this.Fechafinrango = (value.end._d.getMonth() + 1)+'/' + value.end._d.getDate()  + '/' + value.end._d.getFullYear()
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
    debugger;
    ELEMENT_DATA = [];

    this.busqueda_promociones();

  }

  /////////////////// BUSCAR LAS PROMOCIONES //////////////////////////////////

  busqueda_promociones() {
    var creadoobj = {
      TextoLibre: this.text_busqueda,
      FechaIni: this.Fechainirango,
      FechaFin: this.Fechafinrango ,
      id_cat_tipo_condicion: this.id_cat_tipo_condicion
    };
    this.preventAbuse = true;
    debugger;
    this.heroService.ServicioPostGeneral("busqueda_promociones", creadoobj).subscribe((value) => {
      //  setTimeout(() => {

      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargar las promociones: " + value.detalle);
          break;
        default:
          if (value.result == "Success") {
            debugger;
            ELEMENT_DATA = value.item;
            this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            this.preventAbuse = false;
          }
      }
      //  }, 400);
    });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  searchProduct() {
    this.dataSource = new MatTableDataSource<Element>
      (ELEMENT_DATA.filter(cc => cc.id_cat_tipo_condicion == (this.id_cat_tipo_condicion == 0 ? cc.id_cat_tipo_condicion : this.id_cat_tipo_condicion)));
    this.dataSource.paginator = this.paginator;
    debugger;
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  

  limpiar_controles() {
    this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  goTodetalle(id: number) {
    debugger;
    this.router.navigate(['/nuevapromocion/' + id]);
  }

}


export interface Element {
  //descripcion: string; linea: number;

}

var ELEMENT_DATA: any[] = [
];
