import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Form from '@/components/Form.vue';

describe('Form', () => {
  it('renders properly', () => {
    const wrapper = mount(Form);
    expect(wrapper.text()).toContain('Register');
  });
});
