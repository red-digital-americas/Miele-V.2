import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { producto, linea, subLinea } from '../../models/producto';
import { Utils } from '../../utils/utils';
import { ProductsService } from '../../services/products.service';
import { cat_tipos_herencia } from '../../models/promocion';
import { timeout } from 'q';



@Component({
  selector: 'dialog-edit-subline',
  templateUrl: './edit-sublinea.component.html',
  styleUrls: ['./edit-sublinea.component.css']
})
export class EditProductSublineComponent implements OnInit {
  
  public prod = new producto();
  public lines:linea[] = [];
  public subLines:linea[] = [];
  public status: string = 'init';
  public newProductLine:subLinea = {id:0, descripcion:'', status:true, lineaID:0 };
  

  constructor( 
                public snackBar: MatSnackBar, 
                public dialog: MatDialog, 
                private productsService:ProductsService,
                public dialogRef: MatDialogRef<EditProductSublineComponent>,
                @Inject(MAT_DIALOG_DATA) public data:any
                ) { }

  ngOnInit() {
    this.getLines();
    this.newProductLine.lineaID = !Utils.isEmpty(this.data)? this.data : 0;
  }


  onNoClick(id?:number): void {
    id = Utils.getValue(id,0);
    this.dialogRef.close({status:this.status, id:id, lineaID: this.newProductLine.lineaID});
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
   * Function that opens the AddLine modal
   */
  addLine(){

    if(!Utils.isEmpty(this.newProductLine.descripcion) && !Utils.isEmpty(this.newProductLine.lineaID)){
      this.status = 'sending';
      this.productsService.addSubLine(this.newProductLine).subscribe(res=>{
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

