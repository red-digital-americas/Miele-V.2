import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxCurrencyModule } from "ngx-currency";
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';


// Cards - Autocomplete - Grid - Button - SnackBAr - Double Date picker - iconos - fechas - maskarasimput
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

//Chips
import { TagInputModule } from 'ngx-chips';
//
//Data table
//
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatPaginatorIntl } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipInputEvent } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';



//Menu lateral y header 
import { AppComponent } from './app.component';
import { StarterComponent } from './starter/starter.component';
import { StarterHeaderComponent } from './starter/starter-header/starter-header.component';
import { StarterLeftSideComponent } from './starter/starter-left-side/starter-left-side.component';
import { StarterContentComponent } from './starter/starter-content/starter-content.component';
import { StarterFooterComponent } from './starter/starter-footer/starter-footer.component';
import { StarterControlSidebarComponent } from './starter/starter-control-sidebar/starter-control-sidebar.component';
//Login
import { LoginComponent } from './login/login.component';
//Servicio
import { DatosService } from './datos.service';
import { ProductsService } from './services/products.service';
import { ClientesService } from './services/clientes.service';
//Admin
//import { TecnicosComponent } from './tecnicos/tecnicos.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
//import { VerServicioComponent } from './ver-servicio/ver-servicio.component';
//import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
//import { ServicioDetalleComponent } from './servicio-detalle/servicio-detalle.component';
//import { NuevoServicioComponent } from './nuevo-servicio/nuevo-servicio.component';
import { VercotizacionComponent, DialogOverviewExampleDialogF, DialogIBSLista } from './vercotizacion/vercotizacion.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './vercotizacion/dutch-paginator-intl';
import { CargarproductosComponent, DialogHomeProgram, DialogCertificados } from './cargarproductos/cargarproductos.component';
//import { DetalleproductoComponent } from './detalleproducto/detalleproducto.component';
import { CotizacionComponent, DialogOverviewExampleDialog, DialogCambioDir } from './cotizacion/cotizacion.component';
import { DetallecotizacionComponent, DialogOverviewExampleDialogD, DialogCancelDialog, SolEntregaDialog, DialogSolEntregaCompleto, DialogIBS, DialogRechazar } from './detallecotizacion/detallecotizacion.component';
import { CarshopComponent, DialogEditCP, DialogConfirma } from './carshop/carshop.component';
import { CargarpcarritoComponent, PizzaPartyComponent } from './cargarpcarrito/cargarpcarrito.component';
import { PromocionesComponent } from './promociones/promociones.component';
import { NuevoPromocionComponent } from './nuevo-promocion/nuevo-promocion.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CuentasComponent } from './cuentas/cuentas.component';
//import { EditarCanalComponent } from './editar-canal/editar-canal.component';
import { EditarSucursalComponent } from './editar-sucursal/editar-sucursal.component';
import { EditarCuentaComponent } from './editar-cuenta/editar-cuenta.component';
import { ProductosComponent } from './productos/productos.component';
import { EditProductosComponent, DialogRelacionados, DialogDelImage } from './edit-productos/edit-productos.component';
import { EditProductLineComponent } from './edit-productos/edit-linea/edit-linea.component';
import { EditProductSublineComponent } from './edit-productos/edit-sublinea/edit-sublinea.component';
import { ImageDetailComponent } from './edit-productos/image-detail/image-detail.component';
import { ImageDetailComponents } from './editar-sucursal/image-detail/image-detail.components';
import { ClientesComponent } from './clientes/clientes.component';
import { EditClientComponent } from './clientes/edit-cliente/edit-cliente.component';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { EditarUsuariosComponent } from './editar-usuarios/editar-usuarios.component';
import { SubLineaComponent, DialogCategorias } from './sub-linea/sub-linea.component';
import { SubLineasComponent } from './sub-lineas/sub-lineas.component';
import { ComisionesVendedorComponent } from './comisiones-vendedor/comisiones-vendedor.component';
import { DetalleComisionesVendedorComponent } from './detalle-comisiones-vendedor/detalle-comisiones-vendedor.component';
import { ComunicacionComponent } from './comunicacion/comunicacion.component';
import { MenuItemComponent } from './cargarproductos/menu-item/menu-item.component';
import { ConfigComisionesvComponent } from './config-comisionesv/config-comisionesv.component';
import { PreciosProductosComponent } from './precios-productos/precios-productos.component';
import { MargenesComercialesComponent } from './margenes-comerciales/margenes-comerciales.component';
import { DetalleMargenesComercialesComponent } from './detalle-margenes-comerciales/detalle-margenes-comerciales.component';
import { BuscarcomisionesComponent } from './buscarcomisiones/buscarcomisiones.component';
import { ValidatePhoneDirective, ValidateCPDirective, SelectRequiredValidatorDirective, ConfirmRangelValidatorDirective } from '../app/detallecotizacion/validate-phone';

