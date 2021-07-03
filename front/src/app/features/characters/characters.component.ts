import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Character } from 'src/app/shared/models/character';
import { CreateCharacterComponent } from './create-character/create-character.component';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'health', 'attack', 'defense', 'magik', 'rank', 'skills', 'free', 'update'];
  dataSource: MatTableDataSource<Character>;

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

    dialogRef.afterClosed().pipe(
      tap((newCharacter: Character) => {
        if (newCharacter) {
          this.dataSource.data.push(newCharacter);
        }
      }),
    ).subscribe();
  }
}
