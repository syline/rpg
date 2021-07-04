import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Character } from 'src/app/shared/models/character';
import { Fight } from 'src/app/shared/models/fight';

@Component({
  selector: 'app-details-character',
  templateUrl: './details-character.component.html',
  styleUrls: ['./details-character.component.scss']
})
export class DetailsCharacterComponent implements OnInit {
  character: Character;
  dataSource: MatTableDataSource<Fight>;
  displayedColumns = ['attacker', 'defender', 'winner'];

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap((data: { character: Character, fights: Fight[] }) => {
        this.character = data.character;
        this.dataSource = new MatTableDataSource(data.fights);
      }),
    ).subscribe();
  }

}
