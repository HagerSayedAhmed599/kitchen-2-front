import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReceptionReportService {
  domain: string = env.apiUrl;

  constructor(private http:HttpClient) { }
  getReceptionReport(){
    return this.http.get(`${this.domain}ClientFile/GetAllPreparingReception`)
  }
  AddUpdatereceptionReport(event:any){
    return this.http.put(`${this.domain}ClientFile/AddPreparingReception`,event)
  }
  GetReceptionReportById(id:any){
    return this.http.get(`${this.domain}ClientFile/GetPreparingReception?clientFileId=${id}`)
  }
  GetReportReceptionReport(clientFileId,IsExcel=false){
    return this.http.get(`${this.domain}Report/GenerateRecieptionRequestReport?clientFileId=${clientFileId}&IsExcel=${IsExcel}`)
  }

  GetAllDiscreption(): Observable<any> {
    return this.http.get(`${this.domain}`)
  }
  GetAllGovernorate(): Observable<any> {
    return this.http.get(`${this.domain}`)
  }
  GetAllArea(): Observable<any> {
    return this.http.get(`${this.domain}`)
  }
  GetAllBuildingData(): Observable<any> {
    return this.http.get(`${this.domain}`)
  }
  GetAllServicesData(): Observable<any> {
    return this.http.get(`${this.domain}`)
  }
  GetAllOrderData(): Observable<any> {
    return this.http.get(`${this.domain}`)
  }
}
