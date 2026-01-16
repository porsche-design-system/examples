import './style.css';
import viteLogo from '/vite.svg';
import typescriptLogo from './typescript.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `  
    <main class="grid-template">
      <div class="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-lg">
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
      
    <form id="registerForm" class="col-wide grid grid-cols-subgrid gap-y-fluid-md">
      <p-heading class="col-wide">Register</p-heading>
      
      <p-radio-group name="accountType" label="Account Type" required="true" class="col-wide">
        <p-radio-group-option label="Personal" value="personal"></p-radio-group-option>
        <p-radio-group-option label="Business" value="business"></p-radio-group-option>
      </p-radio-group>

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
}

setupForm(document.querySelector<HTMLFormElement>('#registerForm')!);
