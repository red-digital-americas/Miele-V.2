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
import { mensaje } from '../models/mensaje';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import * as jquery from 'jquery';

@Component({
  selector: 'comunicacion',
  templateUrl: './comunicacion.component.html',
  styleUrls: ['./comunicacion.component.css']
})
export class ComunicacionComponent implements OnInit {

  
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  public mensaje = new mensaje();
  public motivos: any[] = [];
  //[{ id: 1, descripcion: 'Entrega incorrecta' },
  //{ id: 2, descripcion: 'Error en la cotización' },
  //{ id: 3, descripcion: 'Sugerencias' },
  //{ id: 4, descripcion: 'Problemas de instalación' }]
  ////public motivos: [] = [];

  orden: boolean = false;
  verInput() {
    this.orden = true;
  }

  IDUSR: number = 0;

  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  /*constructor(private route: ActivatedRoute, private heroService: DatosService, private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public matDatepicker: MatDatepickerModule) { }*/
  constructor(private heroService: DatosService) { }
  //constructor() { }

  preventAbuse: boolean = false;
  Rol: string = "";
  user_session: any;
  permisos_edicion: boolean = false;

  validar_permisos() {
    if (this.user_session.rol == 8)
      this.permisos_edicion = true;
  }

  goBack() {
    window.history.back();
  }

  consultar_motivos() {
    this.heroService.getMotivosMensajes().subscribe(response => {
      console.log(response);
      if (response.result == "Success") {
        this.motivos = response.item; // trae el contenido
      }
    })
    //this.heroService.GetMunicipios(1).subscribe(response => {
    //  console.log(response);
    //  if (response.result == "Success") {
    //    alert("Municipios ok");
    //  }
    //})
  }

  enviarmsj(IsValid: boolean) {
    this.mensaje.usuario_id = JSON.parse(localStorage.getItem("user")).id;
    console.log(this.mensaje);
    if (IsValid) {
      this.heroService.postAddMensajes(this.mensaje).subscribe(response => {
        console.log(response);
        if (response.result == "Success") {
          alert("Tu mensaje ha sido enviado.");
          this.mensaje.motivo_id = 0;
          this.mensaje.orden_id = 0;
          this.mensaje.detalle_msj = "";
        }
      })
    }
    else {
      alert("error");
    }
    
    
  }
  
  ngOnInit() {

    this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
    this.user_session = JSON.parse(localStorage.getItem("user"));
    this.aplicar_estilos();
    this.validar_permisos();
    this.consultar_motivos();
  }

}
