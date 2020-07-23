import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnInit {
  @Input() title: string;
  constructor() { }

  ngOnInit() {
  }
  onClick(event: any) {
    const element = event.target;
    console.log(element);
    element.classList.toggle('active');
    console.log(element.style);
    const panel = element
     .nextElementSibling;
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else if (panel.style == null) {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';
    }
  }
}
