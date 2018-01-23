import { Component, OnInit, EventEmitter, Input, Output , NgZone } from '@angular/core';
import { PlatformLocation } from '@angular/common';
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
  @Output() onDepartures = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @Output() loadingParticipants = new EventEmitter<any>();

  public trips: Array<any> = [];
  public departures: Array<any> = [];

  public tripSub: any;
  public depSub: any;
  public dateFormat: string;

  public tripFromParent: boolean = false;
  public depFromParent: boolean = false;
  public departureError: string = '';

  constructor(private api: ApiService, private zone: NgZone, private platformlocation: PlatformLocation) {
    // console.log("moment", Moment);
    this.dateFormat = this.api.dateFormat;
   }

  ngOnInit() {
    
    // set flags to indicate if trip id & departure id are passed in from parent component
    this.tripFromParent = this.tripid ? true : false;
    this.depFromParent = this.departureid ? true : false;

    console.log("main drops init:  from page: ", this.frompage, " tripid: ",this.tripFromParent, "departureid: ", this.depFromParent);

    this.updateTrips(this.tripid);
  }

  // ngOnChanges(){

  // }

  public disableDep: boolean = true;

  public tripError: string;

  updateTrips(inittripid: string = ''): void{ // gets the data for the 1st select dropdown for the list of trips
    if(this.tripSub){
      this.tripSub.unsubscribe();
    }
    this.tripError = '';
    this.tripSub = this.api.getTrips({}) 
                          .subscribe((res: any) => {
                            console.log("trips ", res);
                            this.trips = res.data;

                            if(this.frompage == 'send-sms' || this.frompage == 'sms-notifications'){ // if this is default send-sms page navigation set the trip id to that of the 1st element in the array
                              this.tripid = inittripid  ? inittripid : this.trips[0].id;
                            }
                            
                            let trip = this.trips.find(val => val.id == this.tripid);

                            console.log("found trip: ", trip);
                            if(trip){
                              this.onError.emit(this.tripError); // emit blank error
                            }
                            else{
                              this.tripError = "Could not find trip specified!";
                              this.tripid = '';
                              this.onError.emit(this.tripError);
                            }

                            this.updateDepartures(this.departureid);
                          },() => {
                            this.tripError = '';
                            this.updateDepartures(this.departureid);
                          });
  }

  updateDepartures(initdepid: string = ''): void{ // gets the data for the 2nd select dropdown for the departure
    this.departureid = '';
    this.departures = [];
    this.departureError = '';

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
                              
                              this.updateLocation('trip');
                            
                              this.onDepartures.emit(res);

                              // set local component departure error here
                              if(this.departures.length){
                                this.onError.emit('');
                              }
                              else{
                                this.departureid = ''; // set this because its n ng model
                                this.departureError = 'No departure found';
                                this.onError.emit(res.msg);
                              }

                              if(initdepid){
                                let vdep = this.departures.find( val => val.departure_id == initdepid);
                                console.log("found dep", vdep);
                                if(vdep){
                                  this.departureid = initdepid;
                                  this.onError.emit(this.departureError);
                                  this.triggerOutput(); // if departure id is passed in from parent component trigger the output event to load participant data
                                }
                                else{
                                  this.departureError = 'Invalid departure for selected trip';
                                  this.departureid = '';
                                  this.onError.emit(this.departureError);
                                }
                              }

                            });
    }
    else{
      this.departureid = ''; // set this because its n ng model
      this.departureError = 'No departure found';
    }
  }

  public participantSub: any;

  triggerOutput(){
    let oevent = {};

    oevent['trip_details'] = this.getTripMeta();
    oevent['dep_details'] = this.getDepMeta();

    console.log("triggerout dtatable", oevent)

    if(this.participantSub){
      this.participantSub.unsubscribe();
    }

    if(!this.departureid){
      console.warn("no departure id set");
      return;
    } 

    this.loadingParticipants.emit(true);

    this.participantSub = this.api.getParticipants(this.departureid)
                                  .subscribe((res: any) => {
                                    console.log("participants api respsonse:",res);
                                    oevent['response'] = res;
                                    
                                    // this.updateLocation('departure');
                                  
                                    this.onOutput.emit(oevent);
                                  },(err) => {
                                    oevent['response'] = err;
                                    this.onOutput.emit(oevent);
                                  });

  }

  getTripMeta(){
    let meta = {};
    this.trips.map((val) => {
      if(val.id == this.tripid){
        meta = val;
      }
    });
    return meta;
  }

  getDepMeta(){
    let meta = {};
    this.departures.map((val) => {
      if(val.departure_id == this.departureid){
        meta = val;
      }
    });
    return meta;
  }

  updateLocation(type: string){
    if(this.frompage.indexOf('send-sms') === 0){
      console.log("############################################## url update ", type , this.frompage);
      let tripmeta = this.getTripMeta();
      let depmeta = this.getDepMeta();

      switch(type){
        case 'trip': {  
                          if(!this.tripFromParent){
                            this.platformlocation
                                .pushState({tripid: this.tripid}, 'update tripid', `send-sms/trip-${tripmeta['code']}-${tripmeta['id']}`);
                          }else{
                            this.tripFromParent = false;
                          }
                      };break;
        case 'departure': {
                            if(!this.depFromParent){
                              this.platformlocation
                                .pushState({departureid: this.departureid}, 'update departureid', `send-sms/trip-${tripmeta['code']}-${tripmeta['id']}?departure_id=${depmeta['departure_id']}`);
                            }else{
                              this.depFromParent = false;
                            }
                            
                          };break;
      }
    }
  }

}
