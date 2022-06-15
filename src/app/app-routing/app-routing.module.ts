import { StarterComponent } from './../starter/starter.component';
import { LoginComponent } from './../login/login.component';
//import { TecnicosComponent } from './../tecnicos/tecnicos.component';
import { RecuperarPasswordComponent } from './../recuperar-password/recuperar-password.component';
import { PerfilComponent } from './../perfil/perfil.component';
import { ConfiguracionComponent } from './../configuracion/configuracion.component';
//import { VerServicioComponent } from './../ver-servicio/ver-servicio.component';
//import { NuevoClienteComponent } from './../nuevo-cliente/nuevo-cliente.component';
//import { ServicioDetalleComponent } from './../servicio-detalle/servicio-detalle.component';
//import { NuevoServicioComponent } from './../nuevo-servicio/nuevo-servicio.component';
import { VercotizacionComponent } from './../vercotizacion/vercotizacion.component';
import { CargarproductosComponent } from './../cargarproductos/cargarproductos.component';
//import { DetalleproductoComponent } from './../detalleproducto/detalleproducto.component';
import { CotizacionComponent } from './../cotizacion/cotizacion.component';
import { DetallecotizacionComponent } from './../detallecotizacion/detallecotizacion.component';
import { CarshopComponent } from './../carshop/carshop.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CargarpcarritoComponent } from './../cargarpcarrito/cargarpcarrito.component';
import { PromocionesComponent } from '../promociones/promociones.component';
import { NuevoPromocionComponent } from '../nuevo-promocion/nuevo-promocion.component';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { CuentasComponent } from '../cuentas/cuentas.component';
//import { EditarCanalComponent } from '../editar-canal/editar-canal.component';
import { EditarSucursalComponent } from '../editar-sucursal/editar-sucursal.component';
import { EditarCuentaComponent } from '../editar-cuenta/editar-cuenta.component';
import { ProductosComponent } from '../productos/productos.component';
import { EditProductosComponent } from '../edit-productos/edit-productos.component';
import { ClientesComponent } from '../clientes/clientes.component';
import { EditClientComponent } from '../clientes/edit-cliente/edit-cliente.component'
import { SubLineaComponent } from '../sub-linea/sub-linea.component';
import { SubLineasComponent } from '../sub-lineas/sub-lineas.component';
import { SucursalesComponent } from '../sucursales/sucursales.component';
import { EditarUsuariosComponent } from '../editar-usuarios/editar-usuarios.component';
import { ComisionesVendedorComponent } from '../comisiones-vendedor/comisiones-vendedor.component';
import { DetalleComisionesVendedorComponent } from '../detalle-comisiones-vendedor/detalle-comisiones-vendedor.component';
import { ComunicacionComponent } from '../comunicacion/comunicacion.component';
import { MargenesComercialesComponent } from '../margenes-comerciales/margenes-comerciales.component';
import { DetalleMargenesComercialesComponent } from '../detalle-margenes-comerciales/detalle-margenes-comerciales.component';
import { ConfigComisionesvComponent } from '../config-comisionesv/config-comisionesv.component';
import { PreciosProductosComponent } from '../precios-productos/precios-productos.component';
import { BuscarcomisionesComponent } from '../buscarcomisiones/buscarcomisiones.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: VercotizacionComponent },
  //{ path: 'main', component: StarterComponent },
  //{ path: 'addtecnico', component: TecnicosComponent },
  { path: 'recuperarpassword', component: RecuperarPasswordComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  //{ path: 'verservicio', component: VerServicioComponent },
  //{ path: 'addcliente', component: NuevoClienteComponent },
  //{ path: 'serviciodetalle/:id', component: ServicioDetalleComponent },
  //{ path: 'nuevoservicio/:id', component: NuevoServicioComponent },
  { path: 'buscadorcotizaciones', component: VercotizacionComponent },
  { path: 'cargarproductos/:id', component: CargarproductosComponent },
  //{ path: 'detalleproducto/:art/:id_cotiza', component: DetalleproductoComponent },
  { path: 'cotizacion', component: CotizacionComponent },
  { path: 'detallecotizacion/:id', component: DetallecotizacionComponent },
  { path: 'carshop', component: CarshopComponent },
  { path: 'cargarpcarrito/:id_cotiza', component: CargarpcarritoComponent },
  { path: 'promociones', component: PromocionesComponent },
  { path: 'nuevapromocion/:id', component: NuevoPromocionComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'cuentas', component: CuentasComponent },
  //{ path: 'editar-canal/:id', component: EditarCanalComponent },
  { path: 'editar-sucursal/:id', component: EditarSucursalComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'edit-productos/:id', component: EditProductosComponent },
  { path: 'editar-cuenta/:id', component: EditarCuentaComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/edit/:id', component: EditClientComponent },
  { path: 'sublinea/:id', component: SubLineaComponent },
  { path: 'sublineas', component: SubLineasComponent },
  { path: 'sucursales', component: SucursalesComponent },
  { path: 'editar-usuarios/:id', component: EditarUsuariosComponent },
  { path: 'clientes/edit/:id', component: EditClientComponent },
  { path: 'comisiones-vendedor', component: ComisionesVendedorComponent },
  { path: 'detalle-comision/:id', component: DetalleComisionesVendedorComponent },
  { path: 'comunicacion', component: ComunicacionComponent },
  { path: 'margenes-comerciales', component: MargenesComercialesComponent },
  { path: 'detalle-margenes-comerciales/:id', component: DetalleMargenesComercialesComponent },
  { path: 'config-comisiones/:id', component: ConfigComisionesvComponent },
  { path: 'precios-productos', component: PreciosProductosComponent },
  { path: 'buscarcomisiones', component: BuscarcomisionesComponent },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
