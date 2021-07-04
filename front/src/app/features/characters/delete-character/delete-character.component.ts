import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { CharactersService } from 'src/app/core/services/characters.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
  selector: 'app-delete-character',
  templateUrl: './delete-character.component.html'
})
export class DeleteCharacterComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private dialogRef: MatDialogRef<DeleteCharacterComponent>,
    private charactersService: CharactersService,
    private notificationsService: NotificationsService,
  ) {}

  delete(): void {
    this.charactersService.delete(this.data.id).pipe(
      tap(() => {
        this.notificationsService.showSuccessMessage('Personnage supprimé avec succès !');
        this.dialogRef.close(true);
      }),
    ).subscribe();
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
