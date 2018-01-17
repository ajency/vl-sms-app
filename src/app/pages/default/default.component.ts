import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTable, DataTableResource } from '../../custom-data-table';
import { passengers } from './data';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  private passengerResource;
  passengers = [];
  public passengerCount = 0;

  @ViewChild(DataTable) carsTable: DataTable;

  constructor() {
    
  }

  ngOnInit() {

  }

  private showParticipants: boolean = false;

  initDatatable(){
    console.log("init dtatable")
    this.passengerResource = new DataTableResource(passengers);

    this.rowColors = this.rowColors.bind(this);

    this.passengerResource.count().then(count => this.passengerCount = count);

    this.showParticipants = true;
  }

  reloadCars(params) {
    console.log("reload cars",params)
      this.passengerResource.query(params).then(cars => this.passengers = cars);
  }

  // custom features:
  carClicked(car) {
      alert(car.model);
  }

  yearLimit = 1999;

  rowColors(car) {
      if (car.year >= this.yearLimit) return 'rgb(255, 255, 197)';
  }

  rowClick(event){
    console.log("row event", event);
  }

  sendSMS(event){
    console.log("passengers", this.passengers, event);
  }

}
