import { PInputText, type PInputTextProps } from '@porsche-design-system/components-react';
import type { PropsWithChildren } from 'react';
import { type Control, Controller, type ControllerProps, type FieldValues, type Path } from 'react-hook-form';

type FormPInputTextProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: ControllerProps<T>['rules'];
} & PInputTextProps;

export const FormPInputText = <T extends FieldValues>({
  name,
  control,
  rules,
  children,
  ...rest
}: PropsWithChildren<FormPInputTextProps<T>>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { name, onChange, onBlur, value }, fieldState }) => (
        <PInputText
          name={name}
          onBlur={onBlur}
          onInput={(e) => onChange((e.target as HTMLElement & { value: string }).value)}
          value={value}
          state={fieldState.error ? 'error' : 'none'}
          {...rest}
        >
          {children}
          {fieldState.error?.message && <span slot="message">{fieldState.error.message}</span>}
        </PInputText>
      )}
    />
  );
};
