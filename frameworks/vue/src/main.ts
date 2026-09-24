import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia as unknown as Parameters<typeof app.use>[0]);
app.use(router);

app.mount('#app');
