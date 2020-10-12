import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

import { DraggableContainerService } from '@services/draggable.service';

@Component({
  selector: 'app-draggable-container',
  templateUrl: './draggable-container.component.html',
  styleUrls: ['./draggable-container.component.css'],
})
export class DraggableComponent implements OnInit {
  windowState = 'default';
  isMobile: any;
  imageType: string;
  src;
  fileName: string;
  height = 600;
  width = 600;
  public windowTop = 200;
  public windowLeft = 200;
  @Input() setCss = {
    top: '50%',
    left: '50%',
  };
  @Input() set imageUrl(value) {
    if (!!value) {
      this.imageType = value.imageType;
      this.fileName = value.name;
      if (this.imageType === 'jpeg' || this.imageType === 'png') {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpeg;base64,' + value.imageUrl
        );
      } else if (this.imageType === 'pdf') {
        // this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
        //   'data:application/pdf;base64,' + value.imageUrl
        // );
        const blob = this.base64ToBlob( value.imageUrl, 'application/pdf' );
        const url = URL.createObjectURL( blob );
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else if (this.imageType === 'xls') {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:application/vnd.ms-excel;base64' + value.imageUrl
        );
        // console.log('this.src', this.src);
      } else if (this.imageType.includes('doc')) {
        // application/vnd.openxmlformats-officedocument.wordprocessingml.document
        // 'application/msword'
        const blob = this.base64ToBlob( value.imageUrl,  'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        const url = URL.createObjectURL( blob );
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
      // console.log('setCss', this.setCss);
      // setTimeout(() => {
      //   this.dragElement(document.getElementById('mydiv'));
      // });
    }
  }
  constructor(private sanitizer: DomSanitizer,
              private draggableContainerService: DraggableContainerService,
              private location: Location) {
    this.isMobile = environment.isMobile;
  }

  


  overSizePdf() {

  }

  base64ToBlob(base64, type = 'application/octet-stream') {
    const binStr = atob( base64 );
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[ i ] = binStr.charCodeAt( i );
    }
    return new Blob( [ arr ], { type} );
  }

  ngOnInit() {
    const currentUrl = this.location.path();
    this.location.onUrlChange((url: string) => {
      if (this.isMobile && !url.includes('document-viewupload')) {
        this.src = null;
      }
    });
    this.setCss = {
      top: window.innerHeight / 2 + 'px',
      left: '50%',
    };

    if (this.isMobile) {
      const height = screen.availHeight;
      this.height = height - ((height / 100 ) * 15);
      this.width = screen.availWidth;
    } else {
      this.windowLeft = ( screen.availWidth / 2) - 600;
      this.windowTop = screen.availHeight / 2;
    }
  }
  // private dragElement(elmnt) {
  //   let pos1 = 0;
  //   let pos2 = 0;
  //   let pos3 = 0;
  //   let pos4 = 0;
  //   if (document.getElementById(elmnt.id + 'mydiv')) {
  //     // if present, the header is where you move the DIV from:
  //     document.getElementById(elmnt.id + 'mydiv').onmousedown = dragMouseDown;
  //   } else {
  //     // otherwise, move the DIV from anywhere inside the DIV:
  //     elmnt.onmousedown = dragMouseDown;
  //   }

  //   function dragMouseDown(e) {
  //     e = e || window.event;
  //     e.preventDefault();
  //     // get the mouse cursor position at startup:
  //     pos3 = e.clientX;
  //     pos4 = e.clientY;
  //     document.onmouseup = closeDragElement;
  //     // call a function whenever the cursor moves:
  //     document.onmousemove = elementDrag;
  //   }

  //   function elementDrag(e) {
  //     e = e || window.event;
  //     e.preventDefault();
  //     // calculate the new cursor position:
  //     pos1 = pos3 - e.clientX;
  //     pos2 = pos4 - e.clientY;
  //     pos3 = e.clientX;
  //     pos4 = e.clientY;
  //     // set the element's new position:
  //     elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
  //     elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
  //   }

  //   function closeDragElement() {
  //     // stop moving when mouse button is released:
  //     document.onmouseup = null;
  //     document.onmousemove = null;
  //   }
  // }

  onClose() {
    this.src = null;
    this.draggableContainerService.removeImage(this.fileName);
  }

  // ngOnDestroy() {
  //   if (this.isMobile) {
  //     this.src = null;
  //   }
  // }

}
