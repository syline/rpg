import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Character } from 'src/app/shared/models/character';
import { CreateCharacterComponent } from './create-character/create-character.component';
import { DeleteCharacterComponent } from './delete-character/delete-character.component';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'health', 'attack', 'defense', 'magik', 'rank', 'skills', 'update', 'delete', 'fight'];
  dataSource: MatTableDataSource<Character>;

  @ViewChild(MatTable) table: MatTable<Character>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogService: MatDialog,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap((data: { characters: Character[] }) => {
        this.dataSource = new MatTableDataSource(data.characters);
      }),
    ).subscribe();
  }

  canCreateCharacter(): boolean {
    return this.dataSource.data.length < 10;
  }

  addCharacter(): void {
    const dialogRef = this.dialogService.open(CreateCharacterComponent);

    this.refreshTableAfterAdd(dialogRef);
  }

  private refreshTableAfterAdd(dialogRef: MatDialogRef<CreateCharacterComponent>): void {
    dialogRef.afterClosed().pipe(
      tap((newCharacter: Character) => {
        if (newCharacter) {
          this.dataSource.data.push(newCharacter);
        }
      }),
    ).subscribe();
  }

  deleteCharacter(id: number): void {
    const dialogRef = this.dialogService.open(DeleteCharacterComponent, {
      data: {
        id,
      },
    });

    this.refreshTableAfterDelete(dialogRef, id);
  }

  private refreshTableAfterDelete(dialogRef: MatDialogRef<DeleteCharacterComponent>, characterId: number): void {
    dialogRef.afterClosed().pipe(
      tap((isDeleted: boolean) => {
        if (isDeleted) {
          const idx = this.dataSource.data.findIndex((character) => character.id === characterId);
          this.dataSource.data.splice(idx, 1);
          this.table.renderRows();
        }
      }),
    ).subscribe();
  }
}
