import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ILoginPassword } from '../../interfaces/ilogin-password';

@Component({
  selector: 'app-login-password',
  templateUrl: './login-password.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LoginPasswordComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LoginPasswordComponent),
      multi: true
    }
  ]
})
export class LoginPasswordComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() title: string;
  @Input() submitButtonLabel: string;

  form: FormGroup;
  subscriptions: Subscription[] = [];

  get value(): ILoginPassword {
    return this.form.value;
  }

  set value(value: ILoginPassword) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      login: [null, Validators.required],
      password: [null, Validators.required],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  onChange: any = () => {
  }

  onTouched: any = () => {
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  validate(): ValidationErrors {
    return this.form.valid ? null : { loginPassword: { valid: false } };
  }
}
