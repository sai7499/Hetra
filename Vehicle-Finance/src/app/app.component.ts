import { Component, OnInit } from '@angular/core';

import { DraggableContainerService } from '@services/draggable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'vehicle-finance';
  showDraggableContainer: {
    imageUrl: string;
    imageType: string;
  };
  setCss = {
    top: '',
    left: '',
  };

  constructor(private draggableContainerService: DraggableContainerService) {}

  ngOnInit() {
    this.draggableContainerService
      .getContainerValue()
      .subscribe((value: any) => {
        if (!value) {
          return;
        }
        this.showDraggableContainer = value.image;
        this.setCss = value.css;
      });
    document.addEventListener('backbutton', () => {
      navigator['app'].exitApp();
    });

    document.addEventListener(
      'offline',
      () => {
        alert('No internet connection');
      },
      false
    );
  }
}
