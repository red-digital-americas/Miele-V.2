import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';



@Component({
  selector: 'image-detail',
  templateUrl: './image-detail.components.html',
  styleUrls: ['./image-detail.components.css']
})
export class ImageDetailComponents implements OnInit {

  constructor( 
                public dialogRef: MatDialogRef<ImageDetailComponents>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
  }


}
