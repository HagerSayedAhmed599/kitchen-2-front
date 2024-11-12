import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {
  domain: string = env.apiUrl;

  constructor(private _HttpClient: HttpClient) { }
  GetAllRatingData(id: number): Observable<any> {
    return this._HttpClient.get(
      `${this.domain}StatusCategory/GetStatusCategoryById/${id}`
    );
  }

  GetAllWarehousesData(query:any): Observable<any> {
    console.log(query);
    let value:any = {}
    for (const key in query) {
      if (query[key] != null) {
        value[key] = query[key]
      }
    }
    return this._HttpClient.get(`${this.domain}invoice/GetAllInvoices` , {params:value})
  }

  AddWarehouses(event: any) {
    return this._HttpClient.post(`${this.domain}invoice/AddInvoice`,event);
  }
  updateWarehouses(clientId: number, body:FormGroup,) {
    return this._HttpClient.put(`${this.domain}invoice/UpdateInvoice?clientId=${clientId}`,body);
  }
  getWarehousesById(id: any) {
    return this._HttpClient.get(`${this.domain}invoice/GetInvoiceById?id=${id}`);
  }
  DeleteWarehouses(id: number){
    return this._HttpClient.get(`${this.domain}invoice/DeleteInvoice?id=${id}`)
  }

}
