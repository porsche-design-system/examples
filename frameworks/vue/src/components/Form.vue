<script setup lang="ts">
import {
  PButton,
  PCheckbox,
  PHeading,
  PInputEmail,
  PInputPassword,
  PInputTel,
  PInputText,
  PRadioGroup,
  PRadioGroupOption,
  PSelect,
  PSelectOption,
} from '@porsche-design-system/components-vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

const schema = z.object({
  accountType: z.enum(['personal', 'business'], { error: 'Please select an account type' }),
  salutation: z.string({ error: 'Please enter your salutation' }).min(1, 'Please enter your salutation'),
  title: z.string().optional(),
  firstname: z.string().min(1, 'Please enter your first name'),
  lastname: z.string().min(1, 'Please enter your last name'),
  email: z.string().email('Invalid email').min(1, 'Please enter your email'),
  phone: z.string().optional(),
  privacyPolicy: z.boolean().refine((v) => v, 'Please accept our privacy policy so that we can process your request'),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .superRefine((value, ctx) => {
      if (value.length < 8) {
        ctx.addIssue({ code: 'custom', message: 'Must be at least 8 characters long' });
      }
      if (!/\d/.test(value)) {
        ctx.addIssue({ code: 'custom', message: 'Must contain a number' });
      }
      if (!/[A-Z]/.test(value)) {
        ctx.addIssue({ code: 'custom', message: 'Must contain an uppercase letter' });
      }
      if (!/[!@#$%^&*]/.test(value)) {
        ctx.addIssue({ code: 'custom', message: 'Must contain a special character (!@#$%^&*)' });
      }
    }),
});

const { handleSubmit, resetForm, defineField, errors, errorBag } = useForm({
  // biome-ignore lint/suspicious/noExplicitAny: type assertion needed due to missing types in @vee-validate/zod (which expects Zod v3 types instead of Zod v4)
  validationSchema: toTypedSchema(schema as any),

  initialValues: {
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

const [accountType, accountTypeProps] = defineField('accountType');
const [salutation, salutationProps] = defineField('salutation');
const [title, titleProps] = defineField('title');
const [firstname, firstnameProps] = defineField('firstname');
const [lastname, lastnameProps] = defineField('lastname');
const [email, emailProps] = defineField('email');
const [phone, phoneProps] = defineField('phone');
const [password, passwordProps] = defineField('password');
const [privacyPolicy, privacyPolicyProps] = defineField('privacyPolicy');

const onSubmit = handleSubmit((values) => {
  console.log(values);
});

const onReset = () => {
  resetForm();
};
</script>

<template>
  <form class="col-wide grid grid-cols-subgrid gap-y-fluid-md" @submit.prevent="onSubmit" novalidate>
    <PHeading class="col-wide">Register</PHeading>

    <PRadioGroup
      :name="'accountType'"
      :label="'Account type'"
      v-model:value="accountType"
      v-bind="accountTypeProps"
      :required="true"
      :state="errors.accountType ? 'error' : 'none'"
      class="col-wide"
    >
      <PRadioGroupOption label="Personal" value="personal"></PRadioGroupOption>
      <PRadioGroupOption label="Business" value="business"></PRadioGroupOption>
      <span v-if="errors.accountType" slot="message">{{ errors.accountType }}</span>
    </PRadioGroup>

    <PHeading size="medium" class="col-wide">Personal Data</PHeading>

    <PSelect
        v-model:value="salutation"
        v-bind="salutationProps"
        :name="'salutation'"
        :label="'Salutation'"
        :required="true"
        :state="errors.salutation ? 'error' : 'none'"
        class="col-wide xs:col-span-one-half sm:col-span-4"
    >
      <PSelectOption :value="'mr'">Mr.</PSelectOption>
      <PSelectOption :value="'mrs'">Mrs.</PSelectOption>
      <span v-if="errors.salutation" slot="message">{{ errors.salutation }}</span>
    </PSelect>

    <PSelect name="title" v-model:value="title" v-bind="titleProps" label="Title" :state="errors.title ? 'error' : 'none'" class="col-wide xs:col-span-one-half sm:col-span-4">
      <PSelectOption></PSelectOption>
      <PSelectOption :value="'dr'">Dr.</PSelectOption>
      <PSelectOption :value="'prof'">Prof.</PSelectOption>
      <PSelectOption :value="'prof-dr'">Prof. Dr.</PSelectOption>
      <span v-if="errors.title" slot="message">{{ errors.title }}</span>
    </PSelect>

    <PInputText name="firstname" v-model:value="firstname" v-bind="firstnameProps" label="First Name" :required="true" :state="errors.firstname ? 'error' : 'none'" class="col-wide sm:col-start-1 sm:col-span-one-half">
      <span v-if="errors.firstname" slot="message">{{ errors.firstname }}</span>
    </PInputText>

    <PInputText name="lastname" v-model:value="lastname" v-bind="lastnameProps" label="Last Name" :required="true" :state="errors.lastname ? 'error' : 'none'" class="col-wide sm:col-span-one-half">
      <span v-if="errors.lastname" slot="message">{{ errors.lastname }}</span>
    </PInputText>

    <PInputEmail name="email" v-model:value="email" v-bind="emailProps" label="Email" :required="true" :indicator="true" :state="errors.email ? 'error' : 'none'" class="col-wide sm:col-start-1 sm:col-span-one-half">
      <span v-if="errors.email" slot="message">{{ errors.email }}</span>
    </PInputEmail>

    <PInputTel name="phone" v-model:value="phone" v-bind="phoneProps" label="Phone" :indicator="true" class="col-wide sm:col-span-one-half" :state="errors.phone ? 'error' : 'none'">
      <span v-if="errors.phone" slot="message">{{ errors.phone }}</span>
    </PInputTel>

    <PHeading size="medium" class="col-wide">Password</PHeading>
    <PInputPassword name="password" v-model:value="password" v-bind="passwordProps" label="Password" :required="true" :toggle="true" :state="errors.password ? 'error' : 'none'" class="col-wide sm:col-start-1 sm:col-span-one-half">
      <div v-if="errorBag.password" slot="message">
        <p v-for="(error, index) in errorBag.password" :key="index" class="error">
          {{ error }}
        </p>
      </div>
    </PInputPassword>

    <PCheckbox name="privacyPolicy" v-model:checked="privacyPolicy" v-bind="privacyPolicyProps" :required="true" :state="errors.privacyPolicy ? 'error' : 'none'" class="col-wide">
      <span slot="label">I have read and understood the Privacy Policy</span>
      <span v-if="errors.privacyPolicy" slot="message">{{ errors.privacyPolicy }}</span>
    </PCheckbox>

    <div class="flex gap-fluid-sm">
      <PButton type="submit" class="shrink-0">Submit</PButton>
      <PButton type="reset" variant="secondary" @click="onReset" class="shrink-0">Reset</PButton>
    </div>
  </form>
</template>
