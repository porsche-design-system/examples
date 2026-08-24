import { PorscheDesignSystemProvider } from '@porsche-design-system/components-vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Form from '@/components/Form.vue';

describe('Form', () => {
  it('renders properly', () => {
    const wrapper = mount({
      components: { PorscheDesignSystemProvider, Form },
      template: '<PorscheDesignSystemProvider><Form /></PorscheDesignSystemProvider>',
    });
    expect(wrapper.text()).toContain('Register');
  });
});
