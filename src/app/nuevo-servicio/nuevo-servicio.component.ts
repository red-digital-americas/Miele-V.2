//import { Component, OnInit, OnDestroy } from '@angular/core';
//import { DatosService } from '../datos.service';
//import 'rxjs/Rx';
//import { ActivatedRoute, Router } from '@angular/router';

//@Component({
//  selector: 'app-nuevo-servicio',
//  templateUrl: './nuevo-servicio.component.html',
//  styleUrls: ['./nuevo-servicio.component.css']
//})
//export class NuevoServicioComponent implements OnInit {
//  preventAbuse = false;
//  id: number;
//  public sub: any;
//  public detalle: string[] = [];

//  bodyClasses = 'skin-blue sidebar-mini';
//  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

//  constructor(private heroService: DatosService, private route: ActivatedRoute, private router: Router) { }


//  ngOnInit() {
//    if (localStorage.getItem("user") == undefined) {
//      this.router.navigate(['/login']);
//    }
//    else {

//    }
//    this.heroService.verificarsesion();
//    // add the the body classes
//    this.body.classList.add('skin-blue');
//    this.body.classList.add('sidebar-mini');

//    this.sub = this.route.params.subscribe(params => {
//      this.id = +params['id']; // (+) converts string 'id' to a number
//      console.log(this.id);
//      // In a real app: dispatch action to load the details here.
//    });

//    this.heroService.service_general_get("Clientes/" + this.id, {}).subscribe((value) => {
//      console.log(value[0]);
//      this.detalle = value[0];
//    });
//  }

//  ngOnDestroy() {
//    // remove the the body classes
//    this.body.classList.remove('skin-blue');
//    this.body.classList.remove('sidebar-mini');
//  }

//}
