import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { LoginPasswordMockComponent } from '../../tests/components/login-password.mock.component';
import { authenticationMockService } from '../../tests/services/authentication.mock.service';
import { matDialogRefMockService } from '../../tests/services/mat-dialog-ref.mock.service';
import { notificationsMockService } from '../../tests/services/notifications.mock.service';
import { CreateAccountDialogComponent } from './create-account-dialog.component';

describe('Given CreateAccountDialogComponent', () => {
  let component: CreateAccountDialogComponent;
  let fixture: ComponentFixture<CreateAccountDialogComponent>;
  let dialogRef: MatDialogRef<CreateAccountDialogComponent>;
  let authService: AuthenticationService;
  let notifService: NotificationsService;

  const data = { login: 'test', password: '' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CreateAccountDialogComponent,
        LoginPasswordMockComponent,
      ],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: MatDialogRef,
          useValue: matDialogRefMockService,
        },
        {
          provide: NotificationsService,
          useValue: notificationsMockService,
        },
        {
          provide: AuthenticationService,
          useValue: authenticationMockService,
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dialogRef = TestBed.inject(MatDialogRef);
    authService = TestBed.inject(AuthenticationService);
    notifService = TestBed.inject(NotificationsService);
  });

  describe('When component is up', () => {
    it('Then it should be created', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When form is invalid and is submitted', () => {
    beforeEach(() => {
      authService.register = jasmine.createSpy('register').and.returnValue(of(data));
      component.form.setErrors({ error: true });
      component.submit();
    });

    it('Then nothing is done', () => {
      expect(authService.register).not.toHaveBeenCalled();
    });
  });

  describe('When form is valid, is submitted with sucess', () => {
    beforeEach(() => {
      authService.register = jasmine.createSpy('register').and.returnValue(of(data));
      component.form.patchValue({
        register: data,
      });
      component.submit();
    });

    it('Then user account is registered', () => {
      expect(authService.register).toHaveBeenCalledWith(data);
    });

    it('Then user is notified', () => {
      expect(notifService.showSuccessMessage).toHaveBeenCalled();
    });

    it('Then dialog is closed', () => {
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
