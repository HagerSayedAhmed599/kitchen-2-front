import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Clients} from './modal/clients'
import { FormGroup } from '@angular/forms';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  domain: string = env.apiUrl;

  constructor(private _HttpClient: HttpClient) { }

  GetAllClients(): Observable<Clients> {
    return this._HttpClient.get<Clients>(`${this.domain}GetAllClients`)
  }
  AddClientFile(form:FormGroup): Observable<Clients> {
    return this._HttpClient.post<Clients>(`${this.domain}AddClientFile`,form)
  }
}
