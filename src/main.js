import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import './assets/saas/styles.scss';

import { createApp } from 'vue';

import App from './App.vue';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';



const app = createApp(App);
app.use(PrimeVue);

app.component('InputText', InputText);
app.component('InputNumber', InputNumber);

app.mount('#app');

