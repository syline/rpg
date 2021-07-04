import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { CharactersService } from 'src/app/core/services/characters.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { Character } from 'src/app/shared/models/character';

@Component({
  selector: 'app-create-character',
  templateUrl: './create-character.component.html'
})
export class CreateCharacterComponent implements OnInit {
  name: FormControl;

  constructor(
    private charactersService: CharactersService,
    private notificationsService: NotificationsService,
    private dialogRef: MatDialogRef<CreateCharacterComponent>,
  ) { }

  ngOnInit(): void {
    this.name = new FormControl(null, Validators.required);
  }

  add(): void {
    if (!this.name.valid) {
      return;
    }

    this.charactersService.create(this.name.value).pipe(
      tap((newCharacter: Character) => {
        this.dialogRef.close(newCharacter);
        this.notificationsService.showSuccessMessage('Personnage créé avec succès !');
      }),
    ).subscribe();
  }
}
