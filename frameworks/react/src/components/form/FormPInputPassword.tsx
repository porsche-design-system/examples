import { PInputPassword, type PInputPasswordProps } from '@porsche-design-system/components-react';
import type { PropsWithChildren } from 'react';
import { type Control, Controller, type ControllerProps, type FieldValues, type Path } from 'react-hook-form';

type FormPInputPasswordProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: ControllerProps<T>['rules'];
} & PInputPasswordProps;

export const FormPInputPassword = <T extends FieldValues>({
  name,
  control,
  rules,
  children,
  ...rest
}: PropsWithChildren<FormPInputPasswordProps<T>>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={false}
      render={({ field: { name, onChange, onBlur, value }, fieldState }) => {
        const messages = fieldState.error?.types && Object.values(fieldState.error.types as Record<string, string>);
        return (
          <PInputPassword
            name={name}
            onBlur={onBlur}
            onInput={(e) => {
              onChange((e as any).detail.target.value); // TODO: Change to onChange and target.value after PDS update
            }}
            value={value}
            state={fieldState.error ? 'error' : 'none'}
            {...rest}
          >
            {children}
            {messages ? (
              <span slot="message">
                {messages.map((msg) => (
                  <div key={msg}>{msg}</div>
                ))}
              </span>
            ) : (
              fieldState.error?.message && <span slot="message">{fieldState.error.message}</span>
            )}
          </PInputPassword>
        );
      }}
    />
  );
};
