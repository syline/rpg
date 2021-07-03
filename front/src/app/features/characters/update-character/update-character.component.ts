import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CharactersService } from 'src/app/core/services/characters.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { UpdateCharacterDto } from 'src/app/shared/dto/update-character.dto';
import { CharacteristicEnum } from 'src/app/shared/enums/characteristic.enum';
import { Character } from 'src/app/shared/models/character';

@Component({
  selector: 'app-update-character',
  templateUrl: './update-character.component.html',
  styleUrls: ['./update-character.component.scss']
})
export class UpdateCharacterComponent implements OnInit {
  oldCharacter: Character;
  newCharacter: Character;

  characteristicsEnum = CharacteristicEnum;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private charactersService: CharactersService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap((data: { character: Character }) => {
        this.oldCharacter = data.character;
        this.newCharacter = new Character(data.character);
      }),
    ).subscribe();
  }

  canAddPoint(characteristic: CharacteristicEnum): boolean {
    return this.newCharacter.canLevelUp(characteristic);
  }

  canRemovePoint(characteristic: CharacteristicEnum): boolean {
    return this.newCharacter[characteristic] - this.oldCharacter[characteristic] > 0;
  }

  addPoint(characteristic: CharacteristicEnum): void {
    this.newCharacter.levelUp(characteristic);
  }

  removePoint(characteristic: CharacteristicEnum): void {
    this.newCharacter.levelDown(characteristic);
  }

  reset(): void {
    Object.assign(this.newCharacter, this.oldCharacter);
  }

  updateCharacter(): void {
    const updateCharacter = new UpdateCharacterDto(this.oldCharacter, this.newCharacter);
    this.charactersService.update(this.oldCharacter.id, updateCharacter).pipe(
      tap(() => {
        this.notificationsService.showSuccessMessage('Personnage mis à jour avec succès !');
        this.router.navigate(['/characters']);
      }),
    ).subscribe();
  }
}
