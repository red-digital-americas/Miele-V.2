//import { Component, OnInit } from '@angular/core';
//import { MatRadioModule } from '@angular/material/radio';
//import { DatosService } from '../datos.service';
//import { Router } from '@angular/router';

//@Component({
//  selector: 'app-nuevo-cliente',
//  templateUrl: './nuevo-cliente.component.html',
//  styleUrls: ['./nuevo-cliente.component.css']
//})
//export class NuevoClienteComponent implements OnInit {

//  bodyClasses = 'skin-blue sidebar-mini';
//  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

//  constructor(private heroService: DatosService, private router: Router) { }

//  ngOnInit() {
//    if (localStorage.getItem("user") == undefined) {
//      this.router.navigate(['/login']);
//    }
//    else {
//      this.heroService.verificarsesion();
//      // add the the body classes
//      this.body.classList.add('skin-blue');
//      this.body.classList.add('sidebar-mini');
//    }

//  }

//  ngOnDestroy() {
//    // remove the the body classes
//    this.body.classList.remove('skin-blue');
//    this.body.classList.remove('sidebar-mini');
//  }

//}
