/// <reference path="../models/buscarproductos.modelo.ts" />
import { Component, OnInit, ViewChild, Output, EventEmitter, HostListener, Input, OnChanges, Inject, OnDestroy } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { MatMenuModule, MatButtonModule } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Articulo } from '../models/buscarproductos.modelo';
import { linea, producto, subLine } from '../models/producto';
import { ProductsService } from '../services/products.service';
import { NavItem } from './nav-item';
import { delay } from 'rxjs/operator/delay';


@Component({
  selector: 'app-cargarproductos',
  templateUrl: './cargarproductos.component.html',
  //template: `<app-menu-item></app-menu-item>`,
  styleUrls: ['./cargarproductos.component.css']
})

export class CargarproductosComponent implements OnInit, OnDestroy {
  @Input() itemSelected: NavItem;
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
  isNew: boolean = true;
  idcotiza: number = 0;
  sub: any;
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  myControl: FormControl = new FormControl();
  clickedElelemt: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  ORIGINAL: string = "ÁáÉéÍíÓóÚúÑñÜü";
  REPLACEMENT: string = "AaEeIiOoUuNnUu";

  public lines: linea[] = [];
  public subLines: linea[] = [];
  public menu_productos: any[] = [];
  selitem: NavItem;

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

  AccesoriosCarrusel: any[] = [
    {
      SubAccesorios: [
        { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
        { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
        { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
        { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
      ]
    }
  ];

  AccesoriosPopulares: any[] = [
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
  ConsumiblesCarrusel: any[] = [
    {
      Subconsumibles: [
        { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
        { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
        { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
        { id: 0, nombre: 'Cargando...', modelo: '', sku: '', dedescripcion_corta: '', precio: '', descripcion_largaR: '', "cat_imagenes_producto": [{ "url": "" }], precio_con_iva: '', descripcion_corta: '' },
      ]
    }
  ];

  ConsumiblesPopulares: any[] = [
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
  bigImgsrc: string;
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
  lista_car_base: any[] = [{ car_base: 'Espere un momento...', productos: this.ProdMostrar }];

  @Output() emitEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  scrHeight: any;
  scrWidth: any;
  withTarjeta: number = 155;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    this.withTarjeta = this.scrWidth > 1024 ? 260 : 160;
    //console.log(this.scrHeight, this.scrWidth, this.withTarjeta);
  }

  constructor(private heroService: DatosService, private router: Router, private route: ActivatedRoute, public snackBar: MatSnackBar, private productsService: ProductsService, public dialog: MatDialog) {
    this.getScreenSize();
  }

  ngOnInit() {
    
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      //this.lista_car_base.push("Espere un momento", this.ProdMostrar);
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
      this.getMenuProductos();
      //this.sub = this.route.params.subscribe(params => { this.idcotiza = +params['id']; });
      this.idcotiza = this.route.snapshot.params['id'];
      //document.getElementById("cardAccesorios").style.width = "5000px";
      //var div = document.getElementById('cardAccesorios');
      //div.setAttribute("style", "width: 1500px");
      debugger;
      //console.log(this.sub);
      if (this.idcotiza > 0) {
        this.isNew = false;
        this.heroService.MostrarCarrito = false;
      }
      else this.isNew = true;
    }
  }

  ngOnDestroy() {
    debugger;
    this.heroService.MostrarCarrito = true;
  }
  /////////////////////// MENU ////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  getMenuProductos() {
    this.heroService.get_menu_productos().subscribe(res => {
      if (res != undefined) {
        if (res.result == "Success") {
          //alert("ok");
          this.menu_productos = res.item;
          this.NoProdCarrito = this.heroService.NPCarrito;
        }
      }
    })
  }

  selectedItem(nivel: number, idNivel: number) {
    //debugger;
    console.log("nivel:" + nivel + ", id:" + idNivel);
    this.CallCargarResultadosMenu(nivel, idNivel);
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
    //debugger;
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
    //debugger;
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
                this.resultado = "";
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

  CallCargarResultadosMenu(nivel: number, idNivel: number) {
    this.preventAbuse = true;
    debugger;
    this.heroService.getCargarResultadosMenu(nivel, idNivel)
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
                this.resultado = "";
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
    else {
      this.ProductoSEL[0] = item;
      //debugger;
      this.bigImgsrc = this.ProductoSEL[0].cat_imagenes_producto[0].url;
    }
    // this.getProdRelacionados(this.ProductoSEL[0].id);
    if (item.id == 674 || item.id == 675 || item.id == 676 || item.id == 677 || item.id == 678 || item.id == 679 || item.id == 680) {
      this._openHomeProgram(item);
    }
    else if (item.id == 703) {
      this._openCertificados(item);
    }
    else {
      this.getProductosRelacionadosAll(this.ProductoSEL[0].id);
    }
    
  }

  Mostrar_ProdMulti(item: any) {
    //debugger;
    this.lista_car_base = item;
    this.ProdMostrar = item;
    this.Mostrardetalle = true;
    this.Mostrardetalle = false;
    this.MostrarProductos = true;
    this.claseTitular = "input-group col-xs-12"
    this.letreroProductos = this.TextoLibre;
    this.resultado = "";
  }

  Mostrar_Inicio() {
    //this.ProdMostrar = item;
    this.Mostrardetalle = false;
    this.MostrarProductos = true;
    this.claseTitular = "input-group col-xs-12"
    this.letreroProductos = "Productos más comprados";
    this.resultado = "";
    this.AccesoriosMostrar = this.AccesoriosPopulares;
    //this.ConsumiblesMostrar = this.ConsumiblesPopulares;
    //this.ConsumiblesCarrusel[0].Subconsumibles = this.ConsumiblesPopulares;
    this.getAccesoriosCarrusel(this.AccesoriosPopulares);
    this.getConsumiblesCarrusel(this.ConsumiblesPopulares);

    //console.log(this.ConsumiblesCarrusel);
  }

  getProductosRelacionadosAll(id: number) {
    //debugger;
    var creadoobj = { Id: id };
    this.heroService.ServicioPostGeneral_prods("ProductosRelacionadosAll", creadoobj)
      .subscribe((value) => {
        //debugger;
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

              this.getAccesoriosCarrusel(value.productos_all[1]);
              this.getConsumiblesCarrusel(value.productos_all[2]);
              //this.ConsumiblesCarrusel[0].Subconsumibles = value.productos_all[2];
              //console.log(this.ConsumiblesCarrusel);
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

  selImage(url) {
    //alert(url);
    this.bigImgsrc = url;
  }

  _openHomeProgram(item: any): void {
    this.preventAbuse = false
    let dialogHome = this.dialog.open(DialogHomeProgram, {
      width: '750px',
      height: '490px',
      data: { prodsel: item }
    });

    dialogHome.afterClosed().subscribe(result => {
      let agregados = 0;
      debugger;
      if (result != undefined) {
        console.log(result)
        this.GuardarHomeProgram(result.prods, result.lista_sublineas);
        //this.GuardarHomeProgram(result.prods);
      }
      else console.log("cerrado correctamente sin accion");
    });
  }

  GuardarHomeProgram(prod_hom: any[], lista_sl: any[]) {
  //GuardarHomeProgram(prod_hom: any[]) {
    debugger;
    var message = "Producto agregado al carrito.";
    let action = '';
    this.preventAbuse = true;
    //se comenta para enviar el id por el evento
    //this.Id_P = event.srcElement.getAttribute("id") != undefined ? event.srcElement.getAttribute("id") : this.Id_P;
    //this.Id_P = this.Id_P.replace("l", "");

    if (this.idcotiza > 0) {
      this.heroService.AddProductoCotiza(0, 0, prod_hom[0].id, this.idcotiza, this.fecha_creacion, prod_hom[0].id_categoria)
        .subscribe((value) => {
          debugger;
          switch (value.value.response) {
            case "Error":
              console.log("Ocurrio un error al guardar el producto");
              break;
            default:
              if (value.value.response == "Success") {
                
                if (prod_hom.length == 2) {
                  //agrega segundo registro de home program si existe

                  this.heroService.AddProductoCotiza(0, 0, prod_hom[1].id, this.idcotiza, this.fecha_creacion, prod_hom[1].id_categoria)
                    .subscribe((value) => {
                      switch (value.value.response) {
                        case "Error":
                          console.log("Ocurrio un error al guardar el producto");
                          break;
                        default:
                          if (value.value.response == "Success") {
                            message = message.replace("al carrito", "a la cotizacion");
                            this.AddcarritoOk = true;
                          }
                      }
                    });
                }
                else {
                  message = message.replace("al carrito", "a la cotizacion");
                  this.AddcarritoOk = true;
                }
              }
          }
        });
    }
    else {
      this.heroService.AddProductoCarrito(0, 0, prod_hom[0].id, this.id_usuario, this.fecha_creacion, prod_hom[0].id_categoria)
        .subscribe((value) => {
          //debugger;
          switch (value.value.response) {
            case "Error":
              break;
            default:
              if (value.value.response == "Success") {
                let obj = { cotizacion_id: 0, id_usuario: this.id_usuario, lista_sublineas: lista_sl };
                //debugger;
                //agrega segundo home program al carrito si existe
                if (prod_hom.length == 2) {
                  
                  this.heroService.AddProductoCarrito(0, 0, prod_hom[1].id, this.id_usuario, this.fecha_creacion, prod_hom[1].id_categoria)
                    .subscribe((value) => {
                      debugger;
                      switch (value.value.response) {
                        case "Error":
                          break;
                        default:
                          if (value.value.response == "Success") {
                            this.heroService.ServicioPostGeneral("save_homep_sublineas", obj).subscribe(response => {
                              if (response.result == "Success") {
                                console.log("sublineas guardadas");
                              }
                              else console.log("error al guardar sublineas");
                            });
                            this.AddcarritoOk = true;
                            this.ActualizarCarrito();
                          }
                      }
                    });
                }
                else {
                  this.heroService.ServicioPostGeneral("save_homep_sublineas", obj).subscribe(response => {
                    if (response.result == "Success") {
                      console.log("sublineas guardadas");
                    }
                    else console.log("error al guardar sublineas");
                  });
                  this.AddcarritoOk = true;
                  this.ActualizarCarrito();
                }
              }
             
          }
        });
    }

    this.preventAbuse = false;

    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });
  }



  _openCertificados(item: any): void {
    this.preventAbuse = false
    let dialogCertificados = this.dialog.open(DialogCertificados, {
      width: '950px',
      height: '530px',
      data: { prodsel: item, id_cotiza: this.idcotiza, id_usuario: this.id_usuario }
    });

    dialogCertificados.afterClosed().subscribe(result => {
      if (result != undefined) {
        console.log(result)
        debugger;
        this.ActualizarCarrito();
        if (this.idcotiza > 0) {
          this.msjDialog("Productos agregados correctamente a la cotizacion");
        }
        else
          this.msjDialog("Productos agregados correctamente al carrito");

      }
      else console.log("cerrado correctamente sin accion");
    });
  }

  msjDialog(message: string, action = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
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
              debugger;
            }
        }
      });
  }

  getCargarAccesoriosPopulares() {
    alert('funcion ocupada');
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

    var creadoobj = { Id: 0 };
    this.heroService.ServicioPostGeneral_prods("ProductosPopularesAll", creadoobj)
      .subscribe((value) => {
        switch (value.token) {
          case "Error":
            this.validar = true;
            break;
          default:
            if (value.token == "Success") {
              //debugger;
              this.lista_car_base = value.productos_all[3];
              this.ProdMostrar = value.productos_all[0];
              this.AccesoriosMostrar = value.productos_all[1];
              this.ConsumiblesMostrar = value.productos_all[2];
              this.ConsumiblesPopulares = this.ConsumiblesMostrar;
              this.AccesoriosPopulares = this.AccesoriosMostrar;
              //debugger;
              //this.ConsumiblesCarrusel[0].Subconsumibles = value.productos_all[2];
              //console.log(this.ConsumiblesCarrusel);
              this.getAccesoriosCarrusel(value.productos_all[1]);
              this.getConsumiblesCarrusel(value.productos_all[2]);
            }
        }
      });

  }


  getAccesoriosCarrusel(lista_completa: any[]) {
    debugger;
    this.AccesoriosCarrusel.splice(0, this.AccesoriosCarrusel.length);
    for (var i = 0; i < lista_completa.length; i++) {
      var max = (i + 4 > lista_completa.length) ? lista_completa.length - i : 4;
      var subi = lista_completa.slice(i, i + max)
      if (i + max >= lista_completa.length) i = lista_completa.length;
      else i += max - 1;
      this.AccesoriosCarrusel.push({ SubAccesorios: subi });
      console.log(this.AccesoriosCarrusel);
    }
  }

  getConsumiblesCarrusel(lista_completa: any[]) {
    //debugger;
    this.ConsumiblesCarrusel.splice(0, this.ConsumiblesCarrusel.length);
    for (var i = 0; i < lista_completa.length; i++) {
      var max = (i + 4 > lista_completa.length) ? lista_completa.length - i : 4;
      var subi = lista_completa.slice(i, i + max)
      if (i + max >= lista_completa.length) i = lista_completa.length;
      else i += max - 1; 
      this.ConsumiblesCarrusel.push({ Subconsumibles: subi });
      //console.log(this.ConsumiblesCarrusel);
    }

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

  openSnackBar(id_prod: number, cantidad: number) {
    debugger;
    var message = "Producto agregado al carrito.";
    let action = '';
    this.preventAbuse = true;
    //se comenta para enviar el id por el evento
    //this.Id_P = event.srcElement.getAttribute("id") != undefined ? event.srcElement.getAttribute("id") : this.Id_P;
    //this.Id_P = this.Id_P.replace("l", "");

    if (this.idcotiza > 0) {
      message = message.replace("al carrito", "a la cotizacion");
      this.heroService.AddProductoCotiza(0, 0, id_prod, this.idcotiza, this.fecha_creacion, cantidad)
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
    }
    else {
      this.heroService.AddProductoCarrito(0, 0, id_prod, this.id_usuario, this.fecha_creacion, cantidad)
        .subscribe((value) => {
          switch (value.value.response) {
            case "Error":
              break;
            default:
              if (value.value.response == "Success") {
                this.AddcarritoOk = true;
                this.ActualizarCarrito();
              }
          }
        });
    }
    this.preventAbuse = false;

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
//@Component({
//  selector: 'snack-bar-component-example-snack',
//  templateUrl: 'snack-bar-component-example-snack.html',
//  styles: [`.example-pizza-party { color: hotpink; }`],
//})

//export class PizzaPartyComponent { }


//DIALOG HOME PROGRAM

@Component({
  selector: 'dialog-home-program',
  templateUrl: 'dialog-home-program.html',
})



export class DialogHomeProgram {
  sublineas: linea[] = [];
  lineasSel: number = 0;
  hrs_sublinea: number = 0;
  lista_sl: any[] = [];
  prodrel = new Articulo();
  desc_home: string;
  newprods: Articulo[] = [];

  cer_prod: any = { cp: '', cotizacion_id: this.data.id_cotiza, id_usuario: this.data.id_usuario, lista_sublineas: this.lista_sl, lst_prods: this.newprods };
  constructor(private heroService: DatosService, private productService: ProductsService,
    public homeProgram: MatDialogRef<DialogHomeProgram>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  NoSolEntClick(): void {
    this.homeProgram.close();
  }

  SolEntregaRefClick(): void {
    this.data.prodsel.id_categoria = 1;
    this.newprods.push(this.data.prodsel);
    if (this.lineasSel > 2) {
      this.prodrel.id_categoria = this.lineasSel - 2;
      this.newprods.push(this.prodrel);
      //for (var i = 0; i < this.lineasSel - 2 ; i++) {
      //  newprods.push(this.prodrel);
      //}

    }
    let newp_home: any = { prods: this.newprods, lista_sublineas: this.lista_sl };
    this.homeProgram.close(newp_home);
  }

  ngOnInit() {
    this.getsublineas();
    this.getServiciosRelacionados(this.data.prodsel.id);
    this.desc_home = this.data.prodsel.descripcion_larga;
    this.desc_home = this.desc_home.replace("</ul>", "");

  }

  selectedLine(e: any, sl: any) {
    debugger;
    if (e.target.checked) {
      this.lineasSel += 1;
      this.hrs_sublinea += sl.hrs;
      this.lista_sl.push({ id: sl.id, cantidad: sl.hrs});
    }
    else {
      this.lineasSel -= 1;
      this.hrs_sublinea -= sl.hrs;
      this.lista_sl = this.lista_sl.filter(a => a.id != sl.id);
    }
    console.log(this.hrs_sublinea);
    
  }

  GuardarHomeSublineas(): void {
    this.data.prodsel.id_categoria = 1;
    this.newprods.push(this.data.prodsel);
    if (this.lineasSel > 2) {
      this.prodrel.id_categoria = this.lineasSel - 2;
      this.newprods.push(this.prodrel);
    }

    //this.productService.saveProductosHomeSL(this.cer_prod).subscribe(response => {
    //  if (response != undefined) {
    //    if (response.token == "Success") {
    //      this.homeProgram.close(this.cer_prod);
    //    }
    //  }
    //  else
    //    //this.msjDialog(response.detalle);
    //})
  }

  getsublineas() {

    this.productService.getSubLineasHomeProgram().subscribe(res => {
      if (res != undefined) {
        if (res.token == "Success") {
          console.log(res);
          this.sublineas = res.item;
          
        }
      }
    });
    //console.log(this.data.prodsel);
  }

  getServiciosRelacionados(id: number) {
    //debugger;
    var creadoobj = { Id: id };
    this.heroService.ServicioPostGeneral_prods("ServiciosRelacionados", creadoobj)
      .subscribe((value) => {
        //debugger;
        if (value.productos_all != undefined) {
          console.log(value.productos_all);
          this.prodrel = value.productos_all[0];
        }
      });
  }

}



//DIALOG CERTIFICADOS DE MANTENIMIENTOS

@Component({
  selector: 'dialog-certificados-partners',
  templateUrl: 'dialog-certificados-partners.html',
})

export class DialogCertificados {
  sublineas: any[] = [];
  lineas: any[] = [];
  lineasSel: number = 0;
  prodrel = new Articulo();
  public maskcp = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  cer_prod: any = { cp: '', cotizacion_id: this.data.id_cotiza, id_usuario: this.data.id_usuario, lista_sublineas: this.sublineas };
  lista_detalle: any = { certificados_: [], certificados: [], costo_labor: 0, costo_consumibles: 0, costo_viaticos: 0 };
  habilita: boolean = false;
  msjError: string = "";
  localidad: string = "";

  constructor(private heroService: DatosService, private productService: ProductsService,
    public certificadosD: MatDialogRef<DialogCertificados>, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  NoSolEntClick(): void {
    this.certificadosD.close();
  }

  GuardarCertificados(): void {
    this.productService.saveProductosCertificado(this.cer_prod).subscribe(response => {
      if (response != undefined) {
        if (response.token == "Success") {
          this.certificadosD.close(this.cer_prod);
        }
      }
      else
        this.msjDialog(response.detalle);
    })
  }

  ngOnInit() {
    this.getsublineas();
    
  }

  ActualizaCostos() {
    this.habilita = true;
    debugger;
    if (this.sublineas.length > 0 && this.cer_prod.cp.length == 5) {
      this.lineas = this.sublineas.filter(sl => sl.cantidad > 0);
      if (this.lineas.length > 0) {
        this.cer_prod.lista_sublineas = this.lineas;
        this.obtenerProds(this.cer_prod);

      }
      else {
        this.msjDialog("Seleccione una sublinea");
        this.localidad = "Seleccione una sublinea";
        this.lista_detalle.certificados_ = [];
        this.lista_detalle.costo_viaticos = -1;
        this.lista_detalle.costo_labor = 0;
        this.lista_detalle.costo_consumibles = 0;
        this.habilita = false;
      }
    }
  }

  cambioCP(e: any) {
    if (this.cer_prod.cp.length == 5) {
      this.habilita = false;
      let lineas = this.sublineas.filter(sl => sl.cantidad > 0);
      if (lineas.length > 0) {
        this.obtenerProds(this.cer_prod);
      }
    }
    else {
      this.habilita = true;
    }
  }

  obtenerProds(obj: any) {
    this.productService.getProductosCertificado(obj).subscribe((response) => {
      if (response != undefined) {

        if (response.token == "Success") {
          //console.log(response);
          this.lista_detalle = response;
          this.habilita = false;
          this.localidad = response.localidad;
          if (this.lista_detalle.costo_viaticos < 0) {
            this.msjDialog("Codigo Postal no valido");
          }
        }
      }
    });
  }

  getsublineas() {

    this.productService.getSubLineasCertificados(0).subscribe(res => {
      if (res != undefined) {
        if (res.token == "Success") {
          this.sublineas = res.item;
        }
      }
    });
  }

  msjDialog(message: string, action = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      extraClasses: ['blue-snackbar']
    });
  }


}


//export interface PeriodicElement {
//  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
//}
