import {updateCartNumber, loginButton} from './common.js'
let hostName = "api.appworks-school.tw";
let apiVersion = "1.0";
let productData={};

const getsearchId = ()=>{
    let searchURL = window.location.search;
    let searchKeyword =  searchURL.toString().slice(4);
    return searchKeyword;
}

async function getProductData (){
    const productData = await fetch (`https://${hostName}/api/${apiVersion}/products/details?id=${getsearchId()}`)
    .then(res=>{
     return res.json()
    })
    return productData.data;
}

async function showProductData(){
    let data = await getProductData();
    productData = data;
    const productContent = document.querySelector(".product");
    const productImageDiv = document.createElement("div");
    productContent.appendChild(productImageDiv);
    const productMainImage = document.createElement("img");
    productMainImage.src=`${data.main_image}`
    productImageDiv.className = "product__main-image";
    productImageDiv.appendChild(productMainImage);


    const productDetail = document.createElement("div")
    productDetail.className = "product__detail";

    productDetail.innerHTML = `<div class="product__title">${data.title}</div>
    <div class="product__id">${data.id}</div>
    <div class="product__price">TWD.${data.price}</div>
    
    <div class="product__variants">  
        <div class="product__variant">
            <div class="product__variant-name">顏色｜</div>
            <div class="product__colors"> 
            </div>
        </div>
        <div class="product__variant">
            <div class="product__variant-name">尺寸｜</div>
            <div class="product__sizes">
            </div>
        </div>
        <div class="product__variant">
            <div class="product__variant-name">數量｜</div>
            <div class="product__quantity">
                <span class="minus">-</span>
                <input class="product__quantity-amount"type="text" value="1">
                <span class="plus">+</span>
            </div>
        </div>
    </div>
    <button id="add-to-cart">加入購物車</button>
    <div class="product__note">${data.note}</div>
    <div class="product__texture">${data.texture}</div>
    <div class="product__description">${data.description}</div>
    <div class="product__wash">清洗：${data.wash}</div>
    <div class="product__place">產地：${data.place}</div>`;
    productContent.appendChild(productDetail);
    
    data.colors.forEach((data, index)=>{
        let color = document.createElement("div");
        color.className = "product__color";
        let colors =document.querySelector(".product__colors");
        colors.appendChild(color);
        color.style.backgroundColor = `#${data.code}`
        // chooseColor();
    })

    data.sizes.forEach((data, index)=>{
        let size = document.createElement("div");
        size.className="product__size--nostock";
        let sizes=document.querySelector(".product__sizes");
        size.innerText= `${data}`;
        sizes.appendChild(size);
        size.dataset.sizeTag = index;
    })

    const productInfo = document.createElement("div");
    productInfo.className = "moreProductInfo";
    productInfo.innerHTML = `    <div class = "seperater">更多產品資訊</div>
    <div class="product__story">${data.story}</div>
    <div class="product__image"></div>`;

    productContent.appendChild(productInfo);

    data.images.forEach((data, index)=>{
        let image =document.createElement("img");
        let images=document.querySelector(".product__image");
        
        productInfo.appendChild(images);
        images.appendChild(image);
        image.src = `${data}`;
    })
    addToCartFunction();
}

showProductData();

//instock = 選定顏色庫存
let inStock = 0;

