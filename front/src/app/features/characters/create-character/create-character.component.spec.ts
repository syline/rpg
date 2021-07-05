import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CharactersService } from 'src/app/core/services/characters.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { CharacterDto } from 'src/app/shared/dto/character.dto';
import { Character } from 'src/app/shared/models/character';
import { charactersMockService } from 'src/app/shared/tests/services/characters.mock.service';
import { matDialogRefMockService } from 'src/app/shared/tests/services/mat-dialog-ref.mock.service';
import { notificationsMockService } from 'src/app/shared/tests/services/notifications.mock.service';
import { CreateCharacterComponent } from './create-character.component';

describe('Given CreateCharacterComponent', () => {
  let component: CreateCharacterComponent;
  let fixture: ComponentFixture<CreateCharacterComponent>;
  let charactersService: CharactersService;
  let dialogRef: MatDialogRef<CreateCharacterComponent>;
  let notifService: NotificationsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CreateCharacterComponent,
      ],
      imports: [
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: CharactersService,
          useValue: charactersMockService,
        },
        {
          provide: NotificationsService,
          useValue: notificationsMockService,
        },
        {
          provide: MatDialogRef,
          useValue: matDialogRefMockService,
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCharacterComponent);
    component = fixture.componentInstance;
    charactersService = TestBed.inject(CharactersService);
    dialogRef = TestBed.inject(MatDialogRef);
    notifService = TestBed.inject(NotificationsService);

    fixture.detectChanges();
  });

  describe('When component is called', () => {
    it('Then it should be created', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When form is created', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('Then name is required', () => {
      component.name.reset();
      expect(component.name.hasError('required')).toBeTrue();
    });
  });

  describe('When name is valid and user clicks on submit', () => {
    const character = new Character({ } as CharacterDto);
    beforeEach(() => {
      component.name.patchValue('test');
      spyOn(component, 'add').and.callThrough();

      charactersService.create = jasmine.createSpy('create').and.returnValue(of(character));

      const buttonElement = fixture.debugElement.query(By.css('.create-btn'));
      buttonElement.triggerEventHandler('click', null);
    });

    it('Then add is called', () => {
      expect(component.add).toHaveBeenCalled();
    });

    it('Then create function is called', () => {
      expect(charactersService.create).toHaveBeenCalledWith(component.name.value);
    });

    it('Then dialog is closed and send new character', () => {
      expect(dialogRef.close).toHaveBeenCalledWith(character);
    });

    it('Then a message is shown for user', () => {
      expect(notifService.showSuccessMessage).toHaveBeenCalled();
    });
  });

  describe('When user clicks on cancel', () => {
    beforeEach(() => {
      spyOn(component, 'add').and.callThrough();

      const buttonElement = fixture.debugElement.query(By.css('.cancel-btn'));
      buttonElement.triggerEventHandler('click', null);
    });

    it('Then nothing happens', () => {
      expect(component.add).not.toHaveBeenCalled();
    });
  });
});
