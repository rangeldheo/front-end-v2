import { createApp } from "vue";
import App from "./App.vue";

import { Actions } from "@/store/enums/StoreEnums";
// Importando o Vue Router
import router from "./router";

// Importando o Vuex Store
import store from "./store";

// Importando o ElementPlus
import ElementPlus from "element-plus";

// Importando o i18n para internacionalização
import { createI18n } from "vue-i18n"; // Usando o createI18n corretamente

// Imports para inicialização do app
import ApiService from "@/core/services/ApiService"; // Certifique-se de que ApiService está configurado corretamente
import { initApexCharts } from "@/core/plugins/apexcharts"; // Certifique-se de que initApexCharts está configurado corretamente
import { initInlineSvg } from "@/core/plugins/inline-svg"; // Verifique o setup do inline-svg
import { initVeeValidate } from "@/core/plugins/vee-validate"; // Certifique-se que a validação do VeeValidate esteja funcionando

import "@/core/plugins/prismjs"; // Certifique-se de que o PrismJS está sendo utilizado corretamente

// Importando o VeeValidate e a tradução para PT-BR
import { configure } from "vee-validate";
import ptBR from "@vee-validate/i18n"; // Importando as traduções PT-BR

// Definindo as mensagens de tradução
const messages = {
  en: {
    hello: "Hello",
    welcome: "Welcome to our app",
  },
  pt: {
    hello: "Olá",
    welcome: "Bem-vindo à Fretou Logística inteligente",
  },
};

// Configuração do i18n
const i18n = createI18n({
  locale: "pt", // Idioma padrão
  messages, // Mensagens de tradução
});

// Configuração do Vee-Validate para usar o idioma PT-BR
configure({
  generateMessage: (context) => {
    // Usando o nome da regra ou do campo para buscar a tradução
    const errorKey = context?.rule?.name || context?.field;
    return ptBR[errorKey] || context?.field; // Tenta buscar o erro baseado na chave da regra ou campo
  },
});

// Inicializando a aplicação Vue
const app = createApp(App);

// Usando o Vuex Store
app.use(store);

// Usando o Vue Router
app.use(router);

// Usando o ElementPlus
app.use(ElementPlus);

// Inicializando o ApiService
ApiService.init(app);

// Inicializando plugins e bibliotecas
initApexCharts(app); // Se necessário, verifique a configuração do ApexCharts
initInlineSvg(app); // Verifique a configuração dos SVGs
initVeeValidate(); // Verifique a configuração do VeeValidate

// Usando o i18n para internacionalização
app.use(i18n);

// Montando a aplicação no DOM
app.mount("#app");
