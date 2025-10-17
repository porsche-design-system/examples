<script setup lang="ts">
import {
  PButton,
  PCheckbox,
  PHeading,
  PInputEmail,
  PInputPassword,
  PInputTel,
  PInputText,
  PSelect,
  PSelectOption,
} from '@porsche-design-system/components-vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { z } from 'zod';

const schema = z.object({
  salutation: z.string().nonempty('Please enter your salutation'),
  title: z.string().optional(),
  firstname: z.string().nonempty('Please enter your first name'),
  lastname: z.string().nonempty('Please enter your last name'),
  email: z.string().email('Invalid email').nonempty('Please enter your email'),
  phone: z.string().optional(),
  privacyPolicy: z
    .boolean()
    .refine((v) => v === true, 'Please accept our privacy policy so that we can process your request'),
  password: z
    .string()
    .nonempty('Please enter your password')
    .min(8, 'Must be at least 8 characters long')
    .regex(/\d/, 'Must contain a number')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[!@#$%^&*]/, 'Must contain a special character (!@#$%^&*)'),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    salutation: '',
    title: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    privacyPolicy: false,
    password: '',
  },
});

const onSubmit = handleSubmit((values) => {
  console.log(values);
});

const onReset = () => {
  resetForm();
};

const { value: salutation, errorMessage: salutationError, meta: salutationMeta } = useField('salutation');
const { value: title, errorMessage: titleError, meta: titleMeta } = useField('title');
const { value: firstname, errorMessage: firstnameError, meta: firstnameMeta } = useField('firstname');
const { value: lastname, errorMessage: lastnameError, meta: lastnameMeta } = useField('lastname');
const { value: email, errorMessage: emailError, meta: emailMeta } = useField('email');
const { value: phone, errorMessage: phoneError, meta: phoneMeta } = useField('phone');
const { value: password, errorMessage: passwordError, meta: passwordMeta } = useField('password');
const { value: privacyPolicy, errorMessage: privacyPolicyError, meta: privacyPolicyMeta } = useField('privacyPolicy');
</script>

<template>
  <form class="col-wide grid grid-cols-subgrid gap-y-fluid-md" @submit.prevent="onSubmit">
    <PHeading class="col-wide">Register</PHeading>

    <PHeading size="medium" class="col-wide">Personal Data</PHeading>

    <PSelect
        v-model="salutation"
        :name="'salutation'"
        :label="'Salutation'"
        :required="true"
        :state="salutationMeta.touched && salutationError ? 'error' : 'none'"
        class="col-wide xs:col-span-one-half sm:col-span-4"
    >
      <PSelectOption :value="'mr'">Mr.</PSelectOption>
      <PSelectOption :value="'mrs'">Mrs.</PSelectOption>
      <span v-if="salutationMeta.touched && salutationError" slot="message">{{ salutationError }}</span>
    </PSelect>

    <PSelect name="title" v-model="title" label="Title" :state="titleMeta.touched && titleError ? 'error' : 'none'" class="col-wide xs:col-span-one-half sm:col-span-4">
      <PSelectOption></PSelectOption>
      <PSelectOption :value="'dr'">Dr.</PSelectOption>
      <PSelectOption :value="'prof'">Prof.</PSelectOption>
      <PSelectOption :value="'prof-dr'">Prof. Dr.</PSelectOption>
      <span v-if="titleMeta.touched && titleError" slot="message">{{ titleError }}</span>
    </PSelect>

    <PInputText name="firstname" v-model="firstname" label="First Name" :required="true" :state="firstnameMeta.touched && firstnameError ? 'error' : 'none'" class="col-wide sm:col-start-1 sm:col-span-one-half">
      <span v-if="firstnameMeta.touched && firstnameError" slot="message">{{ firstnameError }}</span>
    </PInputText>

    <PInputText name="lastname" v-model="lastname" label="Last Name" :required="true" :state="lastnameMeta.touched && lastnameError ? 'error' : 'none'" class="col-wide sm:col-span-one-half">
      <span v-if="lastnameMeta.touched && lastnameError" slot="message">{{ lastnameError }}</span>
    </PInputText>

    <PInputEmail name="email" v-model="email" label="Email" :required="true" :indicator="true" :state="emailMeta.touched && emailError ? 'error' : 'none'" class="col-wide sm:col-start-1 sm:col-span-one-half">
      <span v-if="emailMeta.touched && emailError" slot="message">{{ emailError }}</span>
    </PInputEmail>

    <PInputTel name="phone" v-model="phone" label="Phone" :indicator="true" class="col-span-one-half" :state="phoneMeta.touched && phoneError ? 'error' : 'none'">
      <span v-if="phoneMeta.touched && phoneError" slot="message">{{ phoneError }}</span>
    </PInputTel>

    <PHeading size="medium" class="col-wide">Password</PHeading>
    <PInputPassword name="password" v-model="password" label="Password" :required="true" :toggle="true" :state="passwordMeta.touched && passwordError ? 'error' : 'none'" class="col-wide sm:col-start-1 sm:col-span-one-half">
      <span v-if="passwordMeta.touched && passwordError" slot="message">{{ passwordError }}</span>
    </PInputPassword>

    <PCheckbox name="privacyPolicy" v-model="privacyPolicy" :required="true" :state="privacyPolicyMeta.touched && privacyPolicyError ? 'error' : 'none'" class="col-wide">
      <span slot="label">I have read and understood the Privacy Policy</span>
      <span v-if="privacyPolicyMeta.touched && privacyPolicyError" slot="message">{{ privacyPolicyError }}</span>
    </PCheckbox>

    <div class="flex gap-fluid-sm">
      <PButton type="submit">Submit</PButton>
      <PButton type="reset" variant="secondary" @click="onReset">Reset</PButton>
    </div>
  </form>
</template>
