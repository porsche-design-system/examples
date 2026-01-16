import { PRadioGroup, type PRadioGroupProps } from '@porsche-design-system/components-react/ssr';
import type { PropsWithChildren } from 'react';
import { type Control, Controller, type ControllerProps, type FieldValues, type Path } from 'react-hook-form';

type FormPRadioGroupProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: ControllerProps<T>['rules'];
} & PRadioGroupProps;

export const FormPRadioGroup = <T extends FieldValues>({
  name,
  control,
  rules,
  children,
  ...rest
}: PropsWithChildren<FormPRadioGroupProps<T>>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { name, onChange, onBlur, value }, fieldState }) => (
        <PRadioGroup
          name={name}
          onBlur={onBlur}
          onChange={(e) => onChange((e.target as HTMLElement & { value: string }).value)}
          value={value}
          state={fieldState.error ? 'error' : 'none'}
          {...rest}
        >
          {children}
          {fieldState.error?.message && <span slot="message">{fieldState.error.message}</span>}
        </PRadioGroup>
      )}
    />
  );
};
