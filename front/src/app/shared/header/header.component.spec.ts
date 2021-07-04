import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { authenticationMockService } from '../tests/services/authentication.mock.service';
import { matDialogRefMockService } from '../tests/services/mat-dialog-ref.mock.service';
import { notificationsMockService } from '../tests/services/notifications.mock.service';
import { routerMockService } from '../tests/services/router.mock.service';
import { HeaderComponent } from './header.component';

describe('Given HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let dialogService: MatDialog;
  let authService: AuthenticationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
      ],
      imports: [
        MatToolbarModule,
      ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authenticationMockService,
        },
        {
          provide: MatDialog,
          useValue: matDialogRefMockService,
        },
        {
          provide: NotificationsService,
          useValue: notificationsMockService,
        },
        {
          provide: Router,
          useValue: routerMockService,
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    dialogService = TestBed.inject(MatDialog);
    authService = TestBed.inject(AuthenticationService);

    fixture.detectChanges();
  });

  describe('When component is called', () => {
    it('Then it should be created', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When user is not logged-in and clicks on create an account', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
      spyOn(component, 'createAccount').and.callThrough();
      const buttonElement = fixture.debugElement.query(By.css('.create-account'));
      buttonElement.triggerEventHandler('click', null);
    });

    it('Then createAccount is called', () => {
      expect(component.createAccount).toHaveBeenCalled();
    });

    it('Then a dialog is open', () => {
      expect(dialogService.open).toHaveBeenCalled();
    });
  });

  describe('When user is logged-in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(true);
      fixture.detectChanges();
    });

    it('Then create an account is invisible', () => {
      const buttonElement = fixture.debugElement.query(By.css('.create-account'));
      expect(buttonElement).toBeNull();
    });
  });

  describe('When user is not logged-in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
      fixture.detectChanges();
    });

    it('Then create an account is visible', () => {
      const buttonElement = fixture.debugElement.query(By.css('.create-account'));
      expect(buttonElement).toBeDefined();
    });
  });
});
