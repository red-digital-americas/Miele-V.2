import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { Articulo } from '../models/buscarproductos.modelo';
import { ProductsService } from '../services/products.service';
import { Productos } from '../models/login';
import { Cotizaciones } from '../models/cotizacion';

@Component({
  selector: 'app-carshop',
  templateUrl: './carshop.component.html',
  styleUrls: ['./carshop.component.css']
})
export class CarshopComponent implements OnInit {



  ////////////////VARIABLES  /////////////////////

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  //displayedColumns = ['imagen', 'sku', 'modelo', 'nombre', 'desccorta', 'cantidad', 'precio_con_iva', 'descuento', 'importetotal'];
  displayedColumns = ['imagen', 'sku', 'modelo', 'nombre', 'desccorta', 'cantidad', 'importe_precio_lista', 'importe_total_bruto', 'descuento', 'importetotal'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  preventAbuse = false;
  Id_Cotiza: string = "";
  montocotiza: number = 0;
  montocotizasub: number = 0;
  montocotizaiva: number = 0;
  creadopor: string = "0";
  rol_user: string = "0";
  Productos: any[] = [];
  animal: string;
  name: string;
  lineas_cert: any[] = [];
  Promociones_disponibles: any[] = [];
  cotizacion = new Cotizaciones();

  // montos
  importe_precio_lista: number = 0;
  iva_precio_lista: number = 0;
  importe_condiciones_com: number = 0;
  iva_condiciones_com: number = 0;
  importe_promociones: number = 0;
  iva_promociones: number = 0;
  descuento_acumulado: number = 0;
  descuento_acumulado_cond_com: number = 0;
  comision_vendedor: number = 0;

  id_usuario: string = "";
  fecha_creacion: string = "01/01/1900";
  homeProgram: boolean = false;
  Certificados: boolean = false;
  muestra_btn_addHP: boolean = true;

  hp_sublineas: any[] = [];

  constructor(private route: ActivatedRoute, private heroService: DatosService, private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, public matDatepicker: MatDatepickerModule) { }

  set_productos(event, row, index) {
    var Id_Ctrl = event.srcElement.getAttribute("id")
    Id_Ctrl = Id_Ctrl.replace("cant_", "");
    var Val_Ctrl = event.srcElement.value;
    Val_Ctrl = Val_Ctrl == "" ? 1 : Val_Ctrl;
    this.ActualizaCantCarritoProd(Id_Ctrl, Val_Ctrl, this.creadopor);
  };

  del_productos(event, row, index) {
    debugger;
    var Id_Ctrl = event.srcElement.getAttribute("id")
    Id_Ctrl = Id_Ctrl.replace("del_", "");
    var Val_Ctrl = -1;
    this.ActualizaCantCarritoProd(Id_Ctrl, Val_Ctrl, this.creadopor);
  };


  ActualizaCantCarritoProd(Id, cantidad, id_cotiza) {
    console.log("ID: " + Id)
    console.log("cantidad: " + cantidad)
    console.log("id_cotiza: " + id_cotiza)
    this.heroService.ActualizaCantCarritoProd(Id, cantidad, id_cotiza)
      .subscribe((value) => {
        switch (value.response) {
          case "Error":
            console.log("Ocurrio un error al editar la cantidad del producto : " + Id);
            break;
          default:
            if (value.response == "Success") {
              this.Productos = value.item[0].productos;
              ELEMENT_DATA = value.item[0].productos;
              debugger;
              // montos
              this.importe_precio_lista = value.item[0].importe_precio_lista;
              this.iva_precio_lista = value.item[0].iva_precio_lista
              this.importe_condiciones_com = value.item[0].importe_condiciones_com;
              this.iva_condiciones_com = value.item[0].iva_condiciones_com;
              this.importe_promociones = value.item[0].importe_promociones;
              this.iva_promociones = value.item[0].iva_promociones;
              this.descuento_acumulado = value.item[0].descuento_acumulado;
              this.descuento_acumulado_cond_com = value.item[0].descuento_acumulado_cond_com;
              this.comision_vendedor = value.item[0].comision_vendedor;

              this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
              this.Promociones_disponibles = value.item[0].promociones_respueta;
              this.cotizacion.Estatus = value.item[0].estatus;
              this.hp_sublineas = value.hp_sublineas;
              if (value.item[0].tiene_home < 1)
                this.homeProgram = false;
              else {
                this.homeProgram = true;
                this.muestra_btn_addHP = (value.item[0].tiene_home > 1 ? false : true);
              }
              this.ActualizarCarrito();
            }
        }
      });
  }



  ngOnInit() {

    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.id_usuario = JSON.parse(localStorage.getItem("user")).id;
      this.fecha_creacion = moment().format("MM/DD/YYYY");
      this.body.classList.add('skin-blue');
      this.body.classList.add('sidebar-mini');
      this.creadopor = JSON.parse(localStorage.getItem("user")).id;
      this.rol_user = JSON.parse(localStorage.getItem("user")).rol;
      this.GetProductosCarrito(true);
    }
  }

