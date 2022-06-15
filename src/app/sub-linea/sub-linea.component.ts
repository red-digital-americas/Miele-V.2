import { Component, OnInit, ViewChild, Inject, Output, EventEmitter, Input } from '@angular/core';
import { subLine, linea, rel_categoria, tipo_servicio, categoria } from '../models/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDatepickerModule, MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductsService } from '../services/products.service';
import { DatosService } from '../datos.service';
import { Overlay } from '@angular/cdk/overlay';
import { Utils } from '../utils/utils';
import { forEach } from '@angular/router/src/utils/collection';
import { retry } from 'rxjs/operators';



@Component({
  selector: 'app-sub-linea',
  templateUrl: './sub-linea.component.html',
  styleUrls: ['./sub-linea.component.css']
})
export class SubLineaComponent implements OnInit {
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];


  public sublinea = new subLine();
  public categorias: rel_categoria[] = [];
  public tipos: tipo_servicio[] = [];
  public lines: linea[] = [];

  // tabla categorias
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_PROD_REGALO);
  displayedColumns = ['no_tecnicos', 'horas_tecnicos', 'precio_visita', 'precio_hora_tecnico', 'id_tipo_servicio', 'estatus'];
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
    public overlay: Overlay) { }

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      localStorage.setItem("catEdit", "");
      let sublineId = this.route.snapshot.params['id'];
      this.aplicar_estilos();
      if (sublineId > 0) {
        this.getSublines(sublineId);
      }
      //else
      //this.categorias = new rel_categoria[];
      this.getLines();
      this.getTypeServicess();
    }
    
  }


  getSublines(id: number) {
    this.productsService.getSubLineById(id).subscribe((respuesta) => {
      if (respuesta != undefined) {
        this.sublinea = respuesta;
        this.categorias = respuesta.rel_categoria;
        console.log(this.tipos);
        this.categorias.forEach(item => {
          item.servicio = this.tipos.find(t => t.id == item.id_tipo_servicio).desc_tipo_servicio;
          //console.log(this.tipos.find(t => t.id == item.id_tipo_servicio));
        })
        //console.log(respuesta);
        //console.log(this.categorias);
      }
    })
  }

  saveChanges(valido: boolean) {
    this.sublinea.rel_categoria = this.categorias;
    if (valido) {
      if (this.sublinea.id > 0) {
        //console.log("actualizar");
        //console.log(this.sublinea);
        this.productsService.UpdateSubLine(this.sublinea).subscribe((respuesta) => {
          //console.log(respuesta);
          if (respuesta.result == "Success") {
            this.router.navigate(['/sublineas']);
          }
        })
      }
      else {
        //console.log("agregar");
        //console.log(this.sublinea);
        this.productsService.saveSubLine(this.sublinea).subscribe((respuesta) => {
          if (respuesta.result == "Success") {
            this.router.navigate(['/sublineas']);
          }
        })
      }
    }
  }

  goBack() {
    this.router.navigate(['/sublineas']);
  }

  nuevCategoria(): void {
    this.openCategoriasDialog(new rel_categoria());
  }

  openCategoriasDialog(categoria: any): void {
    //console.log(categoria);
    let dialogRef_ = this.dialog.open(DialogCategorias, {
      width: '700px',
      height: '320px',
      data: {
        id: categoria.id,
        no_tecnicos: categoria.no_tecnicos,
        horas_tecnicos: categoria.horas_tecnicos,
        precio_visita: categoria.precio_visita,
        precio_hora_tecnico: categoria.precio_hora_tecnico,
        id_tipo_servicio: categoria.id_tipo_servicio,
        estatus: categoria.estatus
      }
    });
    dialogRef_.afterClosed().subscribe(result => {
      var catModificada = this.productsService.ecategoria;
      if (catModificada != null) {
        //console.log(catModificada);
        if (catModificada.id > 0) {
          this.categorias.forEach(item => {
            //console.log(item.id.toString() + " " + catModificada.id.toString());
            if (item.id == catModificada.id) {
              //console.log("encontrado");
              item.no_tecnicos = catModificada.no_tecnicos;
              item.horas_tecnicos = catModificada.horas_tecnicos;
              item.precio_visita = catModificada.precio_visita;
              item.precio_hora_tecnico = catModificada.precio_hora_tecnico;
              item.id_tipo_servicio = catModificada.id_tipo_servicio;
              item.id_categoria = this.sublinea.id;
              item.servicio = this.tipos.find(t => t.id == item.id_tipo_servicio).desc_tipo_servicio;
            }
          })

        }
        else {
          catModificada.servicio = this.tipos.find(t => t.id == catModificada.id_tipo_servicio).desc_tipo_servicio;
          this.categorias.push(catModificada);
        }

      }
      else
        console.log('Pop Up Categorias cerrado');
      //this.CallgetCotizaciones(null);
    });
  }

  getLines(id?: number) {

    this.productsService.getLines().subscribe((respuesta) => {
      if (!Utils.isEmpty(respuesta)) {
        this.lines = respuesta;
      }

    })

  }

  getTypeServicess() {
    //console.log("cargartipos");
    this.productsService.getTypeServices().subscribe((respuesta) => {
      if (!Utils.isEmpty(respuesta)) {
        this.tipos = respuesta;
      }

    })

  }
}

var EDIT_CATEGORIA: Element;
export interface PeriodicElement {
  no_tecnicos: number;
  horas_tecnicos: string;
  precio_visita: number;
  precio_hora_tecnico: number;
  id_tipo_servicio: number;
  estatus: boolean;
}

var ELEMENT_DATA_PROD_REGALO: any[] = [
];






@Component({
  selector: 'dialog-categorias',
  templateUrl: 'dialog-categorias.html',
})
export class DialogCategorias {
  //punto1
  public categorias: rel_categoria[];
  public ecategoria = new rel_categoria();
  public tipos: tipo_servicio[] = [];
  //Direccion Envio
  //@Output() editCategoria = new EventEmitter<any>();  

  public GuardarSolcitar(esvalido: boolean): rel_categoria {

    if (esvalido) {
      this.productsService.ecategoria = this.ecategoria;
      this.dialogRef.close();
      return this.ecategoria;

    }
  }


  ngOnInit() {
    //var editaCategoria = { Id: this.data.id, no_tecnicos: this.data.no_tecnicos, horas_tecnicos: this.data.horas_tecnicos, precio_visita: this.data.precio_visita };
    this.ecategoria = this.data;
    this.getTypeServicess();
    this.productsService.ecategoria = null;
  }


  constructor(private heroService: DatosService, private productsService: ProductsService, private router: Router, public dialogRef: MatDialogRef<DialogCategorias>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();

  }

  getTypeServicess() {
    //console.log("cargartipos");
    this.productsService.getTypeServices().subscribe((respuesta) => {
      if (!Utils.isEmpty(respuesta)) {
        this.tipos = respuesta;
      }

    })

  }

}
