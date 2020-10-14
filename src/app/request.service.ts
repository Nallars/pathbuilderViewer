import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {from, Observable} from 'rxjs';

import {PathbuilderBuild} from './models/pathbuilderBuild.model'

@Injectable({
  providedIn: 'root'
})

export class RequestService {


  private API_WANDERERS = "http://wanderersguide.app/api/";
  private API_KEY = "5c6be71c-a618-4db5-a71d-8c35e09ea8e7";

  constructor(private httpClient: HttpClient) {
  }

  public getJsonFromPathbuilder(url: string): Observable<PathbuilderBuild> {
    return this.httpClient.get<PathbuilderBuild>(url);
  }

  public getItemDataFromWanderers(name: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Apikey ' + this.API_KEY);
    return this.httpClient.get<any>(this.API_WANDERERS+"item?name="+name, {
      headers: headers
    });
  }
}