  GotoAddProds() {
    debugger;
    this.router.navigate(['/cargarproductos/0']);
  }

  regresar() {
    debugger;
    console.log(window.history)
    //window.history.back();

  }

  ToCreate() {
    this.router.navigate(['/cotizacion']);
  }

  ActualizarCarrito() {
    this.heroService.getNumProdCarrito(this.creadopor)
      .subscribe((value) => {
        switch (value.token) {
          case "Error":
            console.log("Ocurrio un error al cargar el numero de Productos del carrito");
            break;
          default:
            if (value.token == "Success") {
              if (value.item[0]) {
                if (value.item[0].nprod) {
                  // this.NoProdCarrito = value.item[0].nprod;
                  this.heroService.NPCarrito = value.item[0].nprod;
                }
              }
            }
        }
      });

  }

  GetProductosCarrito(muestra_pp: boolean) {
    this.heroService.GetProductosCarrito(this.creadopor)
      .subscribe((value) => {
        switch (value.token) {

          case "Error":
            console.log("Ocurrio un error al cargar los Productos");
            break;
          default:
            if (value.token == "Success") {

              this.Productos = value.item[0].productos;
              ELEMENT_DATA = value.item[0].productos;
              debugger;
              // montos
              this.importe_precio_lista = value.item[0].importe_precio_lista;
              this.iva_precio_lista = value.item[0].iva_precio_lista;
              this.importe_condiciones_com = value.item[0].importe_condiciones_com;
              this.iva_condiciones_com = value.item[0].iva_condiciones_com;
              this.importe_promociones = value.item[0].importe_promociones;
              this.iva_promociones = value.item[0].iva_promociones;
              this.descuento_acumulado = value.item[0].descuento_acumulado;
              this.descuento_acumulado_cond_com = value.item[0].descuento_acumulado_cond_com;
              this.comision_vendedor = value.item[0].comision_vendedor;

              this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
              this.Promociones_disponibles = value.item[0].promociones_respueta;
              this.cotizacion.Id = value.item[0].id;
              this.cotizacion.Estatus = value.item[0].estatus;
              //Borra todos los elementos del arreglo
              this.lineas_cert.splice(0, this.lineas_cert.length);
              this.Productos.forEach(item => {
                
                if (item.id != 388 && item.id_linea != 36 && item.id_linea != 38 && !item.es_regalo) {
                  var encuentra = this.lineas_cert.findIndex(lc => lc.id == item.id_sublinea);

                  if (encuentra >= 0)
                    this.lineas_cert[encuentra].cantidad += item.cantidad;
                  else
                    this.lineas_cert.push({ id: item.id_sublinea, cantidad: item.cantidad });
                }
              });

              debugger;
              if (value.item[0].tiene_home < 1)
                this.homeProgram = false;
              else {
                this.homeProgram = true;
                this.muestra_btn_addHP = (value.item[0].tiene_home > 1 ? false : true);
              }
              if (value.item[0].faltan_certificados)
                this.Certificados = false;
              else
                this.Certificados = true;
              if ((!this.homeProgram || !this.Certificados) && muestra_pp) {
                this.openCPialog();
                console.log(this.lineas_cert);
              }
            }
        }
      });

  }

