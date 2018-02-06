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
  public smsParticipants: Array<any> = [];
  public participantCount = 0;

  @ViewChild(DataTable) passengerTable: DataTable;

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
  public statuses = [];

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


    if(event.response && event.response.data){

      if(event.response.data.length){

        this.departureId = event['dep_details'] ? event['dep_details']['departure_id'] : '';
        this.tripId = event['trip_details'] ? event['trip_details']['id'] : '';
        // this.activeStatus = [];

        this.errorMessage = '';

        let participants = this.app.filterParticipants(event.response.data);

        this.statuses = this.app.getStatuses(participants);
        
        console.log("sttusee", this.statuses);

        this.passengerResource = new DataTableResource(participants);
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
    this.smsParticipants = [];
    this.passengerResource.query(params).then((data) => {
      this.participants = data;
      this.participantCount = data.length;
    });

    setTimeout(() => {
      this.passengerTable.setSelect(false);
    },0);

  }

  reloadComplete(params){
    console.log("reload complete:", params);
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
  


  updateRows(passenger,event): any {
    // console.log("update ros:", this.statusFilter)
    if(this.statusFilter && this.statusFilter !== 'all'){
      if(passenger.booking_status !== this.statusFilter){
        this._setfilteredout(passenger, true);
        return {'d-none': true};
      }
      else{
        this._setfilteredout(passenger, false);
        return {};
      }
    }
    else{
      this._setfilteredout(passenger, false);
      return {}
    }
  }

  private _setfilteredout(passenger, filteredout: boolean){
    passenger.filteredout = filteredout;
    return passenger;
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
