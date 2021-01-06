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
  value: any;
  @Input() set imageUrl(value) {
      if (!!value) {
        this.value = value;
        this.imageType = value.imageType;
        this.fileName = value.name;
        if (this.imageType === 'jpeg' || this.imageType === 'png') {
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/jpeg;base64,' + value.imageUrl
          );
        } else if (this.imageType === 'pdf') {
          const blob = this.base64ToBlob( value.imageUrl, 'application/pdf' );
          const url = URL.createObjectURL( blob );
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        } else if (this.imageType === 'xls') {
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
            'data:application/vnd.ms-excel;base64' + value.imageUrl
          );
        } else if (this.imageType.includes('doc')) {
          const blob = this.base64ToBlob( value.imageUrl,  'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          const url = URL.createObjectURL( blob );
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
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
      this.windowLeft = ( screen.availWidth / 2) - (this.width / 2);
      this.windowTop = screen.availHeight / 2;
      console.log('this.windowLeft', this.windowLeft);
      console.log('this.windowTop', this.windowTop);
    }
  }

  onMinimize() {
    console.log('on minimize');
    this.draggableContainerService.addMinimizeList(this.value);
    this.onClose();
  }


  onClose() {
    this.src = null;
    this.draggableContainerService.removeImage(this.fileName);
  }

}
