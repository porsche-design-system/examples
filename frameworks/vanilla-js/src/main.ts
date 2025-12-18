import './style.css';
import viteLogo from '/vite.svg';
import { initTheme, setupThemeSelect } from './theme.ts';
import typescriptLogo from './typescript.svg';

initTheme();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `  
    <main class="grid-template my-fluid-md">
      <div class="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-4xl">
        <p-wordmark class="col-wide"></p-wordmark>
        <h1 class="prose-display-md col-wide">Porsche Design System</h1>
        <div class="col-wide flex gap-4 items-center flex-col sm:flex-row">
         <a href="https://vite.dev" target="_blank">
            <img src="${viteLogo}" class="logo" alt="Vite logo" width="50" />
          </a>
          <a href="https://www.typescriptlang.org/" target="_blank">
            <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" width="50" />
          </a>
        </div>
      </div>  
      
      <div class="col-wide flex justify-items-center gap-fluid-md p-fluid-sm bg-surface rounded-2xl">
        <p-select name="theme" value="auto" label="Theme" compact="true" class="w-48">
          <p-select-option value="light">Light</p-select-option>
          <p-select-option value="dark">Dark</p-select-option>
          <p-select-option value="auto">Auto</p-select-option>
        </p-select>
      </div>
      
      <form id="registerForm" class="col-wide grid grid-cols-subgrid gap-y-fluid-md">
        <p-heading class="col-wide">Register</p-heading>
  
        <p-heading size="medium" class="col-wide">
          Personal Data
        </p-heading>
        <p-select name="salutation" label="Salutation" required="true" class="col-wide xs:col-span-one-half sm:col-span-4">
          <p-select-option value="mr">Mr.</p-select-option>
          <p-select-option value="mrs">Mrs.</p-select-option>
        </p-select>
        <p-select name="title" label="Title" class="col-wide xs:col-span-one-half sm:col-span-4">
          <p-select-option></p-select-option>
          <p-select-option value="dr">Dr.</p-select-option>
          <p-select-option value="prof">Prof.</p-select-option>
          <p-select-option value="prof-dr">Prof. Dr.</p-select-option>
        </p-select>
        <p-input-text name="firstname" label="First name" required class="col-wide sm:col-start-1 sm:col-span-one-half">
        </p-input-text>
        <p-input-text name="lastname" label="Last name" required class="col-wide sm:col-span-one-half">
        </p-input-text>
        <p-input-email name="email" label="Email address" required indicator class="col-wide sm:col-start-1 sm:col-span-one-half">
        </p-input-email>
        <p-input-tel name="phone" label="Phone number" indicator class="col-wide sm:col-span-one-half"></p-input-tel>
  
        <p-heading size="medium" class="col-wide">
          Password
        </p-heading>
  
        <p-input-password name="password" label="Password" required toggle class="col-wide sm:col-start-1 sm:col-span-one-half">        
        </p-input-password>
  
        <p-checkbox name="privacyPolicy" required class="col-wide">
          <span slot="label">I have read and understood the Privacy Policy</span>
        </p-checkbox>
        <div class="flex gap-fluid-sm">
          <p-button type="submit" class="shrink-0">Submit</p-button>
          <p-button type="reset" variant="secondary" class="shrink-0">Reset</p-button>
        </div>
      </form>
    </main> 
`;

export function setupForm(form: HTMLFormElement) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log(data);
  });

  const THEME_TYPES = ['light', 'dark', 'auto'] as const;
  type Theme = (typeof THEME_TYPES)[number];

  const themeLocalStorageKey = 'theme';

  const themeSelect: HTMLElement & { value: Theme } = document.querySelector('p-select[name="theme"]')!;

  const storedTheme = localStorage.getItem(themeLocalStorageKey) as Theme | null;
  if (storedTheme) {
    themeSelect.value = storedTheme;
    document.documentElement.classList.remove('light', 'dark', 'auto');
    document.documentElement.classList.add(storedTheme);
  }

  themeSelect?.addEventListener('change', (e) => {
    const theme = (e.target as HTMLElement & { value: Theme }).value;
    document.documentElement.classList.remove('light', 'dark', 'auto');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  });
}

setupThemeSelect('p-select[name="theme"]');
setupForm(document.querySelector<HTMLFormElement>('#registerForm')!);
