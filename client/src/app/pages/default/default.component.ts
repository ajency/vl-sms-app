import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable, DataTableResource } from '../../components/custom-data-table';
import { ApiService } from '../../providers/api.service';
import { AppService } from '../../providers/app.service';
import { globals } from '../../app.global';

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

  public activeStatus: any;
  public statuses = [{id: "confirmed", text: 'Confirmed'} , {id:"pending_confirmation", text: "Pending confirmation" }, {id: "pending_inquiry", text: "Pending Inquiry"}, {id: "cancelled", text: 'Cancelled'}, {id: "rejected", text: "Rejected"}, {id: "unconfirmed", text: "Unconfirmed"}, {id: "incomplete", text: "Incompleted" }, {id: "cart_abandoned", text: "Cart abandoned" } ];

  public loadingParticipants: boolean = false;

  constructor(private api: ApiService, private element: ElementRef, private router: Router, private app: AppService) {
    this.dateFormat = this.api.dateFormat;

    console.log("element:", element);
  }



  ngOnInit() {
    this.updateRows = this.updateRows.bind(this);
  }

  setParticipantLoader(){
    this.participantsAvailable = false;
    this.passengerResource = new DataTableResource([]);
    this.loadingParticipants = true;
  }

  initDatatable(event: any = {}){

    console.log("initdatatable:",event);
    this.departureId = event['dep_details'] ? event['dep_details']['departure_id'] : '';

    if(event.response && event.response.data){

      if(event.response.data.length){
        // this.activeStatus = [];

        this.errorMessage = '';

        this.passengerResource = new DataTableResource(this.app.filterParticipants(event.response.data));
        // this.passengerResource.count().then(count => this.participantCount = count);
        this.statusRemoved();

        this.tripDetails = event['trip_details'];
        this.depDetails = event['dep_details'];  
        this.participantsAvailable = true;
      }
      else{
        this.errorMessage = 'No Data!';  
      }
    }
    else if(typeof event.response === 'string'){
      this.errorMessage = globals.serverErrMsg;
    }
    else{
      // this.errorMessage = event.response.msg || 'An error occured!';
      this.errorMessage = "No participants found for departure!";
    }

    this.loadingParticipants = false;
  }

  checkError(error){
    this.errorMessage = error;
  }

  reloadItems(params) {
    console.log("reload cars",params)
    this.passengerResource.query(params).then((data) => {
      this.participants = data;
      this.participantCount = data.length;
    });
  }

  public statusFilter = "";
  public filterStatus(status){
    this.activeStatus = [status];
    this.statusFilter = status.id;
    this.reloadItems({});
  }

  public statusRemoved(){
    this.activeStatus = [];
    this.statusFilter = "";
    this.reloadItems({});
  }
  
  updateRows(passenger,event) {
    if(this.statusFilter){
      return passenger.booking_status !== this.statusFilter ? {'d-none': true} : {};
    }
    else{
      return {}
    }
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

  logOut(event){
    this.app.logout();
  }

  // getConfirmedClass(str: string){
  //   return str.match(/confirmed/i) ? true : false;
  // }

}
