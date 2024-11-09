import { Component, OnInit } from '@angular/core';
import { WarehousesService } from '../warehouses.service';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit{

  constructor(private warehousesService: WarehousesService){}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


}