 //Funcion que actualiza las promociones seleccionadas
  agregar_quitar_promocion(Id, agregar_quitar) {
    debugger;
    var agregar_quitar_ = 1;
  if (agregar_quitar) // si es positivo quire decir que hay que quitar la promocion 
    agregar_quitar_ = 0;
    
   // var chk_promo =  <HTMLInputElement>document.getElementById(event.source.inputId);
    var AddQuitPromocion = { Id_Cotizacion: this.cotizacion.Id, Id: Id, agregar_quitar: agregar_quitar_ };
    this.heroService.ServicioPostGeneral("agregar_quitar_promocion", AddQuitPromocion)
      .subscribe((value) => {
        debugger;
        switch (value.response) {
          
          case "No es posible agregarla, es incompatible con otra obligatoria":
            this.Promociones_disponibles = value.promos_aplicables;
            this.openSnackBar(value.response);
            break;
          case "Error":
            this.openSnackBar(value.response);
            break;
          default:
            if (value.response == "Success") {
              ELEMENT_DATA = value.prods;
              this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

              this.importe_precio_lista = value.montos[0].importe_precio_lista;
              this.iva_precio_lista = value.montos[0].iva_precio_lista;
              this.importe_condiciones_com = value.montos[0].importe_condiciones_com;
              this.iva_condiciones_com = value.montos[0].iva_condiciones_com;
              this.importe_promociones = value.montos[0].importe_promociones;
              this.iva_promociones = value.montos[0].iva_promociones;
              this.descuento_acumulado = value.montos[0].descuento_acumulado;
              this.descuento_acumulado_cond_com = value.montos[0].descuento_acumulado_cond_com;
              this.Promociones_disponibles = value.promos_aplicables;
              
              this.comision_vendedor = value.montos[0].comision_vendedor;
              this.openSnackBar('Promociónes modificadas');
            }
        }
      });
  }



