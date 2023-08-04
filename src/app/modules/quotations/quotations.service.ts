import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QuotationsService {
  domain: string = 'http://194.163.132.242:5000/api/ClientFile/';

  constructor(private _HttpClient: HttpClient) { }
  
  GetAllClientFiles(): Observable<any> {
    return this._HttpClient.get(`${this.domain}GetAllClientFiles`)
  }
  AddClientFile(): Observable<any> {
    return this._HttpClient.get(`${this.domain}AddClientFile`)
  }
}
