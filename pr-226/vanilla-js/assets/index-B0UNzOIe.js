(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`/examples/pr-226/vanilla-js/vite.svg`,t=`color-scheme`;function n(){return localStorage.getItem(t)||`scheme-light-dark`}function r(e){document.documentElement.classList.remove(`scheme-light`,`scheme-dark`,`scheme-light-dark`),document.documentElement.classList.add(e),localStorage.setItem(t,e)}function i(){let e=n();return r(e),e}function a(e){let t=document.querySelector(e);t&&(t.value=n(),t.addEventListener(`change`,e=>{let t=e.target.value;r(t)}))}var o=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='iconify%20iconify--logos'%20width='32'%20height='32'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%20256%20256'%20%3e%3cpath%20fill='%23007ACC'%20d='M0%20128v128h256V0H0z'%3e%3c/path%3e%3cpath%20fill='%23FFF'%20d='m56.612%20128.85l-.081%2010.483h33.32v94.68h23.568v-94.68h33.321v-10.28c0-5.69-.122-10.444-.284-10.566c-.122-.162-20.4-.244-44.983-.203l-44.74.122l-.121%2010.443Zm149.955-10.742c6.501%201.625%2011.459%204.51%2016.01%209.224c2.357%202.52%205.851%207.111%206.136%208.208c.08.325-11.053%207.802-17.798%2011.988c-.244.162-1.22-.894-2.317-2.52c-3.291-4.795-6.745-6.867-12.028-7.233c-7.76-.528-12.759%203.535-12.718%2010.321c0%201.992.284%203.17%201.097%204.795c1.707%203.536%204.876%205.649%2014.832%209.956c18.326%207.883%2026.168%2013.084%2031.045%2020.48c5.445%208.249%206.664%2021.415%202.966%2031.208c-4.063%2010.646-14.14%2017.879-28.323%2020.276c-4.388.772-14.79.65-19.504-.203c-10.28-1.828-20.033-6.908-26.047-13.572c-2.357-2.6-6.949-9.387-6.664-9.874c.122-.163%201.178-.813%202.356-1.504c1.138-.65%205.446-3.129%209.509-5.485l7.355-4.267l1.544%202.276c2.154%203.29%206.867%207.801%209.712%209.305c8.167%204.307%2019.383%203.698%2024.909-1.26c2.357-2.153%203.332-4.388%203.332-7.68c0-2.966-.366-4.266-1.91-6.501c-1.99-2.845-6.054-5.242-17.595-10.24c-13.206-5.69-18.895-9.224-24.096-14.832c-3.007-3.25-5.852-8.452-7.03-12.8c-.975-3.617-1.22-12.678-.447-16.335c2.723-12.76%2012.353-21.659%2026.25-24.3c4.51-.853%2014.994-.528%2019.424.569Z'%20%3e%3c/path%3e%3c/svg%3e`;i(),document.querySelector(`#app`).innerHTML=`  
    <main class="grid-template my-fluid-md">
      <div class="col-wide grid grid-cols-subgrid justify-items-center gap-fluid-md p-fluid-lg bg-surface rounded-4xl">
        <p-wordmark class="col-wide"></p-wordmark>
        <h1 class="prose-display-md col-wide">Porsche Design System</h1>
        <div class="col-wide flex gap-4 items-center flex-col sm:flex-row">
         <a href="https://vite.dev" target="_blank">
            <img src="${e}" class="logo" alt="Vite logo" width="50" />
          </a>
          <a href="https://www.typescriptlang.org/" target="_blank">
            <img src="${o}" class="logo vanilla" alt="TypeScript logo" width="50" />
          </a>
        </div>
      </div>  
      
      <div class="col-wide flex justify-items-center gap-fluid-md p-fluid-sm bg-surface rounded-2xl">
        <p-select name="color-scheme" value="scheme-light-dark" label="Color Scheme" compact="true" class="w-48">
          <p-select-option value="scheme-light">Light</p-select-option>
          <p-select-option value="scheme-dark">Dark</p-select-option>
          <p-select-option value="scheme-light-dark">Light Dark</p-select-option>
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
`;function s(e){e.addEventListener(`submit`,t=>{t.preventDefault();let n=new FormData(e),r=Object.fromEntries(n.entries());console.log(r)})}a(`p-select[name="color-scheme"]`),s(document.querySelector(`#registerForm`));