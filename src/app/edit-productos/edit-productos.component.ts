import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Inject } from '@angular/core';
import { DatosService } from '../datos.service';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { producto, linea, categoria, subLinea, productos_relacionados, productoBase } from '../models/producto';
import { Utils } from '../utils/utils';
import { ProductsService } from '../services/products.service';
import { EditProductLineComponent } from './edit-linea/edit-linea.component';
import { EditProductSublineComponent } from './edit-sublinea/edit-sublinea.component';
import { ImageDetailComponent } from './image-detail/image-detail.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-edit-productos',
  templateUrl: './edit-productos.component.html',
  styleUrls: ['./edit-productos.component.css']
})
export class EditProductosComponent implements OnInit {
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  tipos: number = 0;
  tipos_entidades: any[] = [{ "id": 0, "tipo": "Todas" }, { "id": 1, "tipo": "Canales" }, { "id": 2, "tipo": "Cuentas" }, { "id": 3, "tipo": "Sucursales" }];
  TextoLibre: string = "";

  comision: number = 0;
  valorgral_cc: number = 0;

  public productID: number = 0;
  public prod = new producto();
  public relacionados: productos_relacionados[] = [];
  public listaProductos: productoBase[] = [];
  public lines: linea[] = [];
  public subLines: linea[] = [];
  public categories: categoria[] = [];
  public car_base: linea[] = [];
  public newImages: any[] = [];
  public newFiles: any[] = [];
  public types: any[] = [{ id: 1, descripcion: 'Producto' },
  { id: 2, descripcion: 'Accesorio' },
  { id: 3, descripcion: 'Consumible' },
  { id: 4, descripcion: 'No instalable' }]
  user_session: any;
  permisos_edicion: boolean = false;

  // tabla entidades
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  displayedColumns = ['id', 'tipo', 'canal', 'cuenta', 'entidad'];
  @ViewChild('paginator') paginator: MatPaginator

  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  constructor(private route: ActivatedRoute,
    private dataService: DatosService,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public matDatepicker: MatDatepickerModule,
    private productsService: ProductsService,
    public overlay: Overlay
  ) { }

