TPDirect.setupSDK(12348, "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF", "sandbox");
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: '#card-expiration-date',
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}

TPDirect.card.setup({
    // Display ccv field
 
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})

let payBtn=document.querySelector(".payButton");
payBtn.addEventListener('click',()=>{
    // checkLogin();
    
    if (checkForm()==="pass"){
            getPrime();
    }
})




// async function checkLogin(){
//     let loginstatus;
//     // await FB.getLoginStatus(function(response){
//     //     const {status, authResponse} = response;

//     //     console.log("!!!!!"+status);
//     //     loginstatus = status;
//     //     const token = {
//     //         "provider": authResponse.graphDomain,
//     //         "access_token": authResponse.accessToken,
//     //     }
//     //     console.log(token);

//     //     fetchFB(token);
//     //     console.log(fetchFB(token));
//     // })
    
//         if (loginstatus==="connected"){
//             return "pass";
//         }
//         else{
//             alert("請先登入");
//         }
// }

function checkForm(){
    let cartArray = localStorage.getItem('cart');
    let name = document.getElementById("orderName");
    let email = document.getElementById("orderEmail");
    let phone = document.getElementById("orderPhone");
    let address = document.getElementById("orderAddress");
    let shipping = "delivery";
    let payment = "credit_card";
    let time = document.querySelectorAll(".form-field input[type=radio]");
    console.log(time);
    let selectedTime=[...time].filter(data => data.checked===true);
    console.log(selectedTime);
    if (JSON.parse(cartArray).length>0){
        if(name.value === ""){
            alert("請輸入姓名");
            // return "error";
        }
        else if(email.value ===""){
            alert("請輸入email");
            // return "error";
        }
        else if(phone.value ===""){
            alert("請輸入電話號碼");
            // return "error";
        }
        else if(address.value===""){
            alert("請輸入地址")
            // return "error";
        }
        else if(selectedTime.length===0){
            alert("請選擇配送時間");
            // return "error";
        }
        else{
            return "pass";
        }
    }
    
}
// TPDirect.card.onUpdate(function (update) {
//     // update.canGetPrime === true
//     let payBtn=document.querySelector(".payButton");
//     // update.canGetPrime === true
//     // --> you can call TPDirect.card.getPrime()
//     if (update.canGetPrime) {
//         console.log("cangetPrime");
//         TPDirect.card.getPrime();
//         payBtn.addEventListener('click', ()=>{
//             if (update.canGetPrime) {
//                 console.log("cangetPrime");
//                 let name = document.getElementById("orderName");
//                 let email = document.getElementById("orderEmail").value;
//                 let phone = document.getElementById("orderPhone").value;
//                 let address = document.getElementById("orderAddress").value;
//                 let shipping = "delivery";
//                 let payment = "credit_card";
//                 let time = document.querySelector(".form-field input[type=radio]:checked").id;
//                 console.dir(name);
//                 if(name.value === ""){
//                     alert("name is missing");
//                 }
            
//                 // Enable submit Button to get prime.
//                 // submitButton.removeAttribute('disabled')
                
        
//             } 
            
//         })
//         console.log(payBtn);
//         payBtn.removeAttribute('disabled');
//         payBtn.classList.remove("disableBtn");
//         console.log(payBtn);
//     }
        
        
//     else {
//         payBtn.setAttribute('disabled', true);
//         payBtn.classList.add("disableBtn");
//         // Disable submit Button to get prime.
//         // submitButton.setAttribute('disabled', true)
//     }
// })




function getPrime(){
    TPDirect.card.getPrime(function(result){
        if (result.status !== 0) {
            // console.error('getPrime error 信用卡資訊有誤');
            alert('信用卡資訊不完整');
          }
          cardFieldCheck();
          let prime = result.card.prime;
          console.log('getPrime success: ' + prime);
          let orderData = getOrderData();
          
          let body ={
            prime: prime,
            order: {
                "shipping": orderData.shipping,
                "payment": orderData.payment,
                "subtotal": orderData.subtotal,
                "freight": orderData.freight,
                "total": orderData.total,
                "recipient": {
                "name": orderData.name,
                "phone": orderData.phone,
                "email": orderData.email,
                "address": orderData.address,
                "time": orderData.time
                },
        
            list: orderData.cartList
        
            }
        }
        console.log(body);
        // if(checkLogin()==="pass"){
          fetchPrimeData(body);
        // }
    })
}

