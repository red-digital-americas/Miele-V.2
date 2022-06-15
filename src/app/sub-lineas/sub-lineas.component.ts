import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { MatDialog, MatSnackBar, MatDatepickerModule, MatPaginator, MatTableDataSource } from '@angular/material';
import { linea, categoria, subLinea, subLine } from '../models/producto';
import { Utils } from '../utils/utils';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sub-lineas',
  templateUrl: './sub-lineas.component.html',
  styleUrls: ['./sub-lineas.component.css']
})
export class SubLineasComponent implements OnInit {

  constructor(private router: Router,
    private productsService: ProductsService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public matDatepicker: MatDatepickerModule) { }

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  tipos: number = 0;



  TextoLibre: string = "";

  public dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  public displayedColumns = ['descripcion', 'linea_producto_desc', 'estatus'];
  public columNames: Object = ['Descripcion', 'Linea', 'Activo'];
  public filters: any = { lineID: 0 };
  public categories: categoria[] = [];
  public lines: linea[] = [];
  public subLines: linea[] = [];
  filtrosub: string = ""; 
  filtroSublineas: subLine[] = [];

  @ViewChild('paginator') paginator: MatPaginator

  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  preventAbuse: boolean = false;
  Rol: string = "";
  user_session: any;
  permisos_edicion: boolean = false;
  validar_permisos() {
    if (this.user_session.rol == 10006)
      this.permisos_edicion = true;
  }

  ngOnInit() {
    this.user_session = JSON.parse(localStorage.getItem("user"));
    this.aplicar_estilos();
    this.get_sublineas_busqueda();
    //this.getCategories();
    this.getLines();
    this.validar_permisos();
  }

  get_sublineas_busqueda() {
    // debugger;
    //var creadoobj = { TextoLibre: "", tipo_entidad: this.tipos };
   // this.preventAbuse = true;
    this.productsService.searchSubLines(this.filters).subscribe((r) => {
      ELEMENT_DATA_PROD_REGALO = r;
      console.log(r);
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
      this.dataSource.paginator = this.paginator;
      this.filtroSublineas = r;
      this.preventAbuse = false;

    });
  }

  goTodetalle(id: number) {
    this.router.navigate(['/sublinea/' + id]);
  }


  //searchProduct() {
  //  //console.log(this.filters);
    

  //  if (!Utils.isEmpty(this.filters)) {
  //    this.productsService.searchSubLines(this.filters).subscribe((r) => {
  //      //console.log(r);
  //      ELEMENT_DATA_PROD_REGALO = r;
  //      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  //      this.dataSource.paginator = this.paginator;

  //    });
  //  } else {
  //    this.get_sublineas_busqueda();
  //  }
  //}

  searchProduct() {

    
    this.dataSource = new MatTableDataSource<PeriodicElement>
      (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.linea_producto_desc == (this.filtrosub == "" ? cc.linea_producto_desc : this.filtrosub)));

    this.dataSource.paginator = this.paginator;

    debugger;

  }
  limpiar() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
    this.dataSource.paginator = this.paginator;

  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }



  gotoedit(tipo: number) {

    this.router.navigate(['/sublinea/0']);

  }



  getLines(id?: number) {

    this.productsService.getLines().subscribe((respuesta) => {
      if (!Utils.isEmpty(respuesta)) {
        this.lines = respuesta;
        //console.log(this.lines);
      } else {
        console.error('Error getting product lines')
      }
    })

  }
}


export interface PeriodicElement {
  //descripcion: string; linea: number;

}

var ELEMENT_DATA_PROD_REGALO: any[] = [
];
