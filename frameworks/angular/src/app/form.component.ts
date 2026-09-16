import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  type AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators,
} from '@angular/forms';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, PorscheDesignSystemModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="col-wide grid grid-cols-subgrid gap-y-fluid-md">
      <p-heading class="col-wide">Register</p-heading>

      <p-radio-group formControlName="accountType" [label]="'Account Type'" [required]="true" [state]="getState('accountType')" class="col-wide">
        <p-radio-group-option label="Personal" value="personal"></p-radio-group-option>
        <p-radio-group-option label="Businees" value="business"></p-radio-group-option>
        @if (showError('accountType', 'required')) {
          <span slot="message">Please select the account type</span>
        }
      </p-radio-group>

      <p-heading [size]="'medium'" class="col-wide">
        Personal Data
      </p-heading>


      <p-select formControlName="salutation" [label]="'Salutation'" [required]="true" [state]="getState('salutation')" class="col-wide xs:col-span-one-half sm:col-span-4">
        <p-select-option value="mr">Mr.</p-select-option>
        <p-select-option value="mrs">Mrs.</p-select-option>
        @if (showError('salutation', 'required')) {
            <span slot="message">Please enter your salutation</span>
        }
      </p-select>
      <p-select formControlName="title" [label]="'Title'" class="col-wide xs:col-span-one-half sm:col-span-4">
        <p-select-option></p-select-option>
        <p-select-option value="dr">Dr.</p-select-option>
        <p-select-option value="prof">Prof.</p-select-option>
        <p-select-option value="prof-dr">Prof. Dr.</p-select-option>
      </p-select>
      <p-input-text formControlName="firstname" [label]="'First name'" [required]="true" [state]="getState('firstname')" class="col-wide sm:col-start-1 sm:col-span-one-half">
        @if (showError('firstname', 'required')) {
          <span slot="message">Please enter your name</span>
        }
      </p-input-text>
      <p-input-text formControlName="lastname" [label]="'Last name'" [required]="true" [state]="getState('lastname')" class="col-wide sm:col-span-one-half">
        @if (showError('lastname', 'required')) {
          <span slot="message">Please enter your name</span>
        }
      </p-input-text>
      <p-input-email formControlName="email" [label]="'Email address'" [required]="true" [state]="getState('email')" [indicator]="true" class="col-wide sm:col-start-1 sm:col-span-one-half">
        @if (showError('email', 'required')) {
          <span slot="message">Please enter your email</span>
        }
      </p-input-email>
      <p-input-tel formControlName="phone" [label]="'Phone number'" [indicator]="true" class="col-wide sm:col-span-one-half" />

      <p-heading [size]="'medium'" class="col-wide">
        Password
      </p-heading>

      <p-input-password formControlName="password" [label]="'Password'" [required]="true" [state]="getState('password')" [toggle]="true" class="col-wide sm:col-start-1 sm:col-span-one-half">
        @if (showError('password')) {
          <div slot="message">
            @if (showError('password', 'required')) {
              <p>Please enter your password</p>
            }
            @if (showError('password', 'min')) {
              <p>Must be at least 8 characters long</p>
            }
            @if (showError('password', 'number')) {
              <p>Must contain a number</p>
            }
            @if (showError('password', 'uppercase')) {
              <p>Must contain an uppercase letter</p>
            }
            @if (showError('password', 'special')) {
              <p>Must contain a special character (!@#$%^&*)</p>
            }
          </div>
        }
      </p-input-password>

      <p-checkbox formControlName="privacyPolicy" [required]="true" [state]="getState('privacyPolicy')" class="col-wide">
        <span slot="label">I have read and understood the Privacy Policy</span>
        @if (showError('privacyPolicy', 'required')) {
          <span slot="message">Please accept our privacy policy so that we can process your request</span>
        }
      </p-checkbox>
      <div class="flex gap-fluid-sm">
        <p-button type="submit" class="shrink-0">Submit</p-button>
        <p-button type="reset" [variant]="'secondary'" class="shrink-0">Reset</p-button>
      </div>
    </form>
  `,
})
export class FormPageComponent {
  form = new FormGroup({
    accountType: new FormControl<string | undefined>({ value: undefined, disabled: false }, { nonNullable: true }),
    salutation: new FormControl(
      { value: undefined, disabled: false },
      { validators: Validators.required, nonNullable: true }
    ),
    title: new FormControl({ value: undefined, disabled: false }),
    firstname: new FormControl('', { validators: Validators.required, nonNullable: true }),
    lastname: new FormControl('', { validators: Validators.required, nonNullable: true }),
    email: new FormControl('', { validators: Validators.required, nonNullable: true }),
    phone: new FormControl(''),
    password: new FormControl('', {
      validators: [Validators.required, this.passwordValidator],
      nonNullable: true,
    }),
    privacyPolicy: new FormControl(false, { validators: Validators.requiredTrue }),
  });

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const errors: ValidationErrors = {};
    if (!value) return { required: true };
    if (value.length < 8) errors['min'] = true;
    if (!/\d/.test(value)) errors['number'] = true;
    if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
    if (!/[!@#$%^&*]/.test(value)) errors['special'] = true;
    return Object.keys(errors).length ? errors : null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
    console.log(this.form.value);
  }

  getState(controlName: keyof typeof this.form.controls): 'error' | 'none' {
    const ctrl = this.form.controls[controlName];
    return ctrl.invalid && (ctrl.dirty || ctrl.touched) ? 'error' : 'none';
  }

  showError(controlName: keyof typeof this.form.controls, error?: string): boolean {
    const ctrl = this.form.controls[controlName];
    return ctrl.invalid && (ctrl.dirty || ctrl.touched) && (!error || ctrl.hasError(error));
  }
}
