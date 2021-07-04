import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CharacterDto } from 'src/app/shared/dto/character.dto';
import { Character } from 'src/app/shared/models/character';
import { TitleBarMockComponent } from 'src/app/shared/tests/components/title-bar.mock.component';
import { activatedRouteMockService } from 'src/app/shared/tests/services/activated-route.mock.service';

import { DetailsCharacterComponent } from './details-character.component';

describe('Given DetailsCharacterComponent', () => {
  let component: DetailsCharacterComponent;
  let fixture: ComponentFixture<DetailsCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DetailsCharacterComponent,
        TitleBarMockComponent,
      ],
      imports: [
        MatTableModule,
        MatCardModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMockService,
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCharacterComponent);
    component = fixture.componentInstance;

    activatedRouteMockService.data = of({
      character: new Character(new CharacterDto()),
      fights: [],
     });

    fixture.detectChanges();
  });

  describe('When component is called', () => {
    it('Then it should be created', () => {
      expect(component).toBeTruthy();
    });
  });
});
