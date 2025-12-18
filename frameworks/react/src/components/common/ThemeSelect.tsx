import {
  PPopover,
  PSelect,
  PSelectOption,
  type PSelectProps,
  type SelectChangeEventDetail,
} from '@porsche-design-system/components-react';
import type { Theme } from '../../models/theme.ts';

type ThemeSelectProps = {
  value: Theme;
  onChange: (event: CustomEvent<SelectChangeEventDetail>) => void;
} & Partial<PSelectProps>;

export const ThemeSelect = ({
  value = 'light',
  onChange,
  name = 'theme',
  label = 'Theme',
  hideLabel = false,
  ...rest
}: ThemeSelectProps) => {
  return (
    <PSelect name={name} value={value} onChange={onChange} label={label} hideLabel={hideLabel} compact={true} {...rest}>
      <span slot="label" className="inline-flex gap-static-xs">
        {label}
        <PPopover onClick={(e) => e.preventDefault()}>
          Changes the theme of the application and any Porsche Design System component. It's possible to choose between
          forced theme <b>light</b> and <b>dark</b>. It's also possible to use <b>auto</b>, which applies light or dark
          theme depending on the operating system settings automatically.
        </PPopover>
      </span>
      <PSelectOption value="light">Light</PSelectOption>
      <PSelectOption value="dark">Dark</PSelectOption>
      <PSelectOption value="auto">Auto</PSelectOption>
    </PSelect>
  );
};
