import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'main-dropdowns',
  templateUrl: './main-dropdowns.component.html',
  styleUrls: ['./main-dropdowns.component.css']
})
export class MainDropdownsComponent {

  @Input() frompage: string;
  @Output() onOutput = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log("from page:", this.frompage);
  }

  triggerOutput(){
    this.onOutput.emit({});
  }

}
