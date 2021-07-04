import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CharactersService } from 'src/app/core/services/characters.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { charactersMockService } from 'src/app/shared/tests/services/characters.mock.service';
import { matDialogRefMockService } from 'src/app/shared/tests/services/mat-dialog-ref.mock.service';
import { notificationsMockService } from 'src/app/shared/tests/services/notifications.mock.service';

import { DeleteCharacterComponent } from './delete-character.component';

describe('Given DeleteCharacterComponent', () => {
  let component: DeleteCharacterComponent;
  let fixture: ComponentFixture<DeleteCharacterComponent>;
  let charactersService: CharactersService;
  let notifService: NotificationsService;
  let dialogRef: MatDialogRef<DeleteCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DeleteCharacterComponent,
      ],
      imports: [
        MatButtonModule,
        MatDialogModule,
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
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 1 },
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCharacterComponent);
    component = fixture.componentInstance;
    charactersService = TestBed.inject(CharactersService);
    notifService = TestBed.inject(NotificationsService);
    dialogRef = TestBed.inject(MatDialogRef);

    fixture.detectChanges();
  });

  describe('When component is called', () => {
    it('Then it should be created', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When user clicks on cancel', () => {
    beforeEach(() => {
      spyOn(component, 'delete').and.callThrough();

      const buttonElement = fixture.debugElement.query(By.css('.cancel-btn'));
      buttonElement.triggerEventHandler('click', null);
    });

    it('Then nothing happens', () => {
      expect(component.delete).not.toHaveBeenCalled();
    });
  });

  describe('When user clicks on submit', () => {
    beforeEach(() => {
      spyOn(component, 'delete').and.callThrough();
      charactersService.delete = jasmine.createSpy('delete').and.returnValue(of(null));

      const buttonElement = fixture.debugElement.query(By.css('.ok-btn'));
      buttonElement.triggerEventHandler('click', null);
    });

    it('Then deleted is called', () => {
      expect(component.delete).toHaveBeenCalled();
    });

    it('Then character is deleted', () => {
      expect(charactersService.delete).toHaveBeenCalledWith(1);
    });

    it('Then a message is shown', () => {
      expect(notifService.showSuccessMessage).toHaveBeenCalled();
    });

    it('Then dialog is closed', () => {
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
