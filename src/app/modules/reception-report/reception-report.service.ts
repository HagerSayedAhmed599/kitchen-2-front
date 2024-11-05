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
  // AddUpdatereceptionReport(event:any){
  //   return this.http.put(`${this.domain}ClientFile/AddPreparingReception`,event)
  // }
  AddUpdatereceptionReport(event:any){
    return this.http.put(`${this.domain}ClientFile/AddPreparingReception2`,event)
  }
  GetReceptionReportById(id:any){
    return this.http.get(`${this.domain}ClientFile/GetPreparingReception?clientFileId=${id}`)
  }
  GetReportReceptionReport(clientFileId,IsExcel=false){
    return this.http.get(`${this.domain}Report/GenerateRecieptionRequestReport?clientFileId=${clientFileId}&IsExcel=${IsExcel}`)
  }

  GetAllDiscreption(id: number): Observable<any> {
    return this.http.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
  GetAllGovernorate(id: number): Observable<any> {
    return this.http.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
  GetAllArea(id: number): Observable<any> {
    return this.http.get(`${this.domain}ClientFile/getstatusbyid?id=${id}`)
  }
  GetAllBuildingData(id: number): Observable<any> {
    return this.http.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
  GetAllServicesData(id: number): Observable<any> {
    return this.http.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
  GetAllOrderData(id: number): Observable<any> {
    return this.http.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
  sendConfirmation(query): Observable<any> {
    return this.http.post(`${this.domain}`,query);
  }
}
