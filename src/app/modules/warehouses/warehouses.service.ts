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

}
