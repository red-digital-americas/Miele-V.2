import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { DatosService } from '../../datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-starter-header',
  templateUrl: './starter-header.component.html',
  styleUrls: ['./starter-header.component.css']
})
export class StarterHeaderComponent implements OnInit, OnChanges {

  @Input() dataShared: boolean = false;
  //@Input() Carrito: boolean = true;


  name: string;
  inicial: string;
  id_usuario: string = "";
  message: string = "";
  validar: boolean = true;
  NoProdCarrito: number = 0;
  muestraCarrito: boolean = false;

  constructor(public heroService: DatosService, private router: Router) {
    //this.muestraCarrito = heroService.MostrarCarrito;
  }

  ngOnInit() {
    this.validaToken();
    //console.log("inicio");
    this.name = localStorage.getItem("nombre") + " " + localStorage.getItem("paterno");
    this.inicial = localStorage.getItem("inicial");
    this.id_usuario = JSON.parse(localStorage.getItem("user")).id;
    this.getNumProdCarrito();
  }

  ngOnChanges() {
    //console.log(this.Carrito);
  }

  validaToken() {
    //alert("validacion");
    if (localStorage.getItem("token") == null) {

      this.router.navigate(['/login']);
    }
  }

  GotoCarShop() {
    this.router.navigate(['/carshop']);
  }

  getNumProdCarrito() {
    // console.log("sesions1")
    this.heroService.getNumProdCarrito(this.id_usuario)
      .subscribe((value) => {
        // console.log(value);
        switch (value.token) {
          case "Error":
            this.message = "Ocurrio un error al cargar el numero de Productos del carrito";
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

  //ngDoCheck() {
  //  this.heroService.verificarsesion();
  //}

  salir(obj): void {

    localStorage.clear();
    window.location.href = "";

  }
}
