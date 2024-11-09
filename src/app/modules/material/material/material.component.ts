import { Component } from '@angular/core';
import { MaterialService } from '../material.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent {
  rating: any;
  units: any;
  origin: any;
  tax: any;
  constructor(private materialService: MaterialService) {}
  ngOnInit(): void {
    this.getAllRatingData();
    this.getAllUnitsData();
    this.getAllOriginData();
    this.getAllTaxData();
    }

    getAllRatingData() {
      this.materialService.GetAllRatingData(314).subscribe(data => {
        this.rating = data.data.statuses
      })
    }

  getAllUnitsData() {
    this.materialService.GetAllUnitsData(315).subscribe(data => {
      this.units = data.data.statuses
    })
  }

  getAllOriginData() {
    this.materialService.GetAllOriginData(317).subscribe(data => {
      this.origin = data.data.statuses
    })
  }

  getAllTaxData() {
    this.materialService.GetAllTaxData(318).subscribe(data => {
      this.tax = data.data.statuses
    })
  }
}
