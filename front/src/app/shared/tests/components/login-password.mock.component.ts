import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-login-password',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LoginPasswordMockComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LoginPasswordMockComponent),
      multi: true
    }
  ]
})
export class LoginPasswordMockComponent implements ControlValueAccessor {
  @Input() title: string;
  @Input() submitButtonLabel: string;

  constructor(
    private fb: FormBuilder,
  ) { }

  writeValue(): void {
  }

  registerOnChange(): void {
  }

  registerOnTouched(): void {
  }

  validate(): ValidationErrors {
    return null;
  }
}
