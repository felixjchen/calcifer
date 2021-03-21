import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  constructor(private _httpClient: HttpClient) {}

  create(): Observable<any> {
    return this._httpClient.post(`${environment.api_url}/playgrounds`, {});
  }
}
