import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Utils } from '../utils/utils';
import { DatosService } from '../datos.service';

@Component({
  selector: 'app-precios-productos',
  templateUrl: './precios-productos.component.html',
  styleUrls: ['./precios-productos.component.css']
})
export class PreciosProductosComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  user_session: any;

  public newFiles: any[] = [];
  constructor(
    private router: Router,
    private dataService: DatosService,
    private productsService: ProductsService,) { }

  ngOnInit() {
    this.user_session = JSON.parse(localStorage.getItem("user"));
    this.aplicar_estilos();
  }



  aplicar_estilos() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  prepareFile(e) {
    if (e != undefined) {
      for (let f of e.srcElement.files) {
        let accpetedTypes = ['application/vnd.ms-excel']

        if (accpetedTypes.indexOf(f.type) != -1) {
          this.newFiles.push(f);
        }
      }
    }
  }

  downloadFile() {
    this.productsService.getPlantilla().subscribe(file => {
      if (file) {
        if (file.result == "Success") {
          //window.location.href = file.data
          window.open(file.data, "_blank");
        }
        debugger;

      }
    })
  }

  uploadFile() {
    let url: string = '';
    if (!Utils.isEmpty(this.newFiles)) {
      for (let f of this.newFiles) {
        this.dataService.upload(f).subscribe((r) => {
          if (Utils.isDefined(r)) {
            url = <string>r.response;
            debugger;
            //url = url.replace('/Imagenes',this.dataService.getURL() + '/mieletickets/');
            //url = this.dataService.getURL() + "mieletickets/" + url;
            url = r.response;
            //this.prod.imagenes.push({ url: url, estatus: true });
            //if (this.prod.id !== 0)
            //  this.saveChanges(false);

            this.newFiles = [];
          }
        })
      }
    }
  }
}
