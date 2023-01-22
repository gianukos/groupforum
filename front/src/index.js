import App from "./components/app.js"

const app = Vue.createApp({
    render: () => Vue.h(App),
});
app.mount('#app');

// if (sessionStorage.getItem("sessionUser")&&appMain.data().emailAddress===''){
//         // page properties reloaded when user is logged in 
//         document.getElementsByClassName("welcome")[0].style.display  = 'none';
//         document.getElementsByClassName("welcome")[1].style.display  = 'flex';	
//         document.getElementById('user').style.display='flex';
// }

