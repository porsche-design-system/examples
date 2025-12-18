import {
  PSelect,
  PSelectOption,
  type PSelectProps,
  type SelectChangeEventDetail,
} from '@porsche-design-system/components-react/ssr';
import type { Theme } from '../../models/theme.ts';

type ThemeSelectProps = {
  value: Theme;
  onChange: (event: CustomEvent<SelectChangeEventDetail>) => void;
} & Partial<PSelectProps>;

export const ThemeSelect = ({ value = 'light', onChange, ...rest }: ThemeSelectProps) => {
  return (
    <PSelect name="theme" value={value} onChange={onChange} label="Theme" compact={true} {...rest}>
      <PSelectOption value="light">Light</PSelectOption>
      <PSelectOption value="dark">Dark</PSelectOption>
      <PSelectOption value="auto">Auto</PSelectOption>
    </PSelect>
  );
};