async function chooseColor(){
    let data = await getProductData();
    let colorBox = document.querySelectorAll(".product__color");
    let sizes=document.querySelector(".product__sizes");
    let sizeBox = sizes.querySelectorAll("div");
    let chosenColorStock;
    
    console.log(sizeBox);
    let currentSelected = 0;
    let currentSelectedSize = 0;
    let colorStock = data.variants;
    
    let chosenColor="";
    console.log(colorBox);
    console.log(sizeBox);
    let productQuantity = document.querySelector(".product__quantity-amount");
    // counter();
    function counter(){
        productQuantity.value = 1;
        let plus = document.querySelector(".plus");
        let minus = document.querySelector(".minus");
        let number = 1;
        plus.addEventListener('click', ()=>{
            if (productQuantity.value<inStock){
                productQuantity.value++;
            }
        })
        minus.addEventListener('click', ()=>{
            if(productQuantity.value>1){
                productQuantity.value--;
            }
        })
        
        

    }

    
    //step.2 選擇顏色時，先把上一個的顏色回復成未選擇狀態，再active選擇的
    colorBox.forEach((data, index)=>{
        data.addEventListener('click', (e)=>{
            productQuantity.value = 1;
            currentSelected = index;
            for(let i =0; i<colorBox.length; i++){
                colorBox[i].classList.remove("product__color--active");
            }
            
            e.target.classList.add("product__color--active");
            console.log(rgbToHex(e.target.style.backgroundColor));
            chosenColor = rgbToHex(e.target.style.backgroundColor).toUpperCase().toString();

            chosenColorStock = colorStock.filter( chosen => chosen.color_code === chosenColor.slice(1));
            console.log(chosenColorStock);
            // productQuantity.value = 1;
            // counter();

            // let sizes=document.querySelector(".product__sizes");
    //選定顏色的庫存數量放到inStock
            inStock = chosenColorStock[currentSelectedSize].stock;
            console.log("選定顏色以及上一次選的size的庫存數量="+inStock);
            
            console.dir(sizeBox);
    //初始化sizeBox, 讓對應顏色顯示是否有stock
    //把所有size都先設定沒有庫存的樣式，有庫存的再讓他style = product_size
            for(let j=0; j<sizeBox.length; j++){
                sizeBox[j].className="product__size--nostock";
                for(let k=0; k<chosenColorStock.length; k++){
                    if(chosenColorStock[k].size === sizeBox[j].innerHTML && chosenColorStock[k].stock!==0){
                        console.log("此顏色有庫存的尺寸＝"+sizeBox[j].innerHTML);
                        sizeBox[j].className = "product__size";

                    }
                }
                
            }
            
    //下方點擊尺寸後用dataset-sizeTag把目前選擇尺寸放入currentSelectedSize
            const lastTimeSize = sizes.querySelectorAll("div")[currentSelectedSize];
    //如果下次點擊顏色時，此顏色尺寸的庫存為0，把記錄的目前尺寸設定為 此顏色有庫存的array第一個[0]       
            console.log("上次選擇的尺寸編號="+lastTimeSize.dataset.sizeTag);
            if (lastTimeSize.className === "product__size--nostock"){
                const firstAvailiableSize = sizes.querySelectorAll(".product__size")
                firstAvailiableSize[0].className = "product__size--active";
                currentSelectedSize=firstAvailiableSize[0].dataset.sizeTag;
                console.log("目前選的尺寸編號currentSelectedSize="+currentSelectedSize);
                inStock = chosenColorStock[currentSelectedSize].stock;
                console.log("此尺寸沒庫存所以跳回有庫存的第一個尺寸, 數量="+inStock);
            }
    //下次點擊的顏色有庫存就把 currentSelectedSize 設為size--active
            else{
                lastTimeSize.className = "product__size--active";
                console.log("目前選的尺寸編號currentSelectedSize="+currentSelectedSize);
                inStock = chosenColorStock[currentSelectedSize].stock;
                console.log("此尺寸有庫存="+inStock);
            }

        })


    })
    console.log("!!!"+chosenColorStock);
    // inStock = chosenColorStock[currentSelectedSize].stock;

    // let sizesArray = document.querySelectorAll(".product__size");
    //step.3 點擊size
    //監聽sizes底下的所有div
    //點擊的尺寸沒庫存就跳出funciton
    
            let sizesArray = sizes.querySelectorAll("div");
            sizesArray.forEach((data, index)=>{
                data.addEventListener('click' , (e)=>{
                    productQuantity.value = 1;
                    if (e.target.className === "product__size--nostock"){
                        return;
                    }
                    currentSelectedSize = e.target.dataset.sizeTag;
                    console.log(sizeBox);
    //有庫存就查看對應顏色有沒有沒庫存的 點擊時要初始化 不然選的會保持active
                    for(let j=0; j<sizeBox.length; j++){
                        sizeBox[j].className="product__size--nostock";
                        for(let k=0; k<chosenColorStock.length; k++){
                            if(chosenColorStock[k].size === sizeBox[j].innerHTML && chosenColorStock[k].stock!==0){
                                console.log("!!!!!"+sizeBox[j].innerHTML);
                                sizeBox[j].className = "product__size";
                            }
                        }
                    }
    //sizesArray = 可選擇的尺寸 , 選取後class active
                    let sizesArray = document.querySelectorAll(".product__size");
                    // sizeBox[currentSelectedSize].className="product__size--active";
                    if (e.target.className !== "product__size--nostock"){
                        for(let i =0; i<sizesArray.length; i++){
                            sizesArray[i].className = "product__size";
                        }
                        e.target.className="product__size--active";
                        console.dir(e.target);
                        console.log("點擊的尺寸編號"+e.target.dataset.sizeTag);
                        console.log(chosenColorStock[e.target.dataset.sizeTag].stock);
    //目前選取的尺寸傳到inStock
                        inStock = chosenColorStock[e.target.dataset.sizeTag].stock;
                        console.log("這次選取的尺寸庫存數量="+inStock);
                    }
                    
                })

            })


    //step.1
    //一進到頁面選取第一個位置color
    function addCurrent() {
        const firstColor = document.querySelectorAll(".product__color")[0];
        firstColor.classList.add("product__color--active");
    //color轉為Hex格式，再filter出此color的stock數量，currentSelectedSize預設為0所以抓到第一個
        chosenColor = rgbToHex(firstColor.style.backgroundColor).toUpperCase().toString();
        chosenColorStock = colorStock.filter( chosen => chosen.color_code === chosenColor.slice(1));
    
        
    //初始化，看這個顏色哪些尺寸有庫存
        for(let j=0; j<sizeBox.length; j++){
            sizeBox[j].className="product__size--nostock";
            for(let k=0; k<chosenColorStock.length; k++){
                if(chosenColorStock[k].size === sizeBox[j].innerHTML && chosenColorStock[k].stock!==0){
                    console.log("頁面最開始選的顏色有的庫存="+sizeBox[j].innerHTML);
                    sizeBox[j].className = "product__size";
                }
            }
        }
    //defaultSize=此顏色可選的第一個尺寸
        const defaultSize = document.querySelectorAll(".product__size")[0];
        defaultSize.className = "product__size--active";
        console.log("頁面最開始選的顏色可選的第一個尺寸編號="+defaultSize.dataset.sizeTag);

    //數量存進inStock 
        inStock=chosenColorStock[defaultSize.dataset.sizeTag].stock;
        currentSelectedSize = defaultSize.dataset.sizeTag;
        console.log("頁面最開始選的顏色的尺寸數量="+inStock);

        counter();
      }
      addCurrent();  

} 
//包含字串的rgb to Hex converter
function rgbToHex(a){
    a=a.replace(/[^\d,]/g,"").split(","); 
    return"#"+((1<<24)+(+a[0]<<16)+(+a[1]<<8)+ +a[2]).toString(16).slice(1)
}
// function rgbToHex(r, g, b) {
//     return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
//   }
chooseColor();




