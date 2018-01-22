import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable, DataTableResource } from '../../custom-data-table';
import { ApiService } from '../../providers/api.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  public passengerResource;
  participants = [];
  public participantCount = 0;

  @ViewChild(DataTable) carsTable: DataTable;

  public tripCode: string;
  public tripId: string;
  public departureId: string;

  public participantsAvailable: boolean = false;

  public tripDetails: any = {};
  public depDetails: any = {};
  public naText: string = '--';
  public dateFormat: string;
  public errorMessage: string;

  public loadingParticipants: boolean = false;

  constructor(public route: ActivatedRoute, private api: ApiService, private element: ElementRef, private router: Router) {
    this.dateFormat = this.api.dateFormat;

    console.log("element:", element);
  }



  ngOnInit() {
    this.updateRows = this.updateRows.bind(this);

    let tripslug = this.route.snapshot.paramMap.get("trip_slug");

    this.route.queryParams.subscribe((params) => {
      console.log("trip_slug: ", tripslug);
      console.log("departure_id:", params["departure_id"]);

      if(tripslug){
        let slugelements = tripslug.split('-');
        if(slugelements.length >= 3){
          this.tripCode = slugelements[1];
          this.tripId = slugelements[slugelements.length - 1];
  
          console.log("trip code:" , this.tripCode, " trip id: ", this.tripId, this.route);
        }
      }

      if(params['departure_id']){
        this.departureId = params['departure_id'];
        // this.initDatatable({});
      }

    });


  }

  setParticipantLoader(){
    this.participantsAvailable = false;
    this.passengerResource = new DataTableResource([]);
    this.loadingParticipants = true;
  }

  initDatatable(event: any = {}){
    if(event.response.data && event.response.data.length){
      this.errorMessage = '';

      this.passengerResource = new DataTableResource(event.response.data);
      // this.passengerResource.count().then(count => this.participantCount = count);
      this.reloadItems({});
      
      this.tripDetails = event['trip_details'];
      this.depDetails = event['dep_details'];

      this.participantsAvailable = true;

    }
    else{
      this.errorMessage = event.response.msg || 'An error occured!';
    }

    this.loadingParticipants = false;
  }

  checkDepartureError(event){
    if(event && event.data.length){
      this.errorMessage = '';
    }
    else{
      this.errorMessage = event.msg;
    }
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

      // if (passenger.redundant) {
      //   passenger.disabled = true; //disable the checkbox for a row without mobile from self
      //   return 'rgba(0, 0, 0, 0.1)';
      // }
  }

  public checkUpdate: boolean = true; // trigger change detection in send-sms-component

  rowClick(event){
    event.row.selected = !event.row.selected;
    event.row.item.selected = event.row.selected;
    console.log("row event", event.row);

    this.checkUpdate = !this.checkUpdate;
  }

  headerClick(event){
    // console.log("header click event", event);
  }

  onSelectChange(event){
    console.log("onSelectChange", event);

    this.participants.map((val) => {
      val.selected = event.checked;
    });

    this.checkUpdate = !this.checkUpdate;
  }

  sendSMS(event){
    console.log("sms clients ", event);
  }

}
