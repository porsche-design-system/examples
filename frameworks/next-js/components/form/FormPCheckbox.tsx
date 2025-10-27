'use client';

import {
  type CheckboxUpdateEventDetail,
  PCheckbox,
  type PCheckboxProps,
} from '@porsche-design-system/components-react/ssr';
import type { PropsWithChildren } from 'react';
import { type Control, Controller, type ControllerProps, type FieldValues, type Path } from 'react-hook-form';

type FormPCheckboxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: ControllerProps<T>['rules'];
} & PCheckboxProps;

export const FormPCheckbox = <T extends FieldValues>({
  name,
  control,
  rules,
  children,
  ...rest
}: PropsWithChildren<FormPCheckboxProps<T>>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { name, onChange, onBlur, value }, fieldState }) => (
        <PCheckbox
          name={name}
          onBlur={onBlur}
          onUpdate={(e: CustomEvent<CheckboxUpdateEventDetail>) => onChange(e.detail.checked)}
          checked={value}
          state={fieldState.error ? 'error' : 'none'}
          {...rest}
        >
          {children}
          {fieldState.error?.message && <span slot="message">{fieldState.error.message}</span>}
        </PCheckbox>
      )}
    />
  );
};
