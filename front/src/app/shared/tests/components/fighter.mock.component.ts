import { Component, Input } from "@angular/core";
import { Character } from "../../models/character";

@Component({
  selector: 'app-fighter',
  template: '',
})
export class FighterMockComponent {
  @Input() fighter: Character;
  @Input() urlImg: string;
  @Input() winner: number;
}