  validar_permisos() {
    if (this.user_session.rol == 10006)
      this.permisos_edicion = true;
  }


  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.user_session = JSON.parse(localStorage.getItem("user"));
      let s = this.route.params.subscribe(params => { this.productID = +params['id']; });
      this.aplicar_estilos();
      this.getAllProducts();
      this.getLines();
      this.getCategories();
      this.validar_permisos();
    }
  }

  getProduct() {
    
    var creadoobj = { TextoLibre: "", tipo_entidad: this.tipos };
    let sub = this.route.params.subscribe(params => { this.prod.id = + params['id']; });

    if (this.prod.id > 0) {
      let busqueda = { id: this.prod.id }
      debugger;
      this.dataService.getProducts(busqueda).subscribe((p) => {
        debugger;
        if (p != undefined) {
          this.prod.id = Utils.getValue(p.id, 0);
          this.prod.nombre = Utils.getValue(p.nombre, '');
          this.prod.sku = Utils.getValue(p.sku, '');
          this.prod.atributos = Utils.getValue(p.atributos, '');
          this.prod.imagenes = Utils.getValue(p.cat_imagenes_producto, []);
          // this.prod.categoria = Utils.getValue(p.categoria.id, 1);
          this.prod.categoria = 1;
          this.prod.descripcion = Utils.getValue(p.descripcion_corta, '');
          this.prod.descripcionLarga = Utils.getValue(p.descripcion_larga, '');
          this.prod.status = Utils.getValue(p.status, true);
          this.prod.lienaID = Utils.getValue(p.linea.id, 0);
          this.prod.subLineaID = Utils.getValue(p.id_sublinea, 0);
          this.prod.caracteristicaBId = Utils.getValue(p.id_caracteristica_base, 0);
          this.prod.modelo = Utils.getValue(p.modelo, '');
          this.prod.precioIVA = Utils.getValue(p.precio_con_iva, 0);
          this.prod.precio = Utils.getValue(p.precio_sin_iva, 0);
          this.prod.precioHora = Utils.getValue(p.precio_hora, 0);
          this.prod.instalacion = Utils.getValue(p.requiere_instalacion, false);
          this.prod.tipoID = Utils.getValue(p.tipo, 0);
          this.prod.guiaURL = Utils.getValue(p.url_guia, '');
          this.prod.manualURL = Utils.getValue(p.url_manual, '');
          this.prod.impresionURL = Utils.getValue(p.url_impresion, '');
          this.prod.visiblePartners = Utils.getValue(p.visible_partners, true);
          this.prod.tipoID = Utils.getValue(p.tipo, 0);
          this.relacionados = p.relacionados;
          this.relacionados.forEach(item => {
            var pr = this.listaProductos.find(p => p.id == item.id_producto_2);
            if (pr != undefined) {
              item.nombre = pr.nombre;
              item.sku = pr.sku;
              item.categoria = pr.categoria;
              item.linea = pr.linea;
              item.sublinea = pr.sublinea;
            }
          });

          //console.log(p.relacionados);
          if (this.prod.lienaID != 0) {
            //console.log('sublinea', this.prod.subLineaID);
            this.getSubLineas(this.prod.lienaID);
          }


        } else {
          console.log("Cliente - Ocurrio un error al cargar promocion: " + p.detalle);
        }

      });
    }
  }

  Elimina_img(img) {
    debugger;
    let imgId = img.id;
    let dialogRef_ = this.dialog.open(DialogDelImage, {
      width: '450px',
      height: '300px',
    });
    dialogRef_.afterClosed().subscribe(result => {
      //console.log(result);
      if (result != undefined) {
        this.dataService.delProductsImage(this.prod.id, img.id).subscribe(result => {
          debugger;
          if (result.success == true) {
            this.prod.imagenes = result.dto;
          }
        });

      }
    });

  }

  getAllProducts() {
    // debugger;
    //var creadoobj = { TextoLibre: "", tipo_entidad: this.tipos };

    this.productsService.getProducts("").subscribe((r) => {
      this.listaProductos = r;
      //debugger;
      //console.log(this.listaProductos);
      this.getProduct();
    });
  }

  /**
   * Saves the new product or updated
   * @return boolean true or false
   */

  calculaIVA() {
    debugger;
    let iva: number = this.prod.precio * 1.16;
    this.prod.precioIVA = (Math.round(this.prod.precio * 1.16 * 100) / 100);
  }

  saveChanges(redirect?: boolean) {
    debugger;
    redirect = Utils.getValue(redirect, true);
    if (this.productID === 0) {
      this.productsService.saveProduct(this.prod, this.relacionados).subscribe((r) => {
        if (!Utils.isEmpty(r) && Utils.isDefined(r.id)) {

          if (redirect)
            this.router.navigate(['/productos']);
        }
      });
    } else {
      
      this.productsService.updateProduct(this.prod, this.relacionados).subscribe((r) => {
        if (!Utils.isEmpty(r) && Utils.isDefined(r.id)) {
          if (redirect)
            this.router.navigate(['/productos']);
          return true;
        } else {
          return false;
        }
      });
    }

  }

  /**
   * Get product lines
   * @return an array with the lines
   */
  getLines(id?: number) {

    this.productsService.getLines().subscribe((l) => {
      if (!Utils.isEmpty(l)) {
        this.lines = l;
        this.prod.lienaID = Utils.getValue(id, this.prod.lienaID);
        this.getSubLineas(this.prod.lienaID);
      } else {
        this.prod.lienaID = 0;
        this.subLines = [];
        //this.prod.subLineaID =0;
      }
    })

  }

  /**
   * Get product sublines by Line ID
   * @param id 
   */

  getSubLineas(id, slid?) {

    this.productsService.getSubLines(id).subscribe((sl) => {
      if (!Utils.isEmpty(sl)) {
        //console.log(sl);
        this.subLines = sl;
        this.prod.subLineaID = Utils.getValue(slid, this.prod.subLineaID);
        this.get_car_base();
        //console.log(this.prod.subLineaID );
      } else {
        //this.prod.subLineaID =0;
        this.subLines = [];
      }
    })
  }

  get_car_base() {

    this.productsService.get_car_base().subscribe((cb) => {
      if (!Utils.isEmpty(cb)) {
        debugger;
        console.log(cb);
        this.car_base = cb.item;
        //this.prod.subLineaID = Utils.getValue(slid, this.prod.subLineaID);
        //console.log(this.prod.subLineaID );
      } else {
        //this.prod.subLineaID =0;
        this.car_base = [];
      }
    })
  }
  /**
   * Get product sublines by Line ID
   * @param id 
   */

  getCategories() {
    this.productsService.getCategories().subscribe((cat) => {
      if (!Utils.isEmpty(cat)) {
        this.categories = cat;
      } else {
        this.categories = [];
        console.error('Error getting product sublines')
      }
    })
  }

  /**
   * Function that is called when the Line input changes
   * @param lineID
   */
  lineChange(lineID) {
    if (!Utils.isEmpty(lineID)) {
      this.getSubLineas(lineID);
    }
  }

  /**
   * Function that opens the AddLine modal
   */

  addLine(): void {
    const dialogRef = this.dialog.open(EditProductLineComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (Utils.isDefined(result) && result.status == 'sent' && result.id != 0) {
        this.getLines(result.id);

      }
    });
  }

  /**
   * Function that opens the AddSubLine modal
   */

  addSubLine(): void {
    const dialogRef = this.dialog.open(EditProductSublineComponent, {
      width: '600px',
      data: this.prod.lienaID
    });

    dialogRef.afterClosed().subscribe(result => {

      if (Utils.isDefined(result) && result.status == 'sent' && result.lineaID != 0 && result.id != 0) {
        this.prod.lienaID = result.lineaID;
        this.getSubLineas(this.prod.lienaID, result.id);
      }
    });
  }



  /**
   * Function that checks and prepare the images to upload 
   */

  prepareImages(e) {
    if (Utils.isDefined(e.srcElement.files)) {
      for (let f of e.srcElement.files) {
        this.newImages.push(f);
      }
    }
  }
  /**
   * Function that checks and prepare the images to upload 
   */

  prepareFile(e) {
    if (Utils.isDefined(e.srcElement.files)) {
      for (let f of e.srcElement.files) {
        let accpetedTypes = ['application/msword',
          'application/vnd.ms-excel',
          'application/vnd.ms-powerpoint',
          'text/plain',
          'application/pdf',
          'image/*',
          'image/png',
          'image/jpg',
          'image/jpeg']

        if (accpetedTypes.indexOf(f.type) != -1) {
          this.newFiles.push(f);
        }
      }
    }
  }



  /**
   * Function that checks and prepare the images to upload 
   */

  addImages() {
    let url: string = '';
    if (!Utils.isEmpty(this.newImages)) {
      for (let f of this.newImages) {
        this.dataService.upload(f).subscribe((r) => {
          if (Utils.isDefined(r)) {
            url = <string>r.response;
            debugger;
            //url = url.replace('/Imagenes',this.dataService.getURL() + '/mieletickets/');
            //url = this.dataService.getURL() + "mieletickets/" + url;
            url = r.response;
            this.prod.imagenes.push({ url: url, estatus: true });
            if (this.prod.id !== 0)
              this.saveChanges(false);

            this.newImages = [];
          }
        })
      }
    }
  }

  /**
   * Function that upload a file 
   */

  uploadFile(type) {
    let url: string = '';
    if (!Utils.isEmpty(this.newFiles)) {
      for (let f of this.newFiles) {
        debugger;
        this.dataService.upload(f).subscribe((r) => {
          if (Utils.isDefined(r)) {
            url = <string>r.response;
            //url = url.replace('/Imagenes',this.dataService.getURL() + '/mieletickets/');
            //url = this.dataService.getURL() + "mieletickets/" + url;
            url = r.response;
            //url = this.dataService.getURL() + r.response;
            this.prod[type] = url;

            if (this.prod.id !== 0)
              this.saveChanges(false);

            this.newFiles = [];
          }
        })
      }
    }
  }
  /*** 
   * Clear a given option from the prod object
   * 
   *  */
  clearOption(field) {
    if (Utils.isDefined(field) && Utils.isDefined(this.prod[field])) {
      this.prod[field] = '';
    }
  }

  /**
   * Function that checks and prepare the images to upload 
   */

  openImage(src, id) {
    let imageDOM = <HTMLImageElement>document.getElementById(id);
    let width = 600;
    if (Utils.isDefined(imageDOM)) {
      width = imageDOM.naturalWidth;
    }
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = width + 'px';
    dialogConfig.data = { src: src }
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();

    let dialogRef = this.dialog.open(ImageDetailComponent, dialogConfig);

    return false;
  }

  goBack() {
    this.router.navigate(['/productos']);
  }


  eliminaRelacionado(id: number) {
    //const i = this.listaProductos.indexOf(id_producto, 0);
    //console.log(this.relacionados.length);
    this.relacionados = this.relacionados.filter(p => p.id_producto_2 != id);
    //console.log(this.relacionados.length);
  }

  nuevoRelacionado(): void {
    this.openRelacionadosDialog();
  }

  openRelacionadosDialog() {
    //console.log(categoria);
    let dialogRef_ = this.dialog.open(DialogRelacionados, {
      width: '850px',
      height: '350px',
      //data: {
      //  id: categoria.id,
      //  no_tecnicos: categoria.no_tecnicos,
      //  horas_tecnicos: categoria.horas_tecnicos,
      //  precio_visita: categoria.precio_visita,
      //  precio_hora_tecnico: categoria.precio_hora_tecnico,
      //  id_tipo_servicio: categoria.id_tipo_servicio,
      //  estatus: categoria.estatus
      //}
    });
    dialogRef_.afterClosed().subscribe(result => {
      //console.log(result);
      if (result != undefined) {
        var np = this.listaProductos.find(p => p.id == result);
        if (np != null) {
          var nuevo = new productos_relacionados();
          nuevo.id_producto = this.prod.id;
          nuevo.id_producto_2 = np.id;
          nuevo.nombre = np.nombre;
          nuevo.sku = np.sku;
          nuevo.linea = np.linea;
          nuevo.sublinea = np.sublinea;
          nuevo.categoria = np.categoria;
          this.relacionados.push(nuevo);
        }
      }
      //var catModificada = this.productsService.ecategoria;
      //if (catModificada != null) {
      //  //console.log(catModificada);
      //  //agregar a lista
      //  //catModificada.servicio = this.tipos.find(t => t.id == catModificada.id_tipo_servicio).desc_tipo_servicio;
      //  //this.categorias.push(catModificada);

      //}
      //else
      //  console.log('Pop Up Categorias cerrado');
      //this.CallgetCotizaciones(null);
    });
  }




}

