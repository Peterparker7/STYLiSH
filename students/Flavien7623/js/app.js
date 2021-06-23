import { updateCartNumber, loginButton } from './common.js';
let hostName = "api.appworks-school.tw";
let apiVersion = "1.0";
let category = "all";
let prodObject = {};
const productURL = `https://${hostName}/api/${apiVersion}/products`;
const productFetch = async function(url){
    try{
        fetch(url)
        .then((res)=>{
            const response = res.json();
            return response;
        })
        .then(res=>{
            prodObject=res;
            showData();        
        })
    }catch(e){
        console.log("Error~~", e);
    }
};


// productFetch();

let trigger = true;
const scrollFunction = () =>{
    if ((window.innerHeight + window.scrollY) > document.body.offsetHeight) {
        // you're at the bottom of the page
        if(trigger){
            if(prodObject.next_paging){
                trigger=false;
                productFetch(`${productURL}/${category}?paging=${prodObject.next_paging}`);
            }
        }
    }
}


const getsearchKeyword = ()=>{
    let searchURL = window.location.search;
    let searchKeyword =  searchURL.toString().slice(5);
    return searchKeyword;
}

window.onload= function() {
    category =getsearchKeyword();
    if (category === "" || category==="all" || category ===null){
        category = "all";
        productFetch(`${productURL}/all`);
    }
    else if (category=== "men" || category === "women" || category ==="accessories"){
        productFetch(`${productURL}/${category}`);
    }
    else{
        productFetch(`${productURL}/search?keyword=`+ category);
    }
}






async function showData(){
    const prodContainer = document.querySelector(".productsContainer");
    // const getData = productFetch();
    let data = prodObject.data;
    let nextPage = prodObject.next_paging;
    if (data.length!==0){
        const prodInfoArr = data.map(x=>{
            return {img: x.main_image, color: x.colors, title: x.title, price: x.price, }
        });
        data.forEach( (data , index)=> {
            let createProdCol = document.createElement("div");
            createProdCol.setAttribute("class" , "prodCol");
            prodContainer.appendChild(createProdCol);

            // creat a tag
            let prodAtag = document.createElement("a");
            prodAtag.setAttribute("class", "prodAtag");
            prodAtag.href=`./product.html?id=${data.id}`;
            createProdCol.appendChild(prodAtag);

            //append product img
            let prodImg = document.createElement('img');
            prodImg.setAttribute("class" , "defaultImg");
            prodImg.src=prodInfoArr[index].img;
            prodAtag.appendChild(prodImg);

            //append product color box
            let prodBox = document.createElement('div');
            prodBox.setAttribute("class" , "box");

            for(let j=0; j<prodInfoArr[index].color.length; j++){
                let prodColor = document.createElement('div');
                prodColor.setAttribute("class" , "product__color");
                
                createProdCol.appendChild(prodBox);
                prodBox.appendChild(prodColor);
                prodColor.style.backgroundColor = "#"+(prodInfoArr[index].color[j].code).toString();
            }

            //append product title
            let prodTitle=document.createElement("div");
            prodTitle.setAttribute("class" , "product__title");
            let textnode=document.createTextNode(prodInfoArr[index].title);
            prodTitle.appendChild(textnode);
            createProdCol.appendChild(prodTitle);

            //append product price
            let prodPrice = document.createElement('div');
            let tagTWD = document.createTextNode("TWD.");
            prodPrice.setAttribute("class" , "product__price");
            let pricenode = document.createTextNode(prodInfoArr[index].price);
            createProdCol.appendChild(prodPrice);
            prodPrice.appendChild(tagTWD);
            prodPrice.appendChild(pricenode);
 
        })
        if(nextPage){
            document.addEventListener("scroll", scrollFunction);
        }
        trigger = true;
    }
    else{
        prodContainer.innerHTML = `<h1>搜尋不到商品哦</h1>`;
    }
}


const searchButton = document.querySelector(".searchInput");
searchButton.addEventListener('click',(e)=>{
    searchButton.classList.add("searchInputToggle");
})
const page = document.querySelector("body");
page.addEventListener('click', (e)=>{
    if(e.target.nodeName !=="INPUT"){
    searchButton.classList.remove("searchInputToggle");
    }
})

updateCartNumber();
loginButton();
