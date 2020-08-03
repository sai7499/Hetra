import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-draggable-container',
  templateUrl: './draggable-container.component.html',
  styleUrls: ['./draggable-container.component.css'],
})
export class DraggableComponent implements OnInit {
  imageType: string;
  src;
  @Input() setCss = {
    top: '50%',
    left: '50%',
  };
  @Input() set imageUrl(value) {
    if (!!value) {
      this.imageType = value.imageType;
      if (this.imageType === 'jpeg' || this.imageType === 'png') {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpeg;base64,' + value.imageUrl
        );
      } else if (this.imageType === 'pdf') {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:application/pdf;base64,' + value.imageUrl
        );
      } else if (this.imageType === 'xls') {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:application/vnd.ms-excel;base64' + value.imageUrl
        );
        console.log('this.src', this.src);
      }
      console.log('setCss', this.setCss);
      setTimeout(() => {
        this.dragElement(document.getElementById('mydiv'));
      });
    }
  }
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.setCss = {
      top: window.innerHeight / 2 + 'px',
      left: '50%',
    };
  }
  private dragElement(elmnt) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    if (document.getElementById(elmnt.id + 'mydiv')) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + 'mydiv').onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  onClose() {
    this.src = null;
  }
}