function getOrderData(){
    let subtotal = document.querySelector(".summary .subtotal .value span").innerText;
    let freight = document.querySelector(".summary .freight .value span").innerText;
    let total = document.querySelector(".summary .total .value span").innerText;
    let name = document.getElementById("orderName").value;
    let email = document.getElementById("orderEmail").value;
    let phone = document.getElementById("orderPhone").value;
    let address = document.getElementById("orderAddress").value;
    let shipping = "delivery";
    let payment = "credit_card";
    let time = document.querySelector(".form-field input[type=radio]:checked").id;
    
    let localStorageArray = JSON.parse(localStorage.getItem('cart'));
    console.log(localStorageArray);
    let cartList=[];
    localStorageArray.forEach((data, index)=>{
        let list = {
            "id": data.id,
            "name": data.name,
            "price": data.price,
            "color":{
                "code": data.color.code,
                "name": data.color.name
            },
            "size": data.size,
            "qty": data.qty
        }
        cartList.push(list);
    })

    return {shipping, payment, subtotal, freight, total, name, email, phone, address, time, cartList};

}



//prime token送給 order checkout api
async function fetchPrimeData(body){
    new Promise((resolve, reject)=>{
        FB.getLoginStatus(function(response){
            if(response.status==="connected"){
                const token={
                    "provider": response.authResponse.graphDomain,
                    "access_token": response.authResponse.accessToken,
                }
                resolve(token);
            }
            else{
                alert('請先登入');
            }
        })
    })
    .then(data=>{
        console.log(data);
        return getSignInToken(data);
    })
    .then(data=>{
        console.log(data);
        return getOrderNumber(body, data);
    })
    .then(order=>{
        console.log(order);
        const orderNum =  order.data;
        console.log(orderNum);
        sessionStorage.setItem("number", JSON.stringify(orderNum));
        window.location.replace("./thankyou.html")
    })
    

    
    
   

}
async function getSignInToken(token){
    const getAccessToken =  await fetch('https://api.appworks-school.tw/api/1.0//user/signin',{
            body: JSON.stringify(token),
            headers: {
            'content-type': 'application/json'
            },
            method: 'POST',
        })
        .then(res=>{
            return res.json();
        })
        console.log("1."+getAccessToken);
        return getAccessToken.data.access_token;
}
async function getOrderNumber(orderBody, access_token){
    const fetchResponse =  await fetch('https://api.appworks-school.tw/api/1.0/order/checkout', {
            body: JSON.stringify(orderBody),
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            
            method: 'POST',
        })
        .then(res=>{
            return res.json();
        })
        console.log("2."+fetchResponse);
        return fetchResponse;
}



function cardFieldCheck(){
    let check = TPDirect.card.getTappayFieldsStatus();
    if (check.status.number === 2) {
        // setNumberFormGroupToError()
        alert('卡片號碼欄位錯誤');
    } 

    if (check.status.expiry === 2) {
        // setNumberFormGroupToError()
        alert('卡片日期錯誤');
    } 

    if (check.status.ccv === 2) {
        // setNumberFormGroupToError()
        alert('卡片檢查碼有誤');
    } 
}





//===============tappay code===============
//     TPDirect.card.onUpdate(function (update) {
//         // update.canGetPrime === true
//         // --> you can call TPDirect.card.getPrime()
//         if (update.canGetPrime) {
//             // Enable submit Button to get prime.
//             // submitButton.removeAttribute('disabled')
//         } else {
//             // Disable submit Button to get prime.
//             // submitButton.setAttribute('disabled', true)
//         }
    
//         // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
//         if (update.cardType === 'visa') {
//             // Handle card type visa.
//         }
    
//         // number 欄位是錯誤的
//         if (update.status.number === 2) {
//             // setNumberFormGroupToError()
//             // alert('卡片號碼欄位錯誤');
//         } else if (update.status.number === 0) {
//             // setNumberFormGroupToSuccess()
//         } else {
//             // setNumberFormGroupToNormal()
//         }
    
//         if (update.status.expiry === 2) {
//             // setNumberFormGroupToError()
//             // alert('卡片日期錯誤');
//         } else if (update.status.expiry === 0) {
//             // setNumberFormGroupToSuccess()
//         } else {
//             // setNumberFormGroupToNormal()
//         }
    
//         if (update.status.ccv === 2) {
//             // setNumberFormGroupToError()
//             // alert('卡片檢查碼有誤');
//         } else if (update.status.ccv === 0) {
//             // setNumberFormGroupToSuccess()
//         } else {
//             // setNumberFormGroupToNormal()
//         }
//     })

// // call TPDirect.card.getPrime when user submit form to get tappay prime
// // $('form').on('submit', onSubmit)

// function onSubmit(event) {
//     event.preventDefault()

//     // 取得 TapPay Fields 的 status
//     const tappayStatus = TPDirect.card.getTappayFieldsStatus()

//     // 確認是否可以 getPrime
//     if (tappayStatus.canGetPrime === false) {
//         alert('can not get prime')
//         return
//     }

//     // Get prime
//     TPDirect.card.getPrime((result) => {
//         if (result.status !== 0) {
//             alert('get prime error ' + result.msg)
//             return
//         }
//         alert('get prime 成功，prime: ' + result.card.prime)

//         // send prime to your server, to pay with Pay by Prime API .
//         // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
//     })
// }