function getAllChosen(){
    // let data = await getProductData();
    let selectedSize = document.querySelector(".product__size--active");
    let quantity = document.querySelector(".product__quantity-amount");
    let id = document.querySelector(".product__id").innerText;
    let image = document.querySelectorAll(".product__main-image img")[0].src;
    let name = document.querySelector(".product__title").innerText;
    let price = document.querySelector(".product__price").innerText.slice(4);
    let stock = getStock();
    let color = {code: getColor().code, name:getColor().name}
    let qty = quantity.value;
    let size = selectedSize.innerText;
    
    return {id, image, name, price, color, size, qty, stock};
}

function getColor(){
    let colorStock = productData.colors;
    let selectedColor = document.querySelector(".product__color--active");
    let currentColorHex = rgbToHex(selectedColor.style.backgroundColor);
    let currentColorArray = colorStock.filter(chosen => chosen.code === (currentColorHex).slice(1).toUpperCase().toString() );
    return currentColorArray[0];
}

function getStock(){
    let colorStock = productData.variants;
    let selectedColor = document.querySelector(".product__color--active");
    let currentColorHex = rgbToHex(selectedColor.style.backgroundColor);
    let selectedSize = document.querySelector(".product__size--active");
    let currentSize = selectedSize.innerText;
    let currentStockArray = colorStock.filter(chosen => chosen.color_code === (currentColorHex).slice(1).toUpperCase().toString() && chosen.size === currentSize);
    return currentStockArray[0].stock;
}


async function addToCartFunction(){
    // await showProductData;
    const addToCartButton =  document.querySelector("#add-to-cart");
     addToCartButton.addEventListener('click', ()=>{
        addToLocalStorage();
        alert("已加入購物車");
     });
    
}

// addToCartFunction();



//add to local storage
async function addToLocalStorage(){
    let data = getAllChosen();

    //先加空陣列到localStorage以便之後抓下來push 新的array進去
    if(localStorage.cart === undefined){
        let cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    let localStorageArray = JSON.parse(localStorage.getItem('cart'));
    console.log(localStorageArray);
    let cart = {
            id: data.id,
            image: data.image,
            name: data.name,
            color:{code: data.color.code, name: data.color.name},
            size: data.size,
            price: data.price,
            qty: data.qty,
            stock: data.stock
        };
    console.log(cart);
    let repeatArray = localStorageArray.filter(item=> item.id === cart.id && item.color.code ===cart.color.code && item.size ===cart.size);
    // let indexOfrepeatArray = localStorageArray.findIndex(repeatArray);
    console.log(localStorageArray);
    console.log(repeatArray);
    // console.log(indexOfrepeatArray);
    if(repeatArray.length!==0){
        console.log("repeat item");
        let indexOfrepeatArray = localStorageArray.findIndex(i => i === repeatArray[0]);
        console.log(indexOfrepeatArray);
        console.log(localStorageArray.qty);
        console.log(cart.qty)
        localStorageArray[indexOfrepeatArray].qty = cart.qty;
    }
    else{
        localStorageArray.push(cart);
    }
    localStorage.setItem('cart',JSON.stringify(localStorageArray));
    console.log(localStorageArray.length);
    
    updateCartNumber();
    // cartNumber.innerHTML=localStorageArray.length;
}

// function updateCartNumber(num){
//     let localStorageArray = JSON.parse(localStorage.getItem('cart'));
//     let cartNumber = document.querySelectorAll(".cartNumber");
//     cartNumber.forEach((data, index)=>{
//         data.innerHTML = localStorageArray.length;
//     })
// }

updateCartNumber();
loginButton();
// export {updateCartNumber};