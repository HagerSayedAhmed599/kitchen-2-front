import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { environment as env } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QuotationsService {
  domain: string = env.apiUrl;

  constructor(private _HttpClient: HttpClient) { }

  GetShortClientFiles(query:any): Observable<any> {
    console.log(query);

    let value:any = {}
    for (const key in query) {
      if (query[key] != null) {
        value[key] = query[key]
      }
    }
    return this._HttpClient.get(`${this.domain}ClientFile/GetShortClientFiles` , {params:value})
  }
  AddClientFile(body:FormGroup): Observable<any> {
    return this._HttpClient.post(`${this.domain}ClientFile/AddClientFile`,body)
  }
  EditClientFile(body:FormGroup, id: number): Observable<any> {
    return this._HttpClient.put(`${this.domain}ClientFile/UpdateClientFile/${id}`,body)
  }
  GetStatusCategoryById(id: number): Observable<any> {
    return this._HttpClient.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
  GetAllUsersApi(): Observable<any> {
    return this._HttpClient.get(`${this.domain}Users/GetAllUsers`)
  }
  GetClientFileByIdApi(id: number): Observable<any> {
    return this._HttpClient.get(`${this.domain}ClientFile/GetClientFileById/${id}`)
  }
  LoadPriceOffer(): Observable<any> {
    return this._HttpClient.get(`${this.domain}ClientFile/LoadPriceOffer`)
  }

  LoadPriceOfferVersion2(): Observable<any> {
    return this._HttpClient.get(`${this.domain}ClientFile/LoadPriceOffer2`)
  }
  LoadPriceForUnits(data :any){
    return this._HttpClient.post(`${this.domain}ClientFile/LoadPriceForUnits`,data)
  }
  GetUnitsItemsbyCategory(): Observable<any> {
    return this._HttpClient.get(`${this.domain}StatusCategory/GetUnitsItemsbyCategory`)
  }
  AddClientFileAttachment(value:any): Observable<any> {
    const formData = new FormData();
    for (const key in value) {
      if (value[key]) {
        formData.append(key, value[key])
      }
    }
    return this._HttpClient.put(`${this.domain}ClientFileAttachment/AddClientFileAttachment?clientFileId=${value.clientFileId}`,formData)
  }
  DeleteClientFileAttachment(value:any){
    return this._HttpClient.delete(`${this.domain}ClientFileAttachment/DeleteClientFileAttachment/${value.clientFileId}/${value.attachmentId}`)
  }
  AddFinalStatusListApi(value:any): Observable<any> {
    return this._HttpClient.put(`${this.domain}ClientFile/ChangeFinalStatusClientFile`,value)
  }
  GetAllClientFileAttachment(data:any): Observable<any> {
    return this._HttpClient.get(`${this.domain}ClientFileAttachment/GetAllClientFileAttachment`, {params: data})
  }
  AddClientFileFollowUp(value:any): Observable<any> {
    const formData = new FormData();
    for (const key in value) {
      if (value[key]) {
        formData.append(key, value[key])
      }
    }
    return this._HttpClient.put(`${this.domain}FollowUp/AddClientFileFollowUpAttachment`,formData)
  }
  AddNotices(value:any): Observable<any> {
    return this._HttpClient.put(`${this.domain}ClientFile/AddPreparingReception?clientFileId=${value.clientFileId}`,value)
  }
  GetAllFollowUp(clientFileId:number): Observable<any> {
    return this._HttpClient.get(`${this.domain}FollowUp/GetAllFollowUp?clientFileId=${clientFileId}`)
  }
  AllFinalStatusClientFile(clientFileId:number): Observable<any> {
    return this._HttpClient.get(`${this.domain}ClientFile/GetAllFinalStatusClientFile?clientFileId=${clientFileId}`)
  }
  LoadFinalStatusList(itemType :number): Observable<any> {
    return this._HttpClient.get(`${this.domain}StatusCategory/LoadFinalStatusList/${itemType}`)
  }
  GetqutationReport(clientFileId,IsExcel=false){
    return this._HttpClient.get(`${this.domain}Report/GeneratePurchaseOrderReport?clientFileId=${clientFileId}&IsExcel=${IsExcel}`)
  }
  GetAllBuildingData(id: number): Observable<any> {
    return this._HttpClient.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
  GetAllServicesData(id: number): Observable<any> {
    return this._HttpClient.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
  GetAllPaperData(id: number): Observable<any> {
    return this._HttpClient.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
  GetAllOrderData(id: number): Observable<any> {
    return this._HttpClient.get(`${this.domain}StatusCategory/GetStatusCategoryById/${id}`)
  }
}
