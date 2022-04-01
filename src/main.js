import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faKey, faSearch, faHome, faCloud, faThumbtack, faCoins, faWarehouse, faMapMarkerAlt, faSign, faAngleDown, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import config from "../config/config.js";
global.config = config;

library.add(faUser, faKey, faSearch, faHome, faCloud, faThumbtack, faCoins, faWarehouse, faMapMarkerAlt, faSign, faAngleDown, faSync);

createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .use(router)
    .mount('#vueapp');