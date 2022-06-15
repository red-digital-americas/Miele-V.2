//import { Component, OnInit, ViewChild } from '@angular/core';
//import { DatosService } from '../datos.service';
//import { HttpClient } from '@angular/common/http';
//import { Http, Response, RequestOptions, Headers } from '@angular/http';
//import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar } from '@angular/material';
//import { FormControl } from '@angular/forms';
//import { Observable } from 'rxjs/Observable';
//import { startWith } from 'rxjs/operators/startWith';
//import { map } from 'rxjs/operators/map';
//import { Router } from '@angular/router';
//import { ActivatedRoute } from '@angular/router';
//import { DatePipe } from '@angular/common';
//import * as moment from 'moment';


//@Component({
//  selector: 'app-detalleproducto',
//  templateUrl: './detalleproducto.component.html',
//  styleUrls: ['./detalleproducto.component.css']
//})
//export class DetalleproductoComponent implements OnInit {

//  ////////////////VARIABLES  /////////////////////

//  bodyClasses = 'skin-blue sidebar-mini';
//  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
//  email: string;
//  password: string;
//  token: boolean;
//  sub: any;
//  idcotiza: number = 0;
//  art: any;
//  message: {};
//  validar: boolean = false;
//  id_app: number;
//  TextoLibre: string = "09942890";
//  myControl: FormControl = new FormControl();
//  filteredOptions: Observable<any[]>;
//  Productos: any[] = [];
//  ProductoSEL: any[] = [{
//    id: 0, nombre: 'Cargando...', modelo: '', atributos: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_larga: '', url_manual: '', url_guia: '', descripcion_largaR: '', "cat_imagenes_producto": [
//      {
//        "url": ""
//      }]
//  }];

//  AccesoriosMostrar: any[] = [
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//  ];

//  ConsumiblesMostrar: any[] = [
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//  ];

//  ProdRelacionados: any[] = [
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
//  ];

//  Mostrardetalle: boolean = false;
//  claseTitular: string = "input-group col-xs-12";
//  AddcarritoOk: boolean = false;
//  Validasiguiente: string = "";
//  Id_P: string = "";
//  NoProdCarrito: number = 0;
//  id_usuario: string = "";
//  fecha_creacion: string = "01/01/1900";

//  constructor(private route: ActivatedRoute, private heroService: DatosService, private router: Router, public snackBar: MatSnackBar) { }

//  ngOnInit() {
//    if (localStorage.getItem("user") == undefined) {
//      this.router.navigate(['/login']);
//    }
//    else {
//      this.sub = this.route.params.subscribe(params => {
//        this.idcotiza = +params['id_cotiza'];
//      });

//      this.sub = this.route.params.subscribe(params => {
//        this.art = +params['art'];
//      });

//      console.log("Cotiza: " + this.idcotiza)
//      this.AddcarritoOk = false;
//      this.id_usuario = JSON.parse(localStorage.getItem("user")).id;
//      this.fecha_creacion = moment().format("MM/DD/YYYY");
//      this.body.classList.add('skin-blue');
//      this.body.classList.add('sidebar-mini');
//      this.CallCargarProducto();
//      //this.getCargarAccesoriosPopulares();
//    }

//  }

//  getCargarAccesoriosPopulares() {
//    this.heroService.getCargarAccesoriosPopulares("algo")
//      .subscribe((value) => {
//        switch (value.token) {
//          case "Error":
//            this.validar = true;
//            break;
//          default:
//            if (value.token == "Success") {
//              this.AccesoriosMostrar = value.item;
//              console.log(this.AccesoriosMostrar)
//            }
//        }
//      });
//  }

//  getProductosRelacionadosAll(id: number) {
//    // debugger;
//    var creadoobj = { Id: id };
//    this.heroService.ServicioPostGeneral_prods("ProductosRelacionadosAll", creadoobj)
//      .subscribe((value) => {
//        debugger;
//        switch (value.token) {
//          case "Error":
//            this.validar = true;
//            break;
//          default:
//            if (value.token == "Success") {

//              this.ProdRelacionados = value.productos_all[0];
//              this.AccesoriosMostrar = value.productos_all[1];
//              this.ConsumiblesMostrar = value.productos_all[2];
//            }
//        }
//      });
//  }

//  CallCargarProducto() {
//    this.heroService.getCargarProducto(this.art)
//      .subscribe((value) => {
//        switch (value.token) {
//          case "Error":
//            this.validar = true;
//            break;
//          default:
//            if (value.token == "Success") {
//              this.ProductoSEL = value.item;
//              this.getProductosRelacionadosAll(this.ProductoSEL[0].id);
//              console.log(this.ProductoSEL)
//            }
//        }
//      });
//  }

//  regresar(): void {
//    this.router.navigate(['/cargarproductos']);
//  }

//  openSnackBar(message = "Producto agregado.", action = '') {
//    this.Id_P = event.srcElement.getAttribute("id");
//    this.Id_P = this.Id_P.replace("l", "");
//    if (this.idcotiza == 0) {
//      this.heroService.AddProductoCarrito(0, 0, this.Id_P, this.id_usuario, this.fecha_creacion)
//        .subscribe((value) => {
//          switch (value.value.response) {
//            case "Error":
//              break;
//            default:
//              if (value.value.response == "Success") {
//                console.log("Productos agregados al carrito.")
//                this.ActualizarCarrito();
//              }
//          }
//        });
//    }
//    else {
//      this.heroService.AddProductoCotiza(0, 0, this.Id_P, this.idcotiza, this.fecha_creacion, 1)
//        .subscribe((value) => {
//          switch (value.value.response) {
//            case "Error":
//              console.log("Ocurrio un error al guardar el producto");
//              break;
//            default:
//              if (value.value.response == "Success") {
//                console.log("Productos agregados a la cotizacion:")
//              }
//          }
//        });
//    }



//    this.snackBar.open(message, action, {
//      duration: 3000,
//      verticalPosition: 'bottom',
//      horizontalPosition: 'right',
//      extraClasses: ['blue-snackbar']

//    });

//  }

//  ActualizarCarrito() {
//    this.heroService.getNumProdCarrito(this.id_usuario)
//      .subscribe((value) => {
//        switch (value.token) {
//          case "Error":
//            this.validar = true;
//            break;
//          default:
//            if (value.token == "Success") {
//              if (value.item[0]) {
//                if (value.item[0].nprod) {
//                  this.NoProdCarrito = value.item[0].nprod;
//                  this.heroService.NPCarrito = this.NoProdCarrito;
//                }
//                else
//                  this.NoProdCarrito = 0;
//              }
//            }
//        }
//      });
//  }
//}

////@Component({
////  selector: 'snack-bar-component-example-snack',
////  templateUrl: 'snack-bar-component-example-snack.html',
////  styles: [`.example-pizza-party { color: hotpink; }`],
////})
////export class PizzaPartyComponent { }
