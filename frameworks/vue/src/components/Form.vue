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
import { computed } from 'vue';
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

type FormValues = z.input<typeof schema>;

const { handleSubmit, resetForm, errors, errorBag, setFieldTouched, values } = useForm<FormValues>({
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

const formErrors = computed(() => errors.value);
const passwordErrors = computed(() => errorBag.value.password);

const onSubmit = handleSubmit((values) => {
  console.log(values);
});

const touchField = (field: keyof FormValues) => {
  setFieldTouched(field, true);
};

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
      v-model:value="values.accountType"
      @blur="touchField('accountType')"
      :required="true"
      :state="formErrors.accountType ? 'error' : 'none'"
      class="col-wide"
    >
      <PRadioGroupOption label="Personal" value="personal"></PRadioGroupOption>
      <PRadioGroupOption label="Business" value="business"></PRadioGroupOption>
      <span v-if="formErrors.accountType" slot="message">{{ formErrors.accountType }}</span>
    </PRadioGroup>

    <PHeading size="medium" class="col-wide">Personal Data</PHeading>

    <PSelect
        v-model:value="values.salutation"
        @blur="touchField('salutation')"
        :name="'salutation'"
        :label="'Salutation'"
        :required="true"
        :state="formErrors.salutation ? 'error' : 'none'"
        class="col-wide xs:col-span-one-half sm:col-span-4"
    >
      <PSelectOption :value="'mr'">Mr.</PSelectOption>
      <PSelectOption :value="'mrs'">Mrs.</PSelectOption>
      <span v-if="formErrors.salutation" slot="message">{{ formErrors.salutation }}</span>
    </PSelect>

    <PSelect name="title" v-model:value="values.title" @blur="touchField('title')" label="Title" :state="formErrors.title ? 'error' : 'none'" class="col-wide xs:col-span-one-half sm:col-span-4">
      <PSelectOption></PSelectOption>
      <PSelectOption :value="'dr'">Dr.</PSelectOption>
      <PSelectOption :value="'prof'">Prof.</PSelectOption>
      <PSelectOption :value="'prof-dr'">Prof. Dr.</PSelectOption>
      <span v-if="formErrors.title" slot="message">{{ formErrors.title }}</span>
    </PSelect>

    <PInputText name="firstname" v-model:value="values.firstname" @blur="touchField('firstname')" label="First Name" :required="true" :state="formErrors.firstname ? 'error' : 'none'" class="col-wide sm:col-start-1 sm:col-span-one-half">
      <span v-if="formErrors.firstname" slot="message">{{ formErrors.firstname }}</span>
    </PInputText>

    <PInputText name="lastname" v-model:value="values.lastname" @blur="touchField('lastname')" label="Last Name" :required="true" :state="formErrors.lastname ? 'error' : 'none'" class="col-wide sm:col-span-one-half">
      <span v-if="formErrors.lastname" slot="message">{{ formErrors.lastname }}</span>
    </PInputText>

    <PInputEmail name="email" v-model:value="values.email" @blur="touchField('email')" label="Email" :required="true" :indicator="true" :state="formErrors.email ? 'error' : 'none'" class="col-wide sm:col-start-1 sm:col-span-one-half">
      <span v-if="formErrors.email" slot="message">{{ formErrors.email }}</span>
    </PInputEmail>

    <PInputTel name="phone" v-model:value="values.phone" @blur="touchField('phone')" label="Phone" :indicator="true" class="col-wide sm:col-span-one-half" :state="formErrors.phone ? 'error' : 'none'">
      <span v-if="formErrors.phone" slot="message">{{ formErrors.phone }}</span>
    </PInputTel>

    <PHeading size="medium" class="col-wide">Password</PHeading>
    <PInputPassword name="password" v-model:value="values.password" @blur="touchField('password')" label="Password" :required="true" :toggle="true" :state="formErrors.password ? 'error' : 'none'" class="col-wide sm:col-start-1 sm:col-span-one-half">
      <div v-if="passwordErrors" slot="message">
        <p v-for="(error, index) in passwordErrors" :key="index" class="error">
          {{ error }}
        </p>
      </div>
    </PInputPassword>

    <PCheckbox name="privacyPolicy" v-model:checked="values.privacyPolicy" @blur="touchField('privacyPolicy')" :required="true" :state="formErrors.privacyPolicy ? 'error' : 'none'" class="col-wide">
      <span slot="label">I have read and understood the Privacy Policy</span>
      <span v-if="formErrors.privacyPolicy" slot="message">{{ formErrors.privacyPolicy }}</span>
    </PCheckbox>

    <div class="flex gap-fluid-sm">
      <PButton type="submit" class="shrink-0">Submit</PButton>
      <PButton type="reset" variant="secondary" @click="onReset" class="shrink-0">Reset</PButton>
    </div>
  </form>
</template>
