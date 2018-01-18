import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    console.log("tripId", this.route.snapshot.paramMap.get("trip_id"));
  }

  private showParticipants: boolean = false;

  initDatatable(){
    console.log("init dtatable")

    this.passengerResource = new DataTableResource(passengers);

    this.rowColors = this.rowColors.bind(this);

    this.passengerResource.count().then(count => this.passengerCount = count);

    this.showParticipants = true;
    // setTimeout((function() {
    //   document.querySelector('[data-toggle="tooltip"]').tooltip();
    // }), 800);
    
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

  rowColors(passenger,event) {
      // console.log('rowcolor:', passenger,event);

      if (passenger.redundant) {
        passenger.disabled = true; //disable the checkbox for a row without mobile from self
        // return 'rgba(0, 0, 0, 0.1)';
      }
  }

  rowClick(event){
    console.log("row event", event);
  }

  sendSMS(event){
    console.log("passengers", this.passengers, event);
  }

}
