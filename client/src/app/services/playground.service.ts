import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlaygroundService {
  constructor(private _httpClient: HttpClient) {}

  create(type: string): Observable<any> {
    return this._httpClient.post(`${environment.api_url}/playgrounds`, {
      type,
    });
  }

  delete(id: string): Observable<any> {
    return this._httpClient.delete(`${environment.api_url}/playgrounds/${id}`);
  }

  get(id: string): Observable<any> {
    return this._httpClient.get(`${environment.api_url}/playgrounds/${id}`);
  }

  bump(id: string): Observable<any> {
    return this._httpClient.put(
      `${environment.api_url}/playgrounds/${id}/bump`,
      {}
    );
  }
}
