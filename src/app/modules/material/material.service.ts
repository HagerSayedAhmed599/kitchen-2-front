import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  domain: string = env.apiUrl;

  constructor(private http: HttpClient) { }

  GetAllRatingData(id: number): Observable<any> {
    return this.http.get(
      `${this.domain}StatusCategory/GetStatusCategoryById/${id}`
    );
  }

  GetAllUnitsData(id: number): Observable<any> {
    return this.http.get(
      `${this.domain}StatusCategory/GetStatusCategoryById/${id}`
    );
  }
  GetAllOriginData(id: number): Observable<any> {
    return this.http.get(
      `${this.domain}StatusCategory/GetStatusCategoryById/${id}`
    );
  }

  GetAllTaxData(id: number): Observable<any> {
    return this.http.get(
      `${this.domain}StatusCategory/GetStatusCategoryById/${id}`
    );
  }

  GetAllMaterialData(query:any): Observable<any> {
    console.log(query);
    let value:any = {}
    for (const key in query) {
      if (query[key] != null) {
        value[key] = query[key]
      }
    }
    return this.http.get(`${this.domain}Inv_Items/GetAllinvItems` , {params:value})
  }

  AddMaterial(event: any) {
    return this.http.post(`${this.domain}Inv_Items/AddinvItems`,event);
  }
  updateMaterial(clientId: number, body:FormGroup,) {
    return this.http.put(`${this.domain}Inv_Items/UpdateinvItems?clientId=${clientId}`,body);
  }
  getMaterialById(id: any) {
    return this.http.get(`${this.domain}Inv_Items/GetinvItemseById?id=${id}`);
  }
  DeleteMaterial(id: number){
    return this.http.get(`${this.domain}Inv_Items/deleteinvitem?id=${id}`)
  }

}
