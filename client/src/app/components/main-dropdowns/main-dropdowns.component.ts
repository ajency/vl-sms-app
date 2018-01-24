import { Component, OnInit, EventEmitter, Input, Output , NgZone } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { ApiService } from '../../providers/api.service';

import { ActivatedRoute } from '@angular/router';
import { prettyUrlRoutes } from '../../app-routing.module';

@Component({
  selector: 'main-dropdowns',
  templateUrl: './main-dropdowns.component.html',
  styleUrls: ['./main-dropdowns.component.css']
})
export class MainDropdownsComponent {

  public tripid: string;
  public departureid: string;
  private frompage: string;

  @Output() onOutput = new EventEmitter<any>();
  @Output() onDepartures = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @Output() loadingParticipants = new EventEmitter<any>();

  public trips: Array<any> = [];
  public departures: Array<any> = [];
  public activeTrip: Array<{id: string, text: string}>; // reference for the trip select dropdown component

  public tripSub: any;
  public depSub: any;
  public dateFormat: string;

  public tripFromParent: boolean = false;
  public depFromParent: boolean = false;
  public departureError: string = '';
  public tripPlaceholder: string = "Hello there";

  public tripcode: string;

  constructor(private api: ApiService, private zone: NgZone, private platformlocation: PlatformLocation, private route: ActivatedRoute) {
    this.dateFormat = this.api.dateFormat;
   }

  ngOnInit() {
    this.frompage = this.route.routeConfig.path;
    // set flags to indicate if trip id & departure id are passed in from parent component
    let tripslug = this.route.snapshot.paramMap.get("trip_slug");

    this.route.queryParams.subscribe((params) => {
      console.log("trip_slug: ", tripslug);
      console.log("departure_id:", params["departure_id"]);

      if(tripslug){
        let slugelements = tripslug.split('-');
        if(slugelements.length >= 3){
          this.tripcode = slugelements[1];
          this.tripid = slugelements[slugelements.length - 1];
  
          console.log("trip code:" , this.tripcode, " trip id: ", this.tripid, this.route);
        }
      }

      if(params['departure_id']){
        this.departureid = params['departure_id'];
      }

    });


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
                            
                            this.trips = this.formatTrips(res.data);
                            console.log("trips ", this.trips);
                            
                            if(this._matchUrl('exact')){ // if this is default send-sms page navigation set the trip id to that of the 1st element in the array
                              // this.tripid = inittripid  ? inittripid : this.trips[0].id;
                              // this.activeTrip = [ this.trips[0] ];
                            }
                            else{
                              this.activeTrip = this._getActiveTrip(this.tripid);

                              // check if tripid passed in from url or otherwise is present in the trips array
                              // before fetching the departures array for the specified trip id
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

                            }
                            
                          },() => {
                            this.tripError = '';
                            // this.updateDepartures(this.departureid);
                          });
  }

  private _getActiveTrip(id: string): Array<any>{
    let actrip = [];
    this.trips.map((val) => {
      if(val.id == id){
        actrip.push(val);
      }
    });

    return actrip;
  }

  formatTrips(data){
    let trips = [];

    data.map((val) => {
      trips.push({
        id: val['id'],
        text: `${val['code']} - ${val['name']}`
      })
    });

    return trips;
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
      this.departureError = 'No trip specified';
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
        meta['id'] = val['id'];

        let txtparts = val['text'].split(' - ');
        meta['code'] = txtparts[0];
        meta['name'] = txtparts[1];
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
    if(this._matchUrl()){
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

  private _matchUrl(exact: string = ''){
    let match = false;
    if(exact === 'exact'){
      prettyUrlRoutes.map((val) => {
        if(this.frompage === val){
          match = true;
        }
      });
    }
    else{
      prettyUrlRoutes.map((val) => {
        if(this.frompage.indexOf(val) === 0){
          match = true;
        }
      });
    }
    return match;
  }

  refreshValue(data){
    console.log("refreshvalue:", data);
  }

  tripSelected(data){
    this.activeTrip = [data];
    this.tripid = data['id'];
    console.log("selected", data, this.activeTrip);
    this.updateDepartures()
  }

  removed(data){
    console.log("removed:", data);
  }

  typed(data){
    console.log("typed:", data);
  }

}
