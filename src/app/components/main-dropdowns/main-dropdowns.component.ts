import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
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

  constructor(private api: ApiService) { }

  ngOnInit() {
    console.log("from page:", this.frompage);

    this.api.getTrips({})
            .subscribe((res: any) => {
              console.log("trips ", res);

              this.trips = res.data;
            });
  }

  ngOnChanges(){
    if(this.tripid){
      this.api.getDepartures(this.tripid,{
                          filters: {
                                  trip_id: "234",
                                  departure_date: {
                                    start: '2017-01-01',
                                    end: '2017-01-02'
                                  } 
                          }
              })
              .subscribe((res) => {
                console.log("depatures", res)
              });
    }
  }

  triggerOutput(){
    this.onOutput.emit({});
  }

}
