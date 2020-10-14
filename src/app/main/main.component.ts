import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Armor, Build, PathbuilderBuild } from '../models/pathbuilderBuild.model';
import { RequestService } from '../request.service';
 

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  urlForm: FormGroup;
  characters: Build[] = [];

  constructor(private formBuilder: FormBuilder, private requestService: RequestService) {
    this.urlForm = this.formBuilder.group({
      url: 'http://pathbuilder2e.com/json.php?id=100057'
    });
   }

  ngOnInit(): void {
  }

  onSubmit(data) {
    this.requestService.getJsonFromPathbuilder(data.url).subscribe(characterData => {
      this.characters.push(characterData.build);
    }, error => {
      console.warn(error);
    });
  }

  getItemDataFromWanderers(name: string){
    this.requestService.getItemDataFromWanderers(name).subscribe(itemData => {
      console.log(itemData)
    }, error => {
      console.warn(error);
    });
  }

  computeModifier(value: number){
    return Math.trunc((value-10)/2);
  }

  findArmorProf(array: Armor[]) {
    return array.find(armor => armor.worn === true ); 
  }
}
