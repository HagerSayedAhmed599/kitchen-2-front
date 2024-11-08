import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { environment as env } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  domain: string = env.apiUrl;

  constructor(private _HttpClient: HttpClient) { }
  GetContractsReports(quaryData){
    return this._HttpClient.get(`${this.domain}Report/AllContractReport?pFromDate=${quaryData.dateFrom}&pToDate=${quaryData.dateTo}&IsExcel=${quaryData.IsExcel}`)
  }
  getTarkeebReminderDate(quaryData){
    return this._HttpClient.get(`${this.domain}Report/TarkeebReminder?Month=${quaryData.Month}&Week=${quaryData.Week}&IsExcel=${quaryData.IsExcel}`)
  }
  GetFollowReports(quaryData){
    return this._HttpClient.get(`${this.domain}Report/FollowReport?pFromDate=${quaryData.dateFrom}&pToDate=${quaryData.dateTo}&IsExcel=${quaryData.IsExcel}&pTypeID=${quaryData.TypeID}`)
  }
  GetKitchenStatusReport(quaryData){
    return this._HttpClient.get(`${this.domain}Report/KitchenStatusReport?pFromDate=${quaryData.dateFrom}&pUserID=${quaryData.UserID}&pToDate=${quaryData.dateTo}&pFinalStatusID=${quaryData.FinalStatusID}&IsExcel=${quaryData.IsExcel}`)
  }
  GetKitchenStatusLogReport(quaryData){
    return this._HttpClient.get(`${this.domain}Report/KitchenStatusLogReport?pFromDate=${quaryData.dateFrom}&pUserID=${quaryData.UserID}&pToDate=${quaryData.dateTo}&pFinalStatusID=${quaryData.FinalStatusID}&IsExcel=${quaryData.IsExcel}`)
  }
}
