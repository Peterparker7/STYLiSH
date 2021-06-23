import {updateCartNumber} from './common.js'
window.fbAsyncInit = function() {
    FB.init({
      appId            : '302510311271821',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v10.0'
    });
    FB.AppEvents.logPageView(); 
    FB.getLoginStatus(function(response) {
        loginStatus = response.status;
        // showProfile();
        //畫面一載入就先判斷有無登入 render資訊
        statusChangeCallback(response);
    });
};
  // (動態)載入 FB SDK 掛載到window object上
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


let fetchToken={};
let loginStatus={};

loginButton();

function loginButton(){
    let loginBtn = document.querySelector(".btn_member01_normal");
    loginBtn.addEventListener('click', ()=>{
        //每次按鈕先檢查 login status 
        FB.getLoginStatus(function(response){
            statusChangeCallback(response);
            if (response.status === 'connected'){
                window.location.href="./profile.html";
            }
            else{
                FB.login(function(response) {
                    // statusChangeCallback(response);
                    console.log(response);
                    // window.location.href="./index.html";
                }, {scope: 'email'});

            }
        }); 
    });

    let loginBtnRwd = document.querySelector(".loginButton");
    loginBtnRwd.addEventListener('click', ()=>{
        //每次按鈕先檢查 login status 
        FB.getLoginStatus(function(response){
            statusChangeCallback(response);
            if (response.status === 'connected'){
                window.location.href="./profile.html";
            }
            else{
                FB.login(function(response) {
                    // statusChangeCallback(response);
                    console.log(response);
                    // window.location.href="./index.html";
                }, {scope: 'email'});

            }
        }); 
    });
}



function statusChangeCallback(response){
    console.log(response);
    if (response.status === 'connected'){

        const {status, authResponse} = response;
        const token = {
            "provider": authResponse.graphDomain,
            "access_token": authResponse.accessToken,
        }
        //取得FB access_token
        fetchProfileData(token);

        // showProfile();
        // window.location.href="./profile.html";
        
    }
    else if(response.status !== 'connected' && window.location.pathname.includes("profile.html")){
        window.location.replace("./index.html");
    }
    else{
        
    }
}

function showProfile(data){
        const {name, email, picture}=data.user;
        let profile = document.querySelector(".profile");
        profile.innerHTML+=`<div class="profileDetail">
        <img src ="${picture}">
        <div>
            <div class="profileName">
                ${name}
            </div>
            <div class="profileEmail">
                ${email}
            </div>
        </div>
        </div>
        <button>Log out</button>`;
        // FB.api('/me?fields=id,name,email,picture.width(300).height(300)', function(response) {
        //     console.log(response);
        //     const {id, name, email, picture} = response;
        // let profileImg = document.querySelector(".profileDetail img");
        // console.log(picture.data.url);
        // profileImg.src=picture.data.url;
        // console.log(profileImg);
        // let profileName = document.querySelector(".profileName");
        // let profileEmail=document.querySelector(".profileEmail");
        // profileName.innerHTML = name;
        // profileEmail.innerHTML = email;
        
    // })

    //登出按鈕  放在這才有辦法抓到按鈕
    let logoutBtn = document.querySelector(".profile button");
    logoutBtn.addEventListener('click', ()=>{
        FB.getLoginStatus(function(response){
            if (response.status === 'connected'){
                FB.logout(function(response){
                    console.log("logout");
                    window.location.href="./index.html";
                    statusChangeCallback(response);
                })
            }
        }); 
    })
    
}
async function fetchProfileData(data){
    const fetchResponse = await fetch('https://api.appworks-school.tw/api/1.0//user/signin', {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
    })
    .then(res=>{
        return res.json();
    })
    const parseData =  fetchResponse.data;
    console.log(parseData);
    fetchToken = parseData;
    if(window.location.pathname.includes("profile.html")){
        showProfile(parseData);
    }
}

updateCartNumber();