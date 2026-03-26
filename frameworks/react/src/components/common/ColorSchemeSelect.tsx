import {
  PSelect,
  PSelectOption,
  type PSelectProps,
  type SelectChangeEventDetail,
} from '@porsche-design-system/components-react';
import type { ColorScheme } from '../../models/colorScheme.ts';

type ThemeSelectProps = {
  value: ColorScheme;
  onChange: (event: CustomEvent<SelectChangeEventDetail>) => void;
} & Partial<PSelectProps>;

export const ColorSchemeSelect = ({ value = 'scheme-light-dark', onChange, ...rest }: ThemeSelectProps) => {
  return (
    <PSelect name="color-scheme" value={value} onChange={onChange} label="Color Scheme" compact={true} {...rest}>
      <PSelectOption value="scheme-light">Light</PSelectOption>
      <PSelectOption value="scheme-dark">Dark</PSelectOption>
      <PSelectOption value="scheme-light-dark">Light Dark</PSelectOption>
    </PSelect>
  );
};
