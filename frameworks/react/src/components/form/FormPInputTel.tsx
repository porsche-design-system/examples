import { PInputTel, type PInputTelProps } from '@porsche-design-system/components-react';
import type { PropsWithChildren } from 'react';
import { type Control, Controller, type ControllerProps, type FieldValues, type Path } from 'react-hook-form';

type FormPInputTelProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: ControllerProps<T>['rules'];
} & PInputTelProps;

export const FormPInputTel = <T extends FieldValues>({
  name,
  control,
  rules,
  children,
  ...rest
}: PropsWithChildren<FormPInputTelProps<T>>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { name, onChange, onBlur, value }, fieldState }) => (
        <PInputTel
          name={name}
          onBlur={onBlur}
          onInput={(e) => onChange((e.target as HTMLElement & { value: string }).value)}
          value={value}
          state={fieldState.error ? 'error' : 'none'}
          {...rest}
        >
          {children}
          {fieldState.error?.message && <span slot="message">{fieldState.error.message}</span>}
        </PInputTel>
      )}
    />
  );
};
