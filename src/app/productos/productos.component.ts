
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProductsService } from '../services/products.service';
import { Utils } from '../utils/utils';
import { linea, categoria } from '../models/producto';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {

  constructor(
    private router: Router,
    private productsService: ProductsService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public matDatepicker: MatDatepickerModule) { }


  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  tipos: number = 0;

  public types: any[] = [{ id: 1, descripcion: 'Producto' },
  { id: 2, descripcion: 'Accesorio' },
  { id: 3, descripcion: 'Consumible' },
  { id: 4, descripcion: 'No instalable' },
  { id: 5, descripcion: 'Servcios' }]


  TextoLibre: string = "";

  // tabla entidades
  public dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  public displayedColumns = ['sku', 'nombre', 'descripcion_corta', 'tipo', 'linea', 'sublinea', 'precio_con_iva'];
  public columNames: Object = { 'sku': 'Sku', 'nombre': 'Nombre', 'categoria': 'Categoría', 'descripcion_corta': "Descripción", 'tipo': 'Tipo', "linea": "Linea", "sublinea": "Sublinea", 'precio_con_iva': 'Precio con IVA' }
  public filters: any = { tipo: 0, lineID: 0, sublineID: 0 };
  public categories: categoria[] = [];
  public lines: linea[] = [];
  public subLines: linea[] = [];
  user_session: any;
  permisos_edicion: boolean = false;

  @ViewChild('paginator') paginator: MatPaginator

  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

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
      this.aplicar_estilos();
      this.get_entidades_busqueda();
      this.getCategories();
      this.getLines();
      this.validar_permisos();
    }

  }

  get_entidades_busqueda(filters?: any) {
    // debugger;
    //var creadoobj = { TextoLibre: "", tipo_entidad: this.tipos };

    this.productsService.getAllProducts(filters).subscribe((r) => {
      debugger;
      ELEMENT_DATA_PROD_REGALO = r;
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
      this.dataSource.paginator = this.paginator;

      /*switch (r.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + r.detalle);
          break;
        default:
          if (r.result == "Success") {
            ELEMENT_DATA_PROD_REGALO = r.item;
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
            console.log(this.dataSource );
            this.dataSource.paginator = this.paginator;
          }
      }*/

    });
  }

  /**
   * function that search a product with the filters variable
   */
  searchProduct() {

    if (this.TextoLibre != '' && this.TextoLibre != null)
      this.filters.text = this.TextoLibre;


    if (!Utils.isEmpty(this.filters)) {
      this.productsService.searchProducts(this.filters).subscribe((r) => {
        ELEMENT_DATA_PROD_REGALO = r;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
        this.dataSource.paginator = this.paginator;

      });
    } else {
      this.get_entidades_busqueda();
    }
  }


  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();

  }


  gotoedit() {
    debugger;
    this.router.navigateByUrl('/edit-productos/0');

  }

  /**
   * Get product categories
   * @return an array with the categories
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
   * Get product lines
   * @return an array with the lines
   */
  getLines(id?: number) {

    this.productsService.getLines().subscribe((l) => {
      if (!Utils.isEmpty(l)) {
        this.lines = l;
      } else {
        console.error('Error getting product lines')
      }
    })

  }

  /**
   * Get product sub lines
   * @return an array with the lines
   */
  getSubLines(id) {

    this.productsService.getSubLines(id).subscribe((sl) => {
      if (!Utils.isEmpty(sl)) {
        this.subLines = sl;
      } else {
        this.subLines = [];
        this.filters.subLinea = 0;
        console.error('Error getting product sublines')
      }
    })
  }

  clearFilters() {
    this.filters = { tipo: 0, lineID: 0, sublineID: 0 };
  }



}




export interface PeriodicElement {
  tipo: string;
  descripcion: string;
  cantidad: number;
  acciones: string;
  id_producto: string
}

var ELEMENT_DATA_PROD_REGALO: any[] = [
];
