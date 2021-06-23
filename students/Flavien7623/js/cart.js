import { loginButton, updateCartNumber } from './common.js';

let setfreight = 60;
showAllCart();
showSummary();

function getLocalStorage(){
    if(localStorage.cart === undefined){
        let cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    let cartArray = JSON.parse(localStorage.getItem('cart'));
    return cartArray;
}

function showAllCart(){
    const cartItems = document.querySelector('.cartItems');
    cartItems.innerHTML = ``;
    let cartData=getLocalStorage();
    let titleNum = document.querySelector(".cartContainer .header .title span");
    titleNum.innerHTML = cartData.length;

    if (cartData.length===0){
        cartItems.innerHTML = `購物車中沒有商品喔`;
        cartItems.style.textAlign="center";
    }

    cartData.forEach((data, index)=>{
        let qtyOption="";
        for (let i=1; i<=data.stock;i++){
            if(i.toString()===data.qty){
                qtyOption+=`<option selected>${data.qty}</option>`;
            }
            else{
                qtyOption+=`<option>${i.toString()}</option>`;
            }
        }

        cartItems.innerHTML += `
        <div class="cartItem">    
            <div class="item__image">
                <img src ="${data.image}">
            </div>
            <div class="item__detail">
                <div class="item__name">${data.name}</div>
                <div class="item__id">${data.id}</div>
                <div class="item__color">顏色｜${data.color.name}</div>
                <div class="item__size">尺寸｜${data.size}</div>
            </div>
            <div class="item__quantity">
                <div class="mobile-header">數量</div>
                <select>${qtyOption}</select>
            </div>
            <div class="item__price">
                <div class="mobile-header">單價</div>
                NT. ${data.price}
            </div>
            <div class="item__subtotal">
                <div class="mobile-header">小計</div>
                NT. <span>${data.price*data.qty}</span>
            </div>
            <div class="remove">
                <img src="images/cart-remove.png">
            </div>
        </div>`;

        // let select = document.querySelector("select");
        // console.log(select);
        // select.addEventListener('change', (e)=>{
        //     let currentQty = e.target.options.selectedIndex+1;
        //     let totalPrice = currentQty*data.price;
        //     let total = document.querySelector(".cartItem .item__subtotal span");
        //     console.log(total);
        //     console.log(e);
        //     total.innerHTML = totalPrice;
        // })
        
        // let qtySelect=document.querySelector(".item__quantity select");
        // for (let i=1; i<=data.stock;i++){
        //     let qtyOption = document.createElement("option");
        //     let optionValue=document.querySelectorAll(".item__quantity select option")[i-1];
        //     optionValue.innerHTML = i;
        //     qtySelect.appendChild(qtyOption);
        // }
        // console.log(qtySelect);
    })

    let selects = document.querySelectorAll("select");
        selects.forEach((select, index)=>{
            select.addEventListener('change', (e)=>{
                let currentQty = e.target.options.selectedIndex+1;
                let totalPrice = currentQty*cartData[index].price;
                let total = document.querySelectorAll(".cartItem .item__subtotal span")[index];
                total.innerHTML = totalPrice;

                cartData[index].qty = currentQty.toString();
                localStorage.setItem('cart',JSON.stringify(cartData));
                showSummary();
            })

        })

    let removeBtn = document.querySelectorAll(".remove");
    removeBtn.forEach((btn, index)=>{
        btn.addEventListener('click', ()=>{
            removeCartItem(index);
            alert("已從購物車移除");
            // e.target.parentNode.parentNode.remove();
        })
    })
}

function showSummary(){
    let totals=0;
    let cartData = getLocalStorage();
    cartData.forEach((data, index)=>{
        let total = data.qty*data.price;
        totals+=total;
    })

    let subtotal = document.querySelector(".summary .subtotal .value span");
    subtotal.innerHTML = totals;
    let freight = document.querySelector(".summary .freight .value span");
    let total = document.querySelector(".summary .total .value span");
    let payButton = document.querySelector(".payButton");

    if (totals===0){
        freight.innerHTML = 0;
        total.innerHTML = 0;
        payButton.style.cursor="not-allowed";
        payButton.addEventListener('click',()=>{
            console.log("weaoif");
            alert("購物車空空的耶");
        })
    }
    else{
        freight.innerHTML = setfreight;
        total.innerHTML = totals+setfreight;
    }
    
}
// function removeCartItem(){
//     // const removedCartIndex;
//     let localStorageArray = getLocalStorage();
//     console.log(localStorageArray);
//     localStorageArray.forEach((data, index)=>{
//         let removeBtn = document.querySelectorAll('.remove')[index];
//         removeBtn.addEventListener('click', (e)=>{
//         // removedCartIndex = index;
//         console.dir(e.target);
//         console.log(getLocalStorage());
//         console.log(index);
//         // let localStorageArray = getLocalStorage();
//         let newArray = localStorageArray.splice(index, 1)
//         console.log(localStorageArray);
//         localStorage.setItem('cart',JSON.stringify(localStorageArray));
//         localStorageArray = getLocalStorage();
//         updateCart();
//         alert("已從購物車移除");
//         e.target.parentNode.parentNode.remove();
//         })
//         // const Item 
//     })
    
// }


function removeCartItem(index){
    let localStorageArray = getLocalStorage();
    localStorageArray.splice(index, 1)
    localStorage.setItem('cart',JSON.stringify(localStorageArray));
    updateCartNumber();
    showAllCart();
    showSummary();
}



updateCartNumber();
loginButton();