  // funcion que inserta HP desde el POP UP 
  openSnackBarProducto(message: string, action: string, id: number) {
    this.heroService.AddProductoCarrito(0, 0, id, this.id_usuario, this.fecha_creacion)
      .subscribe((value) => {
        debugger;
        this.preventAbuse = false;
        switch (value.value.response) {
          case "Error":
            break;
          default:
            if (value.value.response == "Success") {
              console.log("home program agregado correctamente");
              this.GetProductosCarrito(false);
              this.ActualizarCarrito();
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

  openSnackBar(message = "Promoción agregada.", action = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']

    });

  }

  AgregarHE(id: number) {
    debugger;
    this.gethorasExtrasHP(id);
  }

  gethorasExtrasHP(id: number) {
    //debugger;
    var creadoobj = { Id: id };
    this.heroService.ServicioPostGeneral_prods("ServiciosRelacionados", creadoobj)
      .subscribe((value) => {
        //debugger;
        if (value.productos_all != undefined) {
          console.log(value.productos_all);
          if (value.productos_all.length > 0) {
            this.openSnackBarProducto("Home Program agregado al carrito.", "", value.productos_all[0].id);
          }
        }
      });
  }

  // funcion que incerta el certificado desde el POP UP 
  openSnackBarCertificado(addSer: number, cp: number, id: number) {
    debugger;
    //addServ puede traer 3 valores, 0 agrega home Program, 1 agrega certificados y dosagrega ambos
    if (addSer == 0) {
      if (!this.homeProgram) {
        this.openSnackBarProducto("Home Program agregado al carrito.", "", id);
      }
    }
    else {
      var parametros = { Id1: cp, Id2: this.id_usuario }
      this.heroService.ServicioPostGeneral_prods("save_productos_certificado_carrito", parametros)
        .subscribe((value) => {
          debugger;
          this.preventAbuse = false;
          switch (value.token) {
            case "Error":
              break;
            default:
              if (value.token == "Success") {
                console.log("certificado agregado correctamente");
                if (addSer == 1) {
                  this.GetProductosCarrito(false);
                  this.ActualizarCarrito();
                }
                else {
                  this.openSnackBarProducto("Home Program agregado al carrito.", "", id);
                }
              }
          }
        });

      this.snackBar.open("Certificados agregados correctamente", '', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
    this.ActualizarCarrito();
  }

  //openDialog(): void {
  //  let dialogRef = this.dialog.open(DialogOverviewExampleDialogD, {
  //    width: '450px',
  //    height: '250px',
  //    data: { name: this.name, animal: this.animal }
  //  });

  //  dialogRef.afterClosed().subscribe(result => {
  //    this.router.navigate(['/buscadorcotizaciones']);
  //  });
  //}


  openCPialog(): void {
    var lista_p: any[] = [];
    console.log(this.lineas_cert);
    var ppAlto = 470 + ((this.homeProgram == false) ? 95 : 0);
    debugger;

    let dialogCPRef = this.dialog.open(DialogEditCP, {
      width: '680px',
      height: ppAlto.toString() + 'px',
      
      data: { cp: '', cert: this.Certificados, home: this.homeProgram, lista: this.lineas_cert, altoVentana: (ppAlto - 180).toString() + 'px' }
    }, );

    dialogCPRef.afterClosed().subscribe(result => {
      debugger;
      if (result != undefined) {
        this.openSnackBarCertificado(result.addSer, result.ncer.cp, result.nhp.id);

      }
      else {
        console.log("Cancelado sin accion")
      }
    });
  }


  openDialogConfirma(): void {
    debugger;

    let dialogConfirm = this.dialog.open(DialogConfirma, {
      width: '400px',
      height: '250px',
      data: { titulo: 'Limpiar carrito', mensaje: '¿Estas seguro de querer vaciar el carrito?' }
    });

    dialogConfirm.afterClosed().subscribe(result => {
      debugger;
      if (result != undefined) {
        //this.openSnackBarCertificado(result.addSer, result.ncer.cp, result.nhp.id);
        this.heroService.NPCarrito = 0;
        this.LimpiarCarrito();

      }
      else {
        console.log("confirmacion cancelada")
      }
    });
  }

  LimpiarCarrito() {
    this.preventAbuse = true;
    var parametros = { usuario: this.creadopor }; 
    this.heroService.ServicioPostGeneral("VaciarCarrito/" + this.creadopor, parametros)
      .subscribe((value) => {
        debugger;
        this.preventAbuse = false;
        if (value.value != undefined) {
          if (value.value.result == "Success") {
            this.openSnackBar("Carrito vacio");
            //this.ActualizarCarrito();
            this.router.navigate(['/cargarproductos/0']);
          }
        }
      });
  }

}



//@Component({
//  selector: 'snack-bar-component-example-snack',
//  templateUrl: 'snack-bar-component-example-snack.html',
//  styles: [`.example-pizza-party { color: hotpink; }`],
//})
//export class PizzaPartyComponent { }

//@Component({
//  selector: 'dialog-overview-example-dialog',
//  templateUrl: 'dialog-overview-example-dialog.html',
//})
//export class DialogOverviewExampleDialogD {

//  constructor(
//    public dialogRef: MatDialogRef<DialogOverviewExampleDialogD>,
//    @Inject(MAT_DIALOG_DATA) public data: any) { }

//  onNoClick(): void {
//    this.dialogRef.close();
//  }

//}


var ELEMENT_DATA: Element[] = [];
var ELEMENT_DATAIMG: Element[] = [];

@Component({
  selector: 'dialog-cp',
  templateUrl: 'dialog-cp.html',
})

export class DialogEditCP {

  private correos: string[] = [];
  hp = new Articulo();
  cod_p: string = "";
  deshabilitaCP: boolean = false;
  public deshabilita: boolean = true;
  sublineas: any[] = [];
  hp_sublineas: any[] = [];
  cer_prod: any = { cp: '', cotizacion_id: this.data.id_cotiza, id_usuario: this.data.id_usuario, lista_sublineas: this.sublineas };
  lista_detalle: any = { certificados_: [], certificados: [], costo_labor: 0, costo_consumibles: 0, costo_viaticos: 0 };
  constructor(private heroService: DatosService, private productService: ProductsService, public snackBar: MatSnackBar, private router: Router, public DialogEditCP: MatDialogRef<DialogEditCP>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    var div = document.getElementById('marco1');
    div.setAttribute("style", "height:" + this.data.altoVentana);
    if (this.data.lista != undefined) {
      this.sublineas = this.data.lista;
    }
    //console.log(this.sublineas);
    if (this.data.cp != undefined) {
      this.cod_p = this.data.cp;
      if (this.cod_p.length == 5) {
        this.deshabilitaCP = true;
      }
      this.getDireccionPorCP(this.data.cp);
    }
  }

  onOmitir(): void {
    //debugger;
    this.DialogEditCP.close();
    //this.router.navigate(['/cargarproductos/0']);
  }

  AgregarServicios(servicios: number): void {
    debugger;
    if (servicios>=0) {
      console.log('click CP carrito');
      //this.hp.modelo = this.cod_p;
      let res = { addSer: servicios, nhp: this.hp, ncer: this.cer_prod }
      this.DialogEditCP.close(res);
    }
  }

  openSnackBarPopup(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']

    });
  }

  ActualizaCP(e: any) {
    if ((e.key === "Enter" || e.key === "Tab")) {
      if (e.target.value.length == 5) {
        this.getDireccionPorCP(e.target.value);
      }
      else {
        this.lista_detalle.certificados_ = [];
        this.deshabilita = true;
      }
    }
  }

  getDireccionPorCP(cod_post: any) {
    debugger;
    if (cod_post.length == 5) {
      if (!this.data.home) {
        var creado = { "TextoLibre": cod_post };
        this.heroService.ServicioPostGeneral_prods("ConsultaHPbyCp", creado)
          .subscribe((value) => {
            debugger;
            switch (value.result) {
              case "Error":
                this.openSnackBarPopup(value.detalle);
                this.deshabilita = true;
                //this.hp.splice(0, this.hp.length);
                this.hp = new Articulo();
                break;
              default:
                if (value.result == "Success") {
                  if (value.item != null) {
                    this.hp = value.item;
                    this.deshabilita = false;
                    console.log(this.hp);
                  }
                  else {
                    this.openSnackBarPopup("No hay concidencias para el código postal capturado");
                  }
                }
            }
          });
      }
      if (this.sublineas.length > 0) {
        this.cer_prod.cp = cod_post;
        this.cer_prod.lista_sublineas = this.sublineas;
        debugger;
        this.productService.getProductosCertificado(this.cer_prod).subscribe(response => {
          debugger;
          if (response != undefined) {

            if (response.token == "Success") {
              //console.log(response);
              if (response.costo_viaticos >= 0) {
                this.lista_detalle = response;
                this.deshabilita = false;
              }
              else {
                this.openSnackBarPopup("Favor de verificar el Código postal");
                this.lista_detalle.certificados_ = [];
                this.deshabilita = true;
              }
            }
          }
        })
      }
      else {
        this.openSnackBarPopup("No hay productos asociados");
        this.DialogEditCP.close();
      }
    }
    else {
      this.deshabilita = true;
    }
  }

}



@Component({
  selector: 'dialog-confirma',
  templateUrl: 'dialog-confirma.html',
})

export class DialogConfirma {

  constructor(private heroService: DatosService, private productService: ProductsService, public snackBar: MatSnackBar, private router: Router, public DialogConfirma: MatDialogRef<DialogConfirma>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    
  }

  onOmitir(): void {
    //debugger;
    this.DialogConfirma.close();
    //this.router.navigate(['/cargarproductos/0']);
  }

  LimpiarCarrito(): void {
    //debugger;
    this.DialogConfirma.close(true);
  }

  openSnackBarPopup(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']

    });
  }

}
