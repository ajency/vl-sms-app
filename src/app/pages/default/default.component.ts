import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTable, DataTableResource } from '../../custom-data-table';
// import { participants } from './data';
import { ApiService } from '../../providers/api.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  private passengerResource;
  participants = [];
  public participantCount = 0;

  @ViewChild(DataTable) carsTable: DataTable;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    
  }

  ngOnInit() {
    console.log("tripId", this.route.snapshot.paramMap.get("trip_id"));

  }

  private participantsAvailable: boolean = false;

  initDatatable(){
    console.log("init dtatable")

    this.api.getParticipants("2").subscribe((res: any) => {
      console.log("participants api respsonse:",res);

      this.passengerResource = new DataTableResource(res.data);
      this.updateRows = this.updateRows.bind(this);
      // this.passengerResource.count().then(count => this.participantCount = count);
      this.reloadItems({});

      this.participantsAvailable = true;

    },(err) => {
      console.warn("Error", err)
    });
    // setTimeout((function() {
    //   document.querySelector('[data-toggle="tooltip"]').tooltip();
    // }), 800);
    
  }

  reloadItems(params) {
    console.log("reload cars",params)
    this.passengerResource.query(params).then((data) => {
      this.participants = data;
      this.participantCount = data.length;
    });
  }

  // custom features:
  carClicked(car) {
      alert(car.model);
  }

  yearLimit = 1999;

  updateRows(passenger,event) {
      // console.log('rowcolor:', passenger,event);

      if (passenger.redundant) {
        // passenger.disabled = true; //disable the checkbox for a row without mobile from self
        // return 'rgba(0, 0, 0, 0.1)';
      }
  }

  rowClick(event){
    console.log("row event", event);
  }

  sendSMS(event){
    console.log("participants", this.participants, event);
  }

}
