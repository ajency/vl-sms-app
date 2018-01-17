import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTable, DataTableResource } from '../../custom-data-table';
import { cars } from './data';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  private carResource = new DataTableResource(cars);
  cars = [];
  public carCount = 0;

  @ViewChild(DataTable) carsTable: DataTable;

  constructor() { 

    this.rowColors = this.rowColors.bind(this);

    this.carResource.count().then(count => this.carCount = count);
  }

  ngOnInit() {
  }

  reloadCars(params) {
      this.carResource.query(params).then(cars => this.cars = cars);
  }

  // custom features:
  carClicked(car) {
      alert(car.model);
  }

  yearLimit = 1999;

  rowColors(car) {
      if (car.year >= this.yearLimit) return 'rgb(255, 255, 197)';
  }

}
