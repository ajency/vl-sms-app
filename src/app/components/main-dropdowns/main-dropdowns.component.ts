import { Component, OnInit, EventEmitter, Input, Output , NgZone } from '@angular/core';
// import * as Moment from 'angular2-moment';
import { ApiService } from '../../providers/api.service';


@Component({
  selector: 'main-dropdowns',
  templateUrl: './main-dropdowns.component.html',
  styleUrls: ['./main-dropdowns.component.css']
})
export class MainDropdownsComponent {

  @Input() tripid: string;
  @Input() departureid: string;
  @Input() frompage: string;

  @Output() onOutput = new EventEmitter<any>();

  private trips: Array<any> = [];
  private departures: Array<any> = [];

  private tripSub: any;
  private depSub: any;
  private dateFormat: string;

  constructor(private api: ApiService, private zone: NgZone) {
    // console.log("moment", Moment);
    this.dateFormat = this.api.dateFormat;
   }

  ngOnInit() {
    console.log("from page:", this.frompage, this.tripid);

    this.updateTrips(this.tripid);
    this.updateDepartures(this.departureid);
  }

  // ngOnChanges(){

  // }

  private disableDep: boolean = true;
  updateTrips(inittripid: string = ''): void{ // gets the data for the 1st select dropdown for the list of trips
    if(this.tripSub){
      this.tripSub.unsubscribe();
    }

    this.tripSub = this.api.getTrips({}) 
                          .subscribe((res: any) => {
                            console.log("trips ", res);
                            this.trips = res.data;
                            // this.tripid = inittripid  ? inittripid : this.trips[0].id;
                            this.tripid = inittripid  ? inittripid : '';
                          });
  }

  updateDepartures(initdepid: string = ''): void{ // gets the data for the 2nd select dropdown for the departure
    this.departureid = '';
    this.departures = [];
    if(this.tripid){ 
      if(this.depSub){
        this.depSub.unsubscribe();
      }

      this.depSub = this.api.getDepartures({
                                        filters: {
                                                trip_id: this.tripid,
                                                departure_date: {
                                                  start: '2017-01-01',
                                                  // end: '2017-01-02'
                                                } 
                                        }
                            })
                            .subscribe((res: any) => {
                              console.log("depatures", res);
                              this.departures = res.data;
                              // this.departureid = initdepid ? initdepid : this.departures[0].departure_id;
                              this.departureid = initdepid ? initdepid : '';
                            });
    }
  }

  triggerOutput(){
    let oevent = {};

    this.trips.map((val) => {
      if(val.id == this.tripid){
        oevent['trip_details'] = val;
      }
    })

    this.departures.map((val) => {
      if(val.departure_id == this.departureid){
        oevent['dep_details'] = val;
      }
    })

    oevent['departure_id'] = this.departureid;

    this.onOutput.emit(oevent);
  }

}
