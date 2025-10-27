'use client';

import { PSelect, type PSelectProps, type SelectUpdateEventDetail } from '@porsche-design-system/components-react/ssr';
import type { PropsWithChildren } from 'react';
import { type Control, Controller, type ControllerProps, type FieldValues, type Path } from 'react-hook-form';

type FormPSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: ControllerProps<T>['rules'];
} & PSelectProps;

export const FormPSelect = <T extends FieldValues>({
  name,
  control,
  rules,
  children,
  ...rest
}: PropsWithChildren<FormPSelectProps<T>>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { name, onChange, onBlur, value }, fieldState }) => (
        <PSelect
          name={name}
          onBlur={onBlur}
          onUpdate={(e: CustomEvent<SelectUpdateEventDetail>) => onChange(e.detail.value)}
          value={value}
          state={fieldState.error ? 'error' : 'none'}
          {...rest}
        >
          {children}
          {fieldState.error?.message && <span slot="message">{fieldState.error.message}</span>}
        </PSelect>
      )}
    />
  );
};
