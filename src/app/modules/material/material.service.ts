import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

}