export interface PeriodicElement {
  tipo: string; descripcion: string; cantidad: number; acciones: string; id_producto: string
}

var ELEMENT_DATA_PROD_REGALO: any[] = [
];




@Component({
  selector: 'dialog-relacionado',
  templateUrl: 'dialog-relacionado.html',
})
export class DialogRelacionados {
  //punto1
  public articulos: productoBase[] = [];
  public filtroarticulos: productoBase[] = [];
  private _txBusqueda: string;
  get onFiltering(): string {
    return this._txBusqueda;
  }
  set onFiltering(value: string) {
    this._txBusqueda = value;
    if (value.length > 2) {
      this.filtroarticulos = this.filtroProductos(value);
    }
    else {
      this.filtroarticulos = null;
    }
  }


  public GuardarSolcitar(esvalido: boolean) {
    this.dialogRef.close();
    //if (esvalido) {
    //  this.productsService.ecategoria = this.ecategoria;
    //  this.dialogRef.close();

    //}
  }


  ngOnInit() {
    //var editaCategoria = { Id: this.data.id, no_tecnicos: this.data.no_tecnicos, horas_tecnicos: this.data.horas_tecnicos, precio_visita: this.data.precio_visita };

    this.getAllProducts();
    //this.productsService.ecategoria = null;
  }


  constructor(private heroService: DatosService, private productsService: ProductsService, private router: Router, public dialogRef: MatDialogRef<DialogRelacionados>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();

  }

  getAllProducts() {
    // debugger;
    //var creadoobj = { TextoLibre: "", tipo_entidad: this.tipos };

    this.productsService.getProducts("").subscribe((r) => {
      this.articulos = r;
      //console.log(this.articulos);
    });
  }

  filtroProductos(busqueda: string) {
    return this.articulos.filter(prod => prod.nombre.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1
      || prod.sku.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1
      || prod.categoria.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1
      || prod.linea.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1
      || prod.sublinea.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1)
  }


  agregarProducto(articulo: productoBase) {
    this.dialogRef.close(articulo.id);
    //alert("agregar nuevo producto relacionado" + articulo.nombre);
  }
}




@Component({
  selector: 'dialog-elimina',
  templateUrl: 'dialog-elimina-imagen.html',
})
export class DialogDelImage {
  //punto1

  constructor(private heroService: DatosService, private productsService: ProductsService, private router: Router, public dialogRef: MatDialogRef<DialogDelImage>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();

  }


  ConfirmaEliminar(): void {
    let confirma: boolean = true;
    this.dialogRef.close(confirma);

  }


 

}
