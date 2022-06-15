import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Utils } from '../utils/utils';
import { Clientes } from '../models/cotizacion';
import { ClientesService } from '../services/clientes.service';
import { DatosService } from '../datos.service';
import { PeriodicElement } from '../edit-productos/edit-productos.component';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})


export class ClientesComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator

  public body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  public dataSource = new MatTableDataSource<Clientes>([]);
  //public dataSource:any = {};
  public displayedColumns = ['id', 'nombre', 'email', 'canal', 'cuenta', 'sucursal'];
  public columNames: Object = { 'id': 'ID Cliente', 'nombre': 'Nombre', 'email': 'Email', 'canal': 'Canal', 'cuenta': 'Cuenta', 'sucursal':'Sucursal',"linea": "Linea", "telefono": "Telefono", 'telefono_movil': 'Telefono Movíl', 'vigencia_ref': 'Vigencia Referido', 'renovar': 'Renovar Vigencia' }
  public textoLibre: string = "";
  public filters: any = {}

  canalesCo: any[] = [];
  Canal: string = "";
  Cuenta: string = "";
  Cuentas: any[] = [];
  Sucursal: string = "";
  Sucursales: any[] = [];
  canalfiltro: any = 0;
  cuentafiltro: any = 0;
  sucursalfiltro: any = 0; 

  


  public initialState: boolean = true;

  public IDUSR: number = 0;
  constructor(
    private router: Router,
    private clientesService: ClientesService,
    private datosService: DatosService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
      if (parseInt(localStorage.getItem('id_canal')) == 3) {
        this.displayedColumns.push('vigencia_ref')
        this.displayedColumns.push('renovar')
      }

      this.aplicar_estilos();
      this.getClientes();
      this.getCat_canales();
     // this.getCat_Cuentas();
      //this.getCat_Sucursales();

    }
  }


  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  getClientes(filters?: any) {
    var creadoobj = { Canal: this.Canal, Cuenta: this.Cuenta, IDUSR: this.IDUSR, Sucursales: this.Sucursal };
    this.datosService.ServicioPostGeneralClients("get_allclients", creadoobj).subscribe((r) => {

      switch (r.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + r.detalle);
          break;
        default:
          if (r.result == "Success") {
           
            debugger;
            ELEMENT_DATA_CLIENTS = r.item;
            
            this.dataSource = new MatTableDataSource<any>(ELEMENT_DATA_CLIENTS);
            // ELEMENT_DATA_SUCURSALES_CC = value.item[0].condiones_comerciales_sucursal;
            // this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);

            //  this.dataSource.filteredData.toLocaleString("Sucursal");

            this.dataSource.paginator = this.paginator;
          }
      }
     

    });
  }

  /**
   * function that search a product with the filters variable
   */


  get_entidades_busqueda() {
    // debugger;
    var creadoobj = {  Canal: this.Canal, Cuenta: this.Cuenta, IDUSR: this.IDUSR, Sucursales: this.Sucursal };
    // debugger;
    this.datosService.ServicioPostGeneral("Get_clientes", creadoobj).subscribe((value) => {
      //setTimeout(() => {

      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
          break;
        default:
          if (value.result == "Success") {
            debugger;
            this.dataSource = new MatTableDataSource<any>();
            // ELEMENT_DATA_SUCURSALES_CC = value.item[0].condiones_comerciales_sucursal;
            // this.dataSource_suc_part = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_SUCURSALES_CC);

            //  this.dataSource.filteredData.toLocaleString("Sucursal");

            this.dataSource.paginator = this.paginator;
          }
      }
      //}, 400);
    });
  }



  selectCanal(event) {


    console.log(event.source);
    console.log(event.value);
    console.log(ELEMENT_DATA_CLIENTS.filter(cc => cc.id_canal == (this.Canal == '' ? cc.id_canal : this.Canal)));
    this.dataSource = new MatTableDataSource<any>
      (ELEMENT_DATA_CLIENTS.filter(cc => cc.id_canal == (this.Canal == '' ? cc.id_canal : this.Canal)));

    this.dataSource.paginator = this.paginator;

   
   

  }


  selectCuenta(event) {
    console.log(event);

    this.dataSource = new MatTableDataSource<any>
      (ELEMENT_DATA_CLIENTS.filter(cc => cc.id_canal == (this.canalfiltro == 0 ? cc.id_canal : this.canalfiltro)
      && cc.id_cuenta == (this.cuentafiltro == 0 ? cc.id_cuenta : this.cuentafiltro)));

    this.dataSource.paginator = this.paginator;
  }

  selectSucursal(event) {
    console.log(event);

    this.dataSource.filter = (event.value);
    this.dataSource = new MatTableDataSource<any>
      (ELEMENT_DATA_CLIENTS.filter(cc => cc.id_canal == (this.canalfiltro == 0 ? cc.id_canal : this.canalfiltro)
      && cc.id_cuenta == (this.cuentafiltro == 0 ? cc.id_cuenta : this.cuentafiltro)
      && cc.id_sucursal == (this.sucursalfiltro == 0 ? cc.id_sucursal : this.sucursalfiltro)));

    //this.sublineas_aplicables = this.sublineas_filtro.filter(sl => sl.id_linea_producto == this._linea_filtro || sl.id == 0);
    this.dataSource.paginator = this.paginator;
  }




  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
    /* console.log (value);
  console.log(ELEMENT_DATA_PROD_REGALO.filter(cc => cc.name == (value == '' ? cc.name : value)
       )) ;
  
      this.dataSource = new MatTableDataSource<PeriodicElement>
        (ELEMENT_DATA_PROD_REGALO.filter(cc => cc.name == (value == '' ? cc.name : value)));
  
      //this.sublineas_aplicables = this.sublineas_filtro.filter(sl => sl.id_linea_producto == this._linea_filtro || sl.id == 0);
      this.dataSource.paginator = this.paginator;*/

  }

  searchClient() {

    if (this.textoLibre != '' && this.textoLibre != null)
      this.filters.text = this.textoLibre;

    if (!Utils.isEmpty(this.filters)) {
      this.clientesService.searchClient(this.filters).subscribe((r) => {
        this.dataSource = new MatTableDataSource<any>(r);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator = this.paginator;

      });
    } else {
      this.getClientes();
    }
  }

  getCat_canales(): void {
    var creadoobj = { Id: this.IDUSR };
    this.datosService.ServicioPostGeneral("Canales_por_usuario", creadoobj)
      .subscribe((value) => {
        this.canalesCo = value.item;
      });

  }

 getCat_Cuentas(): void {
   var creadoobj = { Id1: this.Canal == "" ? "0" : this.Canal, Id2: this.IDUSR };
   this.datosService.ServicioPostGeneral("Cuentas_por_Canal_usr", creadoobj)
   //this.datosService.ServicioPostGeneral("Canales_por_usuario", creadoobj)
      .subscribe((value) => {
        this.Cuentas = value.item;
      });

  }
  getCat_Sucursales(): void {
    var creadoobj = { Id1: this.Canal == "" ? "0" : this.Canal, Id2: this.Cuenta == "" ? "0" : this.Cuenta, Id3: this.IDUSR };
    this.datosService.ServicioPostGeneral("SucursalesPorCanalCuentaUsuario", creadoobj)
      .subscribe((value) => {
        this.Sucursales = value.item;
      });
  }


  gotoedit(id?: number) {
    if (Utils.isDefined(id) && id === 0)
      this.router.navigate(['/clientes/edit/0']);
    else
      this.router.navigate(['/clientes/edit/' + id])

  }


  clearFilters() {
    this.filters = {};
  }
  /**
   * Function to renew vigencia
   * @param id Id Cliente
   */

  renovarVigencia(id) {

    if (!Utils.isEmpty(id)) {
      this.clientesService.renovarVigencia(id).subscribe((r) => {
        if (!Utils.isEmpty(r) && Utils.isDefined(r.id)) {
          let ds = this.dataSource.filteredData;
          let result: any = ds.filter((e) => {
            if (e.id == id)
              return e
          });

          if (!Utils.isEmpty(result) && result[0].id == r.id) {

            result[0].vigencia_ref = r.vigencia_ref;
            this.openSnackBar('Vigencia de ' + result[0].nombre + ' ' + result[0].paterno + ' actualizada.');

          };
        }
      })
    }
  }

  openSnackBar(message: string, action = '') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });
  }
 
}

var ELEMENT_DATA_CLIENTS: any[] = [
];

