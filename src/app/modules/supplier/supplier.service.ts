import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  domain: string = env.apiUrl;

  constructor(private _HttpClient: HttpClient) { }

  GetAllSupplierData(query:any): Observable<any> {
    console.log(query);
    let value:any = {}
    for (const key in query) {
      if (query[key] != null) {
        value[key] = query[key]
      }
    }
    return this._HttpClient.get(`${this.domain}supplier/GetAllclients` , {params:value})
  }

  AddSupllier(event: any) {
    return this._HttpClient.post(`${this.domain}supplier/Addclients`,event);
  }
  updateSupplier(clientId: number, body:FormGroup,) {
    return this._HttpClient.put(`${this.domain}supplier/Updateclients?clientId=${clientId}`,body);
  }
  getSupplierById(id: any) {
    return this._HttpClient.get(`${this.domain}supplier/GetclientsById?id=${id}`);
  }
  DeleteSupplier(id: number){
    return this._HttpClient.get(`${this.domain}supplier/Deleteclients?id=${id}`)
  }
}
