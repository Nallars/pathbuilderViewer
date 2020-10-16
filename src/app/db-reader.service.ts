import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbReaderService {
  
  constructor(private http: HttpClient) {
  }
  
  public getEquipmentInfo(name: string): Observable<any> {
    return this.http.get("./assets/db/equipment.db/"+ this.formatName(name) +".json");
  }

  public getSpellInfo(name: string): Observable<any> {
    return this.http.get("./assets/db/spells.db/"+ this.formatName(name) +".json");
  }

  private formatName(name: string){
    return name.toLowerCase().replace(" ","-").replace("\'","-");
  }
}
