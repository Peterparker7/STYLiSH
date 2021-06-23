import {updateCartNumber, loginButton} from './common.js';
const renderThankPage =(function showThankPage(){
    let session = JSON.parse(sessionStorage.getItem('number'));
    let orderNumber =document.querySelector("#orderNumber");
    orderNumber.innerText=session.number;
    localStorage.setItem('cart', JSON.stringify([]));
    sessionStorage.removeItem("number");
})();

updateCartNumber();
loginButton();



