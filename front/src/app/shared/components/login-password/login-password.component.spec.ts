import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPasswordComponent } from './login-password.component';

describe('Given LoginPasswordComponent', () => {
  let component: LoginPasswordComponent;
  let fixture: ComponentFixture<LoginPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginPasswordComponent,
      ],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [FormBuilder],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPasswordComponent);
    component = fixture.componentInstance;
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

    it('Then login is required', () => {
      component.form.get('login').patchValue(null);
      expect(component.form.get('login').hasError('required')).toEqual(true);
    });

    it('Then password is required', () => {
      component.form.get('password').patchValue(null);
      expect(component.form.get('password').hasError('required')).toEqual(true);
    });
  });

  describe('When login is empty', () => {
    beforeEach(() => {
      component.form.get('login').reset();
    });

    it('Then form is invalid', () => {
      expect(component.validate()).toBeDefined();
    });
  });

  describe('When password is empty', () => {
    beforeEach(() => {
      component.form.get('password').reset();
    });

    it('Then form is invalid', () => {
      expect(component.validate()).toBeDefined();
    });
  });

  describe('When login and password are set', () => {
    beforeEach(() => {
      component.form.patchValue({
        login: 'a',
        password: 'a',
      });
    });

    it('Then form is valid', () => {
      expect(component.validate()).toBeNull();
    });
  });
});
