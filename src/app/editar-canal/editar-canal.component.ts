//import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
//import { FormControl } from '@angular/forms';
//import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
//import { ENTER, COMMA } from '@angular/cdk/keycodes';
//import { Observable } from 'rxjs/Observable';
//import { map, startWith } from 'rxjs/operators';
//import { DatosService } from '../datos.service';
//import { HttpClient } from '@angular/common/http';
//import { Http, Response, RequestOptions, Headers } from '@angular/http';
//import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
//import { Router } from '@angular/router';
//import { DatePipe } from '@angular/common';
//import * as moment from 'moment';
//import { ActivatedRoute } from '@angular/router';
//import { MatDatepickerModule } from '@angular/material/datepicker';
//import { MatNativeDateModule } from '@angular/material';
//import { TextMaskModule } from 'angular2-text-mask';
//import * as jquery from 'jquery';

//@Component({
//  selector: 'app-editar-canal',
//  templateUrl: './editar-canal.component.html',
//  styleUrls: ['./editar-canal.component.css']
//})
//export class EditarCanalComponent implements OnInit {
//  bodyClasses = 'skin-blue sidebar-mini';
//  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
//  tipos: number = 0;
//  tipos_entidades: any[] = [{ "id": 0, "tipo": "Todas" }, { "id": 1, "tipo": "Canales" }, { "id": 2, "tipo": "Cuentas" }, { "id": 3, "tipo": "Sucursales" }];
//  TextoLibre: string = "";
//  id_entidad: number = 0;
//  sub: any;

//  // tabla entidades
//  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
//  displayedColumns = ['id', 'tipo', 'canal', 'cuenta', 'entidad'];
//  @ViewChild('paginator') paginator: MatPaginator

//  aplicar_estilos() {
//    this.body.classList.add('skin-blue');
//    this.body.classList.add('sidebar-mini');
//  }

//  constructor(private route: ActivatedRoute, private heroService: DatosService, private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public matDatepicker: MatDatepickerModule) { }

//  ngOnInit() {
//    if (localStorage.getItem("user") == undefined) {
//      this.router.navigate(['/login']);
//    }
//    else {
//      this.sub = this.route.params.subscribe(params => { this.id_entidad = +params['id']; });

//      this.aplicar_estilos();
//      this.get_entidades_busqueda();
//    }


//  }

//  get_entidades_busqueda() {
//    // debugger;
//    var creadoobj = { TextoLibre: "", tipo_entidad: this.tipos };
//    this.heroService.ServicioPostGeneral("get_entidades_busqueda", creadoobj).subscribe((value) => {
//      //setTimeout(() => {
//      debugger;
//      switch (value.result) {
//        case "Error":
//          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
//          break;
//        default:
//          if (value.result == "Success") {
//            ELEMENT_DATA_PROD_REGALO = value.item;
//            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
//            this.dataSource.paginator = this.paginator;
//          }
//      }
//      //}, 400);
//    });
//  }

//}

//export interface PeriodicElement {
//  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
//}

//var ELEMENT_DATA_PROD_REGALO: any[] = [
//];
