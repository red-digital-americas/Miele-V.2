import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Articulo } from '../models/buscarproductos.modelo'


@Component({
  selector: 'app-cargarpcarrito',
  templateUrl: './cargarpcarrito.component.html',
  styleUrls: ['./cargarpcarrito.component.css']
})
export class CargarpcarritoComponent implements OnInit {

  ////////////////VARIABLES  /////////////////////
  id_usuario: string = "";
  fecha_creacion: string = "01/01/1900";
  resultado = "";
  bodyClasses = 'skin-blue sidebar-mini';
  preventAbuse: boolean = false;
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  email: string;
  password: string;
  token: boolean;
  validar: boolean = false;
  id_app: number;
  TextoLibre: string = "";
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  myControl: FormControl = new FormControl();
  clickedElelemt: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  ORIGINAL: string = "ÁáÉéÍíÓóÚúÑñÜü";
  REPLACEMENT: string = "AaEeIiOoUuNnUu";
  sub: any;
  idcotiza: number = 0;

  Productos: any[] = [];
  ProdMostrar: any[] = [
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
  ];
  AccesoriosMostrar: any[] = [
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
  ];

  ConsumiblesMostrar: any[] = [
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
  ];

  ProdRelacionados: any[] = [
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
    { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
  ];

  ProductoSEL: any[] = [{ id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }] }];
  Mostrardetalle: boolean = false;
  MostrarProductos: boolean = true;
  claseTitular: string = "input-group col-xs-12";
  buttonDisabled: boolean = false;
  AddcarritoOk: boolean = false;
  Validasiguiente: string = "";
  Id_P: string = "";
  NoProdCarrito: number = 0;
  estado: boolean = false;
  public _ProdMostrar = new Articulo();
  public _AccesoriosMostrar = new Articulo();
  letreroProductos: string = "Productos más comprados"

  @Output() emitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute, private heroService: DatosService, private router: Router, public snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.sub = this.route.params.subscribe(params => { this.idcotiza = +params['id_cotiza']; });
      this.CallgetProductos();
      this.getProductosPopularesAll();
      //this.getCargarProductosPopulares();
      //this.getCargarAccesoriosPopulares();
      this.AddcarritoOk = false;
      this.id_usuario = JSON.parse(localStorage.getItem("user")).id;
      this.fecha_creacion = moment().format("MM/DD/YYYY");
      this.body.classList.add('skin-blue');
      this.body.classList.add('sidebar-mini');
      this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), map(val => this.filter(val)));
    }
  }

  /////////////////////// AUTOCOMPLETE ////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  CallgetProductos() {

    this.heroService.getProductosLibre(this.TextoLibre)
      .subscribe((value) => {
        switch (value.token) {
          case "Error":
            this.validar = true;
            break;
          default:
            if (value.token == "Success") {
              this.Productos = value.grp_lineas;
            }
        }
      });
  }

  stripAccents(str: string): string {
    debugger;
    if (str == null) {
      return null;
    }
    var array: any = str.split('');
    var i_ = 0;
    for (var item of array) {
      var pos = this.ORIGINAL.indexOf(item);
      if (pos > -1) {
        array[i_] = this.REPLACEMENT.charAt(pos);
      }
      i_++;
    }

    var resultado: string = array.join("");

    return resultado;
  }


  filter(val: string) {
    //return this.Productos.filter(option => option.nombre.toLowerCase().indexOf(val.toLowerCase()) === 0);
    return this.Productos.filter(option => this.stripAccents(option.nombre.toLowerCase()).indexOf(val.toLowerCase()) > -1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.CallCargarResultados();
    //console.log(event.option.value);
  }


  ////////////////////// FUNCIONES BUSQUEDA PRODUCTOS /////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  CallCargarResultados() {
    this.preventAbuse = true;
    this.heroService.getCargarResultados(this.TextoLibre)
      .subscribe((value) => {
        this.preventAbuse = false;
        switch (value.token) {
          case "Error":
            this.validar = true;
            break;
          default:
            if (value.token == "Success") {
              if (value.item.length > 0) {
                //if (value.item.length == 1) {
                //  this.Mostrar_ProdSel(value.item);
                //}
                //else {
                this.Mostrar_ProdMulti(value.item);
                //}
              }
              else {
                this.Mostrardetalle = false;
                this.MostrarProductos = true;
                this.claseTitular = "input-group col-xs-12"
                this.resultado = "No hay concidencias con la busqueda, intente de nuevo."
                this.letreroProductos = "Productos más comprados";
              }
            }
        }
      });
  }

  Mostrar_ProdSel(item: any) {
    //    this.router.navigate(['/detalleproducto/' + this.ProductoSEL[0].sku + '/0']);

    if (item[0])
      this.ProductoSEL = item;
    else
      this.ProductoSEL[0] = item;

    // this.getProdRelacionados(this.ProductoSEL[0].id);
    this.getProductosRelacionadosAll(this.ProductoSEL[0].id);

  }

  Mostrar_ProdMulti(item: any) {
    this.ProdMostrar = item;
    this.Mostrardetalle = true;
    this.Mostrardetalle = false;
    this.MostrarProductos = true;
    this.claseTitular = "input-group col-xs-12"
    this.letreroProductos = this.TextoLibre;
    this.resultado = "";
  }

  getProductosRelacionadosAll(id: number) {
    // debugger;
    var creadoobj = { Id: id };
    this.heroService.ServicioPostGeneral_prods("ProductosRelacionadosAll", creadoobj)
      .subscribe((value) => {
        debugger;
        switch (value.token) {
          case "Error":
            this.validar = true;
            break;
          default:
            if (value.token == "Success") {
              this.preventAbuse = false;
              //console.log(value);
              this.Mostrardetalle = true;
              this.MostrarProductos = false;
              this.claseTitular = "input-group col-xs-6"
              this.resultado = ""
              this.letreroProductos = this.TextoLibre;
              this.ProdRelacionados = value.productos_all[0];
              this.AccesoriosMostrar = value.productos_all[1];
              this.ConsumiblesMostrar = value.productos_all[2];
            }
        }
      });
  }

  getProdRelacionados(id: number) {
    debugger;
    var creadoobj = { Id: id };
    this.heroService.ServicioPostGeneral_prods("ProductosRelacionados", creadoobj)
      .subscribe((value) => {
        // debugger;
        this.preventAbuse = false;
        //console.log(value);
        this.ProdRelacionados = value.item;
        this.Mostrardetalle = true;
        this.MostrarProductos = false;
        this.claseTitular = "input-group col-xs-6"
        this.resultado = ""
        this.letreroProductos = this.TextoLibre;
      });
  }


  ////////////////////////// CARGAS INICIALES /////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  getCargarProductosPopulares() {
    this.heroService.getCargarProductosPopulares("algo")
      .subscribe((value) => {
        switch (value.token) {
          case "Error":
            this.validar = true;
            break;
          default:
            if (value.token == "Success") {
              this.ProdMostrar = value.item;
            }
        }
      });
  }

  getCargarAccesoriosPopulares() {
    this.heroService.getCargarAccesoriosPopulares("algo")
      .subscribe((value) => {
        switch (value.token) {
          case "Error":
            this.validar = true;
            break;
          default:
            if (value.token == "Success") {
              this.AccesoriosMostrar = value.item;
            }
        }
      });
  }

  getProductosPopularesAll() {
    // debugger;
    var creadoobj = { Id: 0 };
    this.heroService.ServicioPostGeneral_prods("ProductosPopularesAll", creadoobj)
      .subscribe((value) => {
        debugger;
        switch (value.token) {
          case "Error":
            this.validar = true;
            break;
          default:
            if (value.token == "Success") {
              this.ProdMostrar = value.productos_all[0];
              this.AccesoriosMostrar = value.productos_all[1];
              this.ConsumiblesMostrar = value.productos_all[2];
            }
        }
      });
  }


  ///////////////////////////// FUNCIONES CARRITO /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  ActualizarCarrito() {
    this.heroService.getNumProdCarrito(this.id_usuario)
      .subscribe((value) => {
        switch (value.token) {
          case "Error":
            this.validar = true;
            break;
          default:
            if (value.token == "Success") {
              if (value.item[0]) {
                if (value.item[0].nprod) {
                  this.NoProdCarrito = value.item[0].nprod;
                  this.heroService.NPCarrito = this.NoProdCarrito;
                }
                else
                  this.NoProdCarrito = 0;
              }
            }
        }
      });
  }

  //openSnackBar(message = "Producto agregado al carrito.", action = '') {
  //  this.preventAbuse = true;
  //  this.Id_P = event.srcElement.getAttribute("id")
  //  this.Id_P = this.Id_P.replace("l", "");
  //  this.heroService.AddProductoCarrito(0, 0, this.Id_P, this.id_usuario, this.fecha_creacion)
  //    .subscribe((value) => {
  //      this.preventAbuse = false;
  //      switch (value.value.response) {
  //        case "Error":
  //          break;
  //        default:
  //          if (value.value.response == "Success") {
  //            this.AddcarritoOk = true;
  //            this.ActualizarCarrito();
  //          }
  //      }
  //    });

  //  this.snackBar.open(message, action, {
  //    duration: 3000,
  //    verticalPosition: 'bottom',
  //    horizontalPosition: 'right',
  //    extraClasses: ['blue-snackbar']
  //  });
  //}

  openSnackBar(message = "Producto agregado a la cotización.", action = '') {
    this.Id_P = event.srcElement.getAttribute("id")
    this.Id_P = this.Id_P.replace("l", "");
    this.heroService.AddProductoCotiza(0, 0, this.Id_P, this.idcotiza, this.fecha_creacion, 1)
      .subscribe((value) => {
        switch (value.value.response) {
          case "Error":
            console.log("Ocurrio un error al guardar el producto");
            break;
          default:
            if (value.value.response == "Success") {
              this.AddcarritoOk = true;
            }
        }
      });
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });
  }

  ToCreate() {
    this.heroService.getNumProdCarrito(this.id_usuario)
      .subscribe((value) => {
        switch (value.token) {
          case "Error":
            this.validar = true;
            break;
          default:
            if (value.token == "Success") {
              if (value.item[0]) {
                if (value.item[0].nprod) {
                  this.NoProdCarrito = value.item[0].nprod;
                  if (this.NoProdCarrito > 0) {
                    // this.router.navigate(['/cotizacion']);
                    this.router.navigate(['/carshop']);
                    this.Validasiguiente = "";
                  }
                }
                else
                  this.Validasiguiente = "Seleccione por lo menos un Producto/Accesorio.";
              }
              else
                this.Validasiguiente = "Seleccione por lo menos un Producto/Accesorio.";
            }
        }
      });
  }
}

/////////////////////////////// SNACK BAR ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var ELEMENT_DATA: Element[] = [];
@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [`.example-pizza-party { color: hotpink; }`],
})

export class PizzaPartyComponent { }


