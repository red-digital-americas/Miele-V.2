import { Component, OnInit } from '@angular/core';
import { permisos_menu } from '../../models/permisos_menu';
//import { window } from 'rxjs/operators';

@Component({
  selector: 'app-starter-left-side',
  templateUrl: './starter-left-side.component.html',
  styleUrls: ['./starter-left-side.component.css']
})
export class StarterLeftSideComponent implements OnInit {
  id_usr: any;
  id_rol: any;
  permisos_menu = new permisos_menu();
  constructor() { }

  ngOnInit() {
    // console.log("")
    if (localStorage.getItem("user") == null) {
      window.location.href = "/login";
    }
    this.id_usr = JSON.parse(localStorage.getItem("user")).id;
    this.id_rol = JSON.parse(localStorage.getItem("user")).rol;
    // debugger;
    this.get_permisos_menu();
    //console.log(document.documentElement.clientHeight);
    // console.log(document.body.clientHeight);
  }

  get_permisos_menu() {
    if (this.id_rol == "1") {

      this.permisos_menu.mostrar_Home = true;
      this.permisos_menu.mostrar_Cotizaciones = true;
      this.permisos_menu.mostrar_Gestion_Comercial = true;
      this.permisos_menu.mostrar_Nueva_Cotizacion = true;
      this.permisos_menu.mostrar_Carrito_de_Compras = true;
      this.permisos_menu.mostrar_Clientes = true;
      this.permisos_menu.mostrar_comisiones_vendedor = true;
      this.permisos_menu.mostrar_comisiones_cuentas = true;
      this.permisos_menu.mostrar_Administracion = true;
     // this.permisos_menu.mostrar_Promociones = true;
      this.permisos_menu.mostrar_Productos = true;
      this.permisos_menu.mostrar_sublineas = true;
      this.permisos_menu.mostrar_editar_banner = false;
      this.permisos_menu.mostrar_cuentas = true;
      this.permisos_menu.mostrar_Usuarios = true;
      this.permisos_menu.mostrar_Cuentas = true;
      this.permisos_menu.mostrar_sucursales = true;
      this.permisos_menu.mostrar_Reportes = true;

    }
    if (this.id_rol == "10004") // vendedor
    {
      this.permisos_menu.mostrar_Home = true;
      this.permisos_menu.mostrar_Cotizaciones = true;
      this.permisos_menu.mostrar_Gestion_Comercial = true;
      this.permisos_menu.mostrar_Nueva_Cotizacion = true;
      this.permisos_menu.mostrar_Carrito_de_Compras = true;
      this.permisos_menu.mostrar_Clientes = true;
      this.permisos_menu.mostrar_comisiones_vendedor = true;
      this.permisos_menu.mostrar_comisiones_cuentas = false;
      this.permisos_menu.mostrar_Administracion = true;
    //  this.permisos_menu.mostrar_Promociones = true;
      this.permisos_menu.mostrar_Productos = true;
      this.permisos_menu.mostrar_sublineas = true;
      this.permisos_menu.mostrar_editar_banner = false;
      this.permisos_menu.mostrar_cuentas = false;
      this.permisos_menu.mostrar_Usuarios = false;
      this.permisos_menu.mostrar_Cuentas = false;
      this.permisos_menu.mostrar_sucursales = false;
      this.permisos_menu.mostrar_Reportes = false;
    }
    if (this.id_rol == "8") //finanzas
    {

      this.permisos_menu.mostrar_Home = true;
      this.permisos_menu.mostrar_Cotizaciones = true;
      this.permisos_menu.mostrar_Gestion_Comercial = true;
      this.permisos_menu.mostrar_Nueva_Cotizacion = false;
      this.permisos_menu.mostrar_Carrito_de_Compras = false;
      this.permisos_menu.mostrar_Clientes = true;
      this.permisos_menu.mostrar_comisiones_vendedor = true;
      this.permisos_menu.mostrar_comisiones_cuentas = true;
      this.permisos_menu.mostrar_Administracion = true;
      this.permisos_menu.mostrar_Promociones = true;
      this.permisos_menu.mostrar_Productos = true;
      this.permisos_menu.mostrar_sublineas = true;
      this.permisos_menu.mostrar_editar_banner = false;
      this.permisos_menu.mostrar_cuentas = true;
      this.permisos_menu.mostrar_Usuarios = true;
      this.permisos_menu.mostrar_Cuentas = true;
      this.permisos_menu.mostrar_sucursales = true;
      this.permisos_menu.mostrar_Reportes = true;

    }
    if (this.id_rol == "9") // ventas
    {
      this.permisos_menu.mostrar_Home = true;
      this.permisos_menu.mostrar_Cotizaciones = true;
      this.permisos_menu.mostrar_Gestion_Comercial = true;
      this.permisos_menu.mostrar_Nueva_Cotizacion = false;
      this.permisos_menu.mostrar_Carrito_de_Compras = false;
      this.permisos_menu.mostrar_Clientes = true;
      this.permisos_menu.mostrar_comisiones_vendedor = true;
      this.permisos_menu.mostrar_comisiones_cuentas = true;
      this.permisos_menu.mostrar_Administracion = true;
      //this.permisos_menu.mostrar_Promociones = true;
      this.permisos_menu.mostrar_Productos = false;
      this.permisos_menu.mostrar_sublineas = false;
      this.permisos_menu.mostrar_editar_banner = false;
      this.permisos_menu.mostrar_cuentas = true;
      this.permisos_menu.mostrar_Usuarios = true;
      this.permisos_menu.mostrar_Cuentas = true;
      this.permisos_menu.mostrar_sucursales = true;
      this.permisos_menu.mostrar_Reportes = true;
    }
    if (this.id_rol == "10005") // direccion 
    {
      this.permisos_menu.mostrar_Home = true;
      this.permisos_menu.mostrar_Cotizaciones = true;
      this.permisos_menu.mostrar_Gestion_Comercial = true;
      this.permisos_menu.mostrar_Nueva_Cotizacion = false;
      this.permisos_menu.mostrar_Carrito_de_Compras = false;
      this.permisos_menu.mostrar_Clientes = true;
      this.permisos_menu.mostrar_comisiones_vendedor = true;
      this.permisos_menu.mostrar_comisiones_cuentas = true;
      this.permisos_menu.mostrar_Administracion = true;
     // this.permisos_menu.mostrar_Promociones = true;
      this.permisos_menu.mostrar_Productos = true;
      this.permisos_menu.mostrar_sublineas = true;
      this.permisos_menu.mostrar_editar_banner = false;
      this.permisos_menu.mostrar_cuentas = true;
      this.permisos_menu.mostrar_Usuarios = true;
      this.permisos_menu.mostrar_Cuentas = true;
      this.permisos_menu.mostrar_sucursales = true;
      this.permisos_menu.mostrar_Reportes = true;
    }
    if (this.id_rol == "10006")// mkt 
    {
      this.permisos_menu.mostrar_Home = false;
      this.permisos_menu.mostrar_Cotizaciones = false;
      this.permisos_menu.mostrar_Gestion_Comercial = false;
      this.permisos_menu.mostrar_Nueva_Cotizacion = false;
      this.permisos_menu.mostrar_Carrito_de_Compras = false;
      this.permisos_menu.mostrar_Clientes = true;
      this.permisos_menu.mostrar_comisiones_vendedor = false;
      this.permisos_menu.mostrar_comisiones_cuentas = false;
      this.permisos_menu.mostrar_Administracion = true;
     // this.permisos_menu.mostrar_Promociones = false;
      this.permisos_menu.mostrar_Productos = true;
      this.permisos_menu.mostrar_sublineas = true;
      this.permisos_menu.mostrar_editar_banner = true;
      this.permisos_menu.mostrar_cuentas = false;
      this.permisos_menu.mostrar_Usuarios = false;
      this.permisos_menu.mostrar_Cuentas = false;
      this.permisos_menu.mostrar_sucursales = false;
      this.permisos_menu.mostrar_Reportes = false;
    }
    this.permisos_menu.mostrar_Home = true;

  }
}

