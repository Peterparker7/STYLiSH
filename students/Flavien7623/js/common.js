window.fbAsyncInit = function() {
    FB.init({
      appId            : '302510311271821',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v10.0'
    });
    FB.AppEvents.logPageView(); 
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




function updateCartNumber(num){
    let localStorageArray = JSON.parse(localStorage.getItem('cart'));
    let cartNumber = document.querySelectorAll(".cartNumber");
    cartNumber.forEach((data, index)=>{
        data.innerHTML = localStorageArray.length;
    })
}

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

    function statusChangeCallback(response){
        console.log(response);
        if (response.status === 'connected'){
    
            const {status, authResponse} = response;
            const token = {
                "provider": authResponse.graphDomain,
                "access_token": authResponse.accessToken,
            }
            //取得FB access_token
            // fetchProfileData(token);
    
            // showProfile();
            // window.location.href="./profile.html";
            
        }
        else if(response.status !== 'connected' && window.location.pathname.includes("profile.html")){
            window.location.replace("./index.html");
        }
        else{
            
        }
    }
}
export { updateCartNumber, loginButton };