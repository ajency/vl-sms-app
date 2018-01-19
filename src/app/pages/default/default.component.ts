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

  private dateFormat: string;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.dateFormat = this.api.dateFormat;
  }

  private tripCode: string;
  private tripId: string;
  private departureId: string;

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
        this.initDatatable();
      }

    });


  }

  private participantsAvailable: boolean = false;
  private participantSub: any;
  private tripDetails: any;
  private depDetails: any;

  initDatatable(event: any = {}){
    console.log("init dtatable", event)

    if(this.participantSub){
      this.participantSub.unsubscribe();
    }

    this.departureId = event['departure_id'] ? event['departure_id'] : this.departureId;

    if(!this.departureId){
      console.warn("no departure id set");
      return;
    } 

    this.participantSub = this.api.getParticipants(this.departureId)
                                  .subscribe((res: any) => {
                                    console.log("participants api respsonse:",res);
                                    if(res.data.length){
                                      this.passengerResource = new DataTableResource(res.data);
                                      // this.passengerResource.count().then(count => this.participantCount = count);
                                      this.reloadItems({});
                                      
                                      this.tripDetails = event['trip_details'];
                                      this.depDetails = event['dep_details'];

                                      this.participantsAvailable = true;
                                    }
                                    else{
                                      this.passengerResource = new DataTableResource(res.data);
                                      this.participantsAvailable = false;

                                    }
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

      // if (passenger.redundant) {
      //   passenger.disabled = true; //disable the checkbox for a row without mobile from self
      //   return 'rgba(0, 0, 0, 0.1)';
      // }
  }

  rowClick(event){
    console.log("row event", event);
  }

  sendSMS(event){
    console.log("participants", this.participants, event);
  }

}
