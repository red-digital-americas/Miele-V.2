//import { Component, OnInit } from '@angular/core';
//import { DatosService } from '../datos.service';
//import { HttpClient } from '@angular/common/http';
//import { Http, Response, RequestOptions, Headers } from '@angular/http';
//import { Router } from '@angular/router';

//@Component({
//  selector: 'app-ver-servicio',
//  templateUrl: './ver-servicio.component.html',
//  styleUrls: ['./ver-servicio.component.css']
//})
//export class VerServicioComponent implements OnInit {
//  preventAbuse = false;

//  text_busqueda: string = "";
//  public result_personas: string[];
//  public result_direcciones: string[];
//  public result_ordenes: string[];
//  public result_telefonos: string[];
//  isvisible_orden: boolean = false;
//  isvisible_telefono: boolean = false;
//  isvisible_direccion: boolean = false;
//  isvisible_persona: boolean = false;
//  valid: boolean = false;

//  bodyClasses = 'skin-blue sidebar-mini';
//  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

//  constructor(private heroService: DatosService, private http: HttpClient, private https: Http, private router: Router) { }

//  ngOnInit() {
//    if (localStorage.getItem("user") == undefined) {
//      this.router.navigate(['/login']);
//    }
//    else {
//      this.heroService.verificarsesion();
//      // add the the body classes
//      this.body.classList.add('skin-blue');
//      this.body.classList.add('sidebar-mini');

//    }
//  }

//  ngOnDestroy() {
//    // remove the the body classes
//    this.body.classList.remove('skin-blue');
//    this.body.classList.remove('sidebar-mini');
//  }

//  buscar() {
//    if (this.text_busqueda == "") {
//      this.valid = true;
//    }
//    else {
//      this.preventAbuse = true;
//      this.heroService.service_general("Clientes/Busqueda", {
//        "texto": this.text_busqueda
//      }).subscribe((value) => {
//        setTimeout(() => {
//          this.preventAbuse = false;
//          this.valid = false;
//          if (value.value.direcciones == 0) {
//            this.isvisible_direccion = false;
//          }
//          else {
//            this.isvisible_direccion = true;
//          }

//          if (value.value.ordenes == 0) {
//            this.isvisible_orden = false;
//          }
//          else {
//            this.isvisible_orden = true;
//          }

//          if (value.value.telefonos == 0) {
//            this.isvisible_telefono = false;
//          }
//          else {
//            this.isvisible_telefono = true;
//          }

//          if (value.value.personas == 0) {
//            this.isvisible_persona = false;
//          }
//          else {
//            this.isvisible_persona = true;
//          }
//          this.result_direcciones = value.value.direcciones;
//          this.result_ordenes = value.value.ordenes;
//          this.result_telefonos = value.value.telefonos;
//          this.result_personas = value.value.personas;
//        }, 400);
//      });
//    }
//  }
//}
