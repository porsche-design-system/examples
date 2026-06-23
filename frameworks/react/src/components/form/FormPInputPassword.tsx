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
              onChange((e as CustomEvent<{ target: HTMLInputElement }>).detail.target.value); // TODO: Change to onChange and target.value after PDS update
            }}
            value={value}
            state={fieldState.error ? 'error' : 'none'}
            {...rest}
          >
            {children}
            {messages ? (
              <div slot="message">
                {messages.map((msg) => (
                  <p key={msg}>{msg}</p>
                ))}
              </div>
            ) : (
              fieldState.error?.message && <span slot="message">{fieldState.error.message}</span>
            )}
          </PInputPassword>
        );
      }}
    />
  );
};
