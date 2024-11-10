import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {
  domain: string = env.apiUrl;

  constructor(private http: HttpClient) { }
  GetAllRatingData(id: number): Observable<any> {
    return this.http.get(
      `${this.domain}StatusCategory/GetStatusCategoryById/${id}`
    );
  }
  purchaseData(event: any) {
    return this.http.put(
      `${this.domain}ClientFile/purchaseData`,
      event
    );
  }

}
