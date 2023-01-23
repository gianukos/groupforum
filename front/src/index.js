import App from "./components/app.js"

const app = Vue.createApp({
    render: () => Vue.h(App),
});
app.mount('#app');

