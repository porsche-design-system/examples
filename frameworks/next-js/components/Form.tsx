'use client';

import { PButton, PHeading, PRadioGroupOption, PSelectOption } from '@porsche-design-system/components-react/ssr';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormPRadioGroup } from '@/components/form/FormPRadioGroup';
import { FormPCheckbox } from './form/FormPCheckbox';
import { FormPInputEmail } from './form/FormPInputEmail';
import { FormPInputPassword } from './form/FormPInputPassword';
import { FormPInputTel } from './form/FormPInputTel';
import { FormPInputText } from './form/FormPInputText';
import { FormPSelect } from './form/FormPSelect';

type FormData = {
  accountType: string | undefined;
  salutation: string | undefined;
  title: string | undefined;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  privacyPolicy: boolean;
  password: string;
};

export const Form = () => {
  const { control, handleSubmit } = useForm<FormData>({
    mode: 'onTouched', // Validate initially onBlur and then onChange
    criteriaMode: 'all', // Emit all field errors at once
    defaultValues: {
      accountType: undefined,
      salutation: undefined,
      title: undefined,
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      privacyPolicy: false,
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <form className="col-wide grid grid-cols-subgrid gap-y-fluid-md" onSubmit={handleSubmit(onSubmit)} noValidate>
      <PHeading className="col-wide">Register</PHeading>

      <FormPRadioGroup
        name="accountType"
        label="Account Type"
        control={control}
        required={true}
        rules={{ required: 'Please select the account type' }}
        className="col-wide"
      >
        <PRadioGroupOption label="Personal" value="personal" />
        <PRadioGroupOption label="Business" value="business" />
      </FormPRadioGroup>

      <PHeading size="medium" className="col-wide">
        Personal Data
      </PHeading>
      <FormPSelect
        name="salutation"
        control={control}
        label="Salutation"
        required={true}
        rules={{ required: 'Please enter your salutation' }}
        className="col-wide xs:col-span-one-half sm:col-span-4"
      >
        <PSelectOption value="mr">Mr.</PSelectOption>
        <PSelectOption value="mrs">Mrs.</PSelectOption>
      </FormPSelect>
      <FormPSelect name="title" control={control} label="Title" className="col-wide xs:col-span-one-half sm:col-span-4">
        <PSelectOption />
        <PSelectOption value="dr">Dr.</PSelectOption>
        <PSelectOption value="prof">Prof.</PSelectOption>
        <PSelectOption value="prof-dr">Prof. Dr.</PSelectOption>
      </FormPSelect>
      <FormPInputText
        name="firstname"
        control={control}
        label="First Name"
        required={true}
        rules={{ required: 'Please enter your first name' }}
        className="col-wide sm:col-start-1 sm:col-span-one-half"
      />
      <FormPInputText
        name="lastname"
        control={control}
        label="Last Name"
        required={true}
        rules={{ required: 'Please enter your last name' }}
        className="col-wide sm:col-span-one-half"
      />
      <FormPInputEmail
        name="email"
        control={control}
        label="Email"
        indicator={true}
        required={true}
        rules={{ required: 'Please enter your email' }}
        className="col-wide sm:col-start-1 sm:col-span-one-half"
      />
      <FormPInputTel
        name="phone"
        control={control}
        label="Phone"
        indicator={true}
        className="col-wide sm:col-span-one-half"
      />

      <PHeading size="medium" className="col-wide">
        Password
      </PHeading>

      <FormPInputPassword
        name="password"
        control={control}
        label="Password"
        required={true}
        toggle={true}
        rules={{
          validate: {
            isLongEnough: (v) => (v?.toString().length ?? 0) >= 8 || 'Must be at least 8 characters long',
            hasNumber: (v) => /\d/.test(v?.toString() ?? '') || 'Must contain a number',
            hasUpper: (v) => /[A-Z]/.test(v?.toString() ?? '') || 'Must contain an uppercase letter',
            hasSpecial: (v) => /[!@#$%^&*]/.test(v?.toString() ?? '') || 'Must contain a special character (!@#$%^&*)',
          },
        }}
        className="col-wide sm:col-start-1 sm:col-span-one-half"
      />

      <FormPCheckbox
        name="privacyPolicy"
        control={control}
        required={true}
        rules={{ required: 'Please accept our privacy policy so that we can process your request' }}
        className="col-wide"
      >
        <span slot="label">I have read and understood the Privacy Policy</span>
      </FormPCheckbox>
      <div className="flex gap-fluid-sm">
        <PButton type="submit" className="shrink-0">
          Submit
        </PButton>
        <PButton type="reset" variant="secondary" className="shrink-0">
          Reset
        </PButton>
      </div>
    </form>
  );
};
