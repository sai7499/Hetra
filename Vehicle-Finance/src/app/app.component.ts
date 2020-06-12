import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'vehicle-finance';

  ngOnInit() {
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