@NgModule({
  declarations: [

    AppComponent,
    StarterComponent,
    StarterHeaderComponent,
    StarterLeftSideComponent,
    StarterContentComponent,
    StarterFooterComponent,
    StarterControlSidebarComponent,
    LoginComponent,
    //TecnicosComponent,
    RecuperarPasswordComponent,
    PerfilComponent,
    ConfiguracionComponent,
    //VerServicioComponent,
    //NuevoClienteComponent,
    //ServicioDetalleComponent,
    //NuevoServicioComponent,
    VercotizacionComponent,
    CargarproductosComponent,
    DialogHomeProgram,
    DialogCertificados,
    //DetalleproductoComponent,
    CotizacionComponent,
    DetallecotizacionComponent,
    DialogOverviewExampleDialogD,
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialogF,
    DialogIBSLista,
    DialogCancelDialog,
    DialogRechazar,
    SolEntregaDialog,
    DialogSolEntregaCompleto,
    DialogIBS,
    CarshopComponent,
    DialogEditCP,
    DialogConfirma,
    DialogCambioDir,
    CargarpcarritoComponent,
    PromocionesComponent,
    NuevoPromocionComponent,
    UsuariosComponent,
    CuentasComponent,
    //EditarCanalComponent,
    EditarSucursalComponent,
    EditarCuentaComponent,
    ProductosComponent,
    EditProductosComponent,
    EditProductLineComponent,
    EditProductSublineComponent,
    ImageDetailComponent,
    ImageDetailComponents,
    ClientesComponent,
    EditClientComponent,
    PizzaPartyComponent,
    SubLineaComponent,
    DialogCategorias,
    DialogRelacionados,
    DialogDelImage,
    SucursalesComponent,
    EditarUsuariosComponent,
    SubLineasComponent,
    ComisionesVendedorComponent,
    DetalleComisionesVendedorComponent,
    ComunicacionComponent,
    MenuItemComponent,
    ConfigComisionesvComponent,
    MargenesComercialesComponent,
    DetalleMargenesComercialesComponent,
    PreciosProductosComponent,
    BuscarcomisionesComponent,
    ValidatePhoneDirective,
    ValidateCPDirective,
    SelectRequiredValidatorDirective,
    ConfirmRangelValidatorDirective
  ],
  entryComponents: [
    DialogOverviewExampleDialog, DialogOverviewExampleDialogD, DialogEditCP, DialogConfirma, DialogCancelDialog, DialogHomeProgram, DialogCertificados, DialogRechazar, SolEntregaDialog, DialogSolEntregaCompleto, DialogIBS, DialogOverviewExampleDialogF, DialogIBSLista,
    EditProductLineComponent, EditProductSublineComponent, ImageDetailComponent, ImageDetailComponents, DialogRelacionados, DialogDelImage, DialogCategorias, DialogCambioDir
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    TagInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatMenuModule,
    MatInputModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatTabsModule,
    MatDividerModule,
    TextMaskModule,
    NgxCurrencyModule,
    NgProgressModule.forRoot({
      spinnerPosition: 'right',
      color: '#A5000D',
      thick: true
    }),
    NgProgressHttpModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    Daterangepicker,

    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule
  ],
  exports: [MatButtonModule, MatCheckboxModule],
  providers: [DatosService, ProductsService, ClientesService, { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }],
  bootstrap: [AppComponent]
})
export class AppModule { }
