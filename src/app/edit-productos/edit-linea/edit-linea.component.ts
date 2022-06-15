import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { producto, linea, categoria } from '../../models/producto';
import { Utils } from '../../utils/utils';
import { ProductsService } from '../../services/products.service';
import { cat_tipos_herencia } from '../../models/promocion';
import { timeout } from 'q';



@Component({
  selector: 'dialog-edit-line',
  templateUrl: './edit-linea.component.html',
  styleUrls: ['./edit-linea.component.css']
})
export class EditProductLineComponent implements OnInit {
  
  public prod = new producto();
  public lines:linea[] = [];
  public subLines:linea[] = [];
  public status: string = 'init';
  public newProductLine:linea = {id:0, descripcion:'', estatus:true, id_categoria:1 };
  
  public categories:categoria[] = [];

  constructor( 
                public snackBar: MatSnackBar, 
                public dialog: MatDialog, 
                private productsService:ProductsService,
                public dialogRef: MatDialogRef<EditProductLineComponent>) { }

  ngOnInit() {
    this.getLines();
    //this.getCategories();
  }


  onNoClick(id?:number): void {
    id = Utils.getValue(id,0);
    this.dialogRef.close({status:this.status, id:id});
  }


  /**
   * Get product lines
   * @return an array with the lines
   */
  getLines(){

    this.productsService.getLines().subscribe((l) => {
     if(!Utils.isEmpty(l)){
        this.lines = l; 
      }else{
        console.error('Error getting product lines')
      }
    })
    
  } 
  
  /**
   * Get product lines
   * @return an array with the lines
   */
  /**
   * Get product sublines by Line ID
   * @param id 
   */

  getCategories(){
    this.productsService.getCategories().subscribe((cat) => {
      if(!Utils.isEmpty(cat)){
         this.categories = cat; 
       }else{
        this.categories = [];
         console.error('Error getting product sublines')
       }
     })
  }

 
  /**
   * Function that opens the AddLine modal
   */
  addLine(){

    if(!Utils.isEmpty(this.newProductLine.descripcion) && !Utils.isEmpty(this.newProductLine.id_categoria)){
      this.status = 'sending';
      this.productsService.addLine(this.newProductLine).subscribe(res=>{
        this.status = 'sent';
        let t = setTimeout(()=>{
           this.onNoClick(res.id);
        },1000)
      }, err => {
        this.status = 'failed';
        console.log("Error occured");
      })
    }
  }

}