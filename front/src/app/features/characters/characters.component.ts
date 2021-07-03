import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Character } from 'src/app/shared/models/character';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'health', 'attack', 'defense', 'magik', 'rank', 'skills', 'free'];
  dataSource: MatTableDataSource<Character>;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap((data: { characters: Character[] }) => {
        this.dataSource = new MatTableDataSource(data.characters);
      }),
    ).subscribe();
  }
}
