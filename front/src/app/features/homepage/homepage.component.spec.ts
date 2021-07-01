import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { LoginPasswordMockComponent } from 'src/app/shared/tests/components/login-password.mock.component';
import { authenticationMockService } from 'src/app/shared/tests/services/authentication.mock.service';
import { notificationsMockService } from 'src/app/shared/tests/services/notifications.mock.service';
import { routerMockService } from 'src/app/shared/tests/services/router.mock.service';
import { HomepageComponent } from './homepage.component';

describe('Given HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let authService: AuthenticationService;
  let notifService: NotificationsService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomepageComponent,
        LoginPasswordMockComponent,
      ],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: AuthenticationService,
          useValue: authenticationMockService,
        },
        {
          provide: Router,
          useValue: routerMockService,
        },
        {
          provide: NotificationsService,
          useValue: notificationsMockService,
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthenticationService);
    notifService = TestBed.inject(NotificationsService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  describe('When component is called', () => {
    it('Then it should be created', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('When user logged-in', () => {
    const data = { login: 'test', password: '' };
    beforeEach(() => {
      component.form.patchValue({
        auth: data,
      });
      authService.login = jasmine.createSpy().and.returnValue(of(null));
      component.submit();
    });

    it('Then login function is called with form values', () => {
      expect(authService.login).toHaveBeenCalledWith(data);
    });

    it('Then user is notified by a message', () => {
      expect(notifService.showSuccessMessage).toHaveBeenCalled();
    });

    it('Then user is redirected to characters\' page', () => {
      expect(router.navigate).toHaveBeenCalledWith(['characters']);
    });
  });

  describe('When user submit invalid form', () => {
    beforeEach(() => {
      authService.login = jasmine.createSpy().and.returnValue(of(null));
      component.form.setErrors({ error: true });
    });

    it('Then nothing happens', () => {
      expect(authService.login).not.toHaveBeenCalled();
    });
  });
});
