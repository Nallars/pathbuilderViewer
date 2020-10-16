import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {
  DbReaderService
} from '../db-reader.service';
import {
  Armor,
  Build,
  Weapon
} from '../models/pathbuilderBuild.model';
import {
  RequestService
} from '../request.service';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import {
  DomSanitizer
} from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  urlForm: FormGroup;
  characters: Build[] = [];
  strikingRunes = {
    "": 1,
    "striking": 2,
    "greaterStriking": 3,
    "majorStriking": 4
  };
  size = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];
  edit = false;
  aonSearch = false;
  searchResult = undefined;

  @ViewChild('searchInput') searchInput;

  constructor(private formBuilder: FormBuilder, private requestService: RequestService,
    private dbReader: DbReaderService, private _snackBar: MatSnackBar, private sanitized: DomSanitizer,
    private elRef: ElementRef, private renderer: Renderer2) {
    this.urlForm = this.formBuilder.group({
      url: 'https://pathbuilder2e.com/json.php?id=100057'
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('characters'))
      this.characters = JSON.parse(localStorage.getItem('characters'));
  }

  onSubmit(data) {
    this.requestService.getJsonFromPathbuilder(data.url).subscribe(characterData => {
      console.log(characterData.build);
      //Gather AC Value for worn armor
      let wornArmor = this.findWornArmor(characterData.build.armor);
      if (wornArmor)
        this.dbReader.getEquipmentInfo(wornArmor.name).subscribe(armorData => {
          let charToUpdate = this.characters.find(char => char.name === characterData.build.name && char.level === characterData.build.level);
          let wornArmorChar = this.findWornArmor(charToUpdate.armor);
          wornArmorChar.ac = armorData.data.armor.value;
          localStorage.setItem('characters', JSON.stringify(this.characters));
        }, error => {
          console.warn(error);
        });
      //Gather Shield AC Value for worn shield
      let wornShield = this.findWornShield(characterData.build.armor);
      if (wornShield)
        this.dbReader.getEquipmentInfo(wornShield.name).subscribe(armorData => {
          let charToUpdate = this.characters.find(char => char.name === characterData.build.name && char.level === characterData.build.level);
          let wornShieldChar = this.findWornShield(charToUpdate.armor);
          wornShieldChar.ac = armorData.data.armor.value;
          localStorage.setItem('characters', JSON.stringify(this.characters));
        }, error => {
          console.warn(error);
        });

      const checkIfExist = this.characters.findIndex(char => char.name === characterData.build.name && char.level === characterData.build.level);
      if (checkIfExist == -1) {
        this.characters.push(characterData.build);
      } else {
        this.openSnackBar("A character with that name and level already exists !", "Ok");
      }
      localStorage.setItem('characters', JSON.stringify(this.characters));
    }, error => {
      console.warn(error);
    });
  }

  computeModifier(value: number) {
    return Math.trunc((value - 10) / 2);
  }

  displayModifier(value: number) {
    const modifier = Math.trunc((value - 10) / 2);
    if (modifier >= 0) {
      return "+" + modifier;
    }
    return modifier;
  }

  computeAC(character: Build) {
    return 10 + this.computeModifier(character.abilities.dex) + character.proficiencies[this.findWornArmor(character.armor).prof] +
      this.findWornArmor(character.armor).ac + this.findWornArmor(character.armor).pot + character.level;
  }

  computeACShield(character: Build) {
    let shield = this.findWornShield(character.armor);
    if (shield) {
      return 10 + this.computeModifier(character.abilities.dex) + character.proficiencies[this.findWornArmor(character.armor).prof] +
        this.findWornArmor(character.armor).ac + this.findWornArmor(character.armor).pot + character.level + shield.ac;
    } else {
      return 10 + this.computeModifier(character.abilities.dex) + character.proficiencies[this.findWornArmor(character.armor).prof] +
        this.findWornArmor(character.armor).ac + this.findWornArmor(character.armor).pot + character.level;
    }

  }

  computeHP(character: Build) {
    return character.attributes.ancestryhp + character.level * character.attributes.classhp +
      character.level * character.attributes.bonushpPerLevel + character.attributes.bonushp + character.level * this.computeModifier(character.abilities.con);
  }

  computeAttackBonus(weapon: Weapon, character: Build, ability: number) {
    if (character.specificProficiencies.trained.indexOf(weapon.name) >= 0) {
      return this.computeModifier(ability) + character.level + 2 + weapon.pot;
    } else if (character.specificProficiencies.expert.indexOf(weapon.name) >= 0) {
      return this.computeModifier(ability) + character.level + 4 + weapon.pot;
    } else if (character.specificProficiencies.master.indexOf(weapon.name) >= 0) {
      return this.computeModifier(ability) + character.level + 6 + weapon.pot;
    } else if (character.specificProficiencies.legendary.indexOf(weapon.name) >= 0) {
      return this.computeModifier(ability) + character.level + 8 + weapon.pot;
    } else {
      return this.computeModifier(ability) + character.level + character.proficiencies[weapon.prof] + weapon.pot;
    }
  }

  computeSkill(modifier: number, level: number, skillProf: number) {
    if (skillProf > 0) {
      return "+" + (modifier + level + skillProf);
    } else {
      return modifier;
    }
  }

  findBonusProf(name: string, character: Build) {
    return character.proficiencies[name];
  }

  findBonusProfWeapon(weapon: Weapon, character: Build) {
    if (character.specificProficiencies.trained.indexOf(weapon.name) >= 0) {
      return 2;
    } else if (character.specificProficiencies.expert.indexOf(weapon.name) >= 0) {
      return 4;
    } else if (character.specificProficiencies.master.indexOf(weapon.name) >= 0) {
      return 6;
    } else if (character.specificProficiencies.legendary.indexOf(weapon.name) >= 0) {
      return 8;
    } else {
      return character.proficiencies[weapon.prof];
    }
  }

  findWornArmor(array: Armor[]): Armor {
    return array.find(armor => armor.worn === true && armor.prof !== "shield");
  }

  findWornShield(array: Armor[]): Armor {
    return array.find(armor => armor.worn === true && armor.prof === "shield");
  }

  deleteCharacter(character: Build) {
    this.characters = this.characters.filter(char => char.name != character.name && char.level != character.level);
    localStorage.setItem("characters", JSON.stringify(this.characters));
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  search(event) {
    this.searchResult = undefined;

    if (event.target.value != "") {
      if (this.aonSearch) {
        window.open("http://2e.aonprd.com/Search.aspx?query=" + event.target.value);
      } else {
        let body = {
          name: event.target.value
        }
        let formData = new FormData();
        formData.append('name', event.target.value);
        this.requestService.searchOnEasyTool(formData).subscribe(response => {
          response = response.replace(/<button type='button' class='listado list-group-item list-group-item-action d-flex flex-row justify-content-between align-items-center'>/g,
            "<button class='listado mat-focus-indicator mat-button mat-button-base'><span class='mat-button-focus-overlay'></span>");
          console.log(response)
          if (response === "") {
            this.searchResult = "No results";
          } else {
            this.searchResult = this.sanitized.bypassSecurityTrustHtml(response);
          }
          //Augmenter le temps
          setTimeout(() => {
            let buttons = this.elRef.nativeElement.querySelectorAll('button.listado');
            for (let button of buttons) {
              button.addEventListener('click', this.onClick.bind(button, button.children[3].value))
            }
          }, 500);
        }, error => {
          console.warn(error);
        });
      }
    }
  }

  searchFor(value) {
    let event = new Event('change');
    this.searchInput.nativeElement.value = value;
    this.searchInput.nativeElement.dispatchEvent(event);
  }

  onClick(id, event) {
    window.open("https://pf2.easytool.es/index.php?id=" + id, "_blank");
  }
}
