import { PInputEmail, type PInputEmailProps } from '@porsche-design-system/components-react/ssr';
import type { PropsWithChildren } from 'react';
import { type Control, Controller, type ControllerProps, type FieldValues, type Path } from 'react-hook-form';

type FormPInputEmailProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: ControllerProps<T>['rules'];
} & PInputEmailProps;

export const FormPInputEmail = <T extends FieldValues>({
  name,
  control,
  rules,
  children,
  ...rest
}: PropsWithChildren<FormPInputEmailProps<T>>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { name, onChange, onBlur, value }, fieldState }) => (
        <PInputEmail
          name={name}
          onBlur={onBlur}
          onInput={(e) => onChange((e.target as HTMLElement & { value: string }).value)}
          value={value}
          state={fieldState.error ? 'error' : 'none'}
          {...rest}
        >
          {children}
          {fieldState.error?.message && <span slot="message">{fieldState.error.message}</span>}
        </PInputEmail>
      )}
    />
  );
};
