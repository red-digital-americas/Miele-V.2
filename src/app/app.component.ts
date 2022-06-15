import { Component, ViewChild, OnInit } from '@angular/core';
import { DatosService } from './datos.service';
import { StarterHeaderComponent } from "./starter/starter-header/starter-header.component";
import { CargarproductosComponent } from "./cargarproductos/cargarproductos.component";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  token: boolean;
  @ViewChild('child2') ProdsVar: CargarproductosComponent;
  @ViewChild('child1') HeaderVar: StarterHeaderComponent;
 
  

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    this.token = this.heroService.getToken();
    //console.log(this.ProdsVar);
    //this.ProdsVar.emitEvent
    //  .subscribe(
    //  res => {
    //    console.log("Atributo:" + res);
    //    this.HeaderVar.dataShared = res;
    //  }
    //  );
  }

  //change(): void {
  //  this.ProdsVar.function1();
  //}
  //ngDoCheck() {
  //  this.heroService.verificarsesion();
  //}
}
