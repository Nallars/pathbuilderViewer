import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {from, Observable} from 'rxjs';

import {PathbuilderBuild} from './models/pathbuilderBuild.model'

@Injectable({
  providedIn: 'root'
})

export class RequestService {
  
  
  private API_WANDERERS = "/api/";
  private API_KEY = "bdca6e6c-6afd-4e88-94cf-d704c253310e";
  private EASY_TOOL_URL = "https://pf2.easytool.es/php/search.php";
  
  constructor(private httpClient: HttpClient) {
  }
  
  public getJsonFromPathbuilder(url: string): Observable<PathbuilderBuild> {
    return this.httpClient.get<PathbuilderBuild>(url);
  }
  
  public getItemDataFromWanderers(name: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Apikey ' + this.API_KEY)
    .append('Access-Control-Allow-Origin','*');
    return this.httpClient.get<any>(this.API_WANDERERS+"item?name="+name, {
      headers: headers
    });
  }
  
  public searchOnEasyTool(body) : Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'text/html'
    });
    return this.httpClient.post(this.EASY_TOOL_URL, body, {
      headers: headers,
      observe: 'body',
      responseType: 'text'
    });
  }
}
