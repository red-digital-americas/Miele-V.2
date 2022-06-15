import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';



@Component({
  selector: 'image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements OnInit {

  constructor( 
                public dialogRef: MatDialogRef<ImageDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
  }


}