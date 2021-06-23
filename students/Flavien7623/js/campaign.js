let hostName = "api.appworks-school.tw";
let apiVersion = "1.0";

let prodObject = {};let campaignIndex = 0;

const campaigns = document.querySelector(".campaigns");
const campaignStory = document.querySelector(".campaign__story");
const dots = document.querySelector(".dots");
const marketCampaignUrl = `https://${hostName}/api/${apiVersion}/marketing/campaigns`;

async function getData() {
  const allData = await fetch(marketCampaignUrl)
    .then((res) => {
      const response = res.json();
      return response;
    })
    .then((res) => {
      const data = res.data;
      campaignData = data;
      return data;
    });
  return allData;
}

async function showCampaign() {
  let campaignData = await getData();

  for (let i = 0; i < campaignData.length; i++) {
    const campaignPicture = document.createElement("a");
    campaignPicture.className = "campaigns";
    const story = document.createElement("p");
    story.className = "campaign__story";
    const dot = document.createElement("div");
    dot.dataset.target = i;
    dot.className = "dot";
    campaignPicture.style.backgroundImage = `url(${campaignData[i].picture.toString()})`;
    story.innerText = campaignData[i].story;
    campaignPicture.href = `./product.html?id=${campaignData[i].product_id}`;
    campaigns.appendChild(campaignPicture);
    campaigns.appendChild(dots);
    campaignPicture.appendChild(story);
    dots.appendChild(dot);
  }

  toggleCampaign();


  const dotArray = document.querySelectorAll(".dot");
  const campaignPictureArray = campaigns.querySelectorAll("a");

  dotArray.forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      console.log(dot.dataset.target);
      campaignIndex = parseInt(dot.dataset.target);
      toggleCampaign();

      clearInterval(carousel);
      carousel = setInterval(() => {
        toggleCampaign();
      }, 2000); 
    });
  });

  // const test = document.getElementById("campaigns");
  // test.addEventListener("mouseenter", ()=>{
  //     console.log("mouseenter")
  // })
  // test.addEventListener("mouseleave", ()=>{
  //     console.log("mouseleave")
  // })
}

// const dotArray = dots.querySelectorAll('div');
// dotArray[0].className = "campaign--active";
// console.dir(dotArray[0]);
//         const campaignPictureArray = campaigns.querySelectorAll('a');
//         dotArray.forEach((data, index)=>{
//             data.addEventListener( "click" , ()=>{
//                 for(let i =0; i<dotArray.length; i++){

//                     dotArray[i].className="dot";
//                 }
//             // campaignPictureArray[index].className = "campaign--active";
//             data.className = "dot--active";
//             campaignIndex = index;
//             // console.log(e.target.value);
//             })

//         })

function toggleCampaign() {
  if (campaignIndex > campaignData.length - 1) {
    campaignIndex = 0;
  }

  const campaignPictureArray = campaigns.querySelectorAll("a");

  campaignPictureArray.forEach((data, index) => {
    if (index === campaignIndex) {
      data.classList.add("campaign--active");
    } else {
      data.classList.remove("campaign--active");
    }
  });

  const dotArray = dots.querySelectorAll("div");
  dotArray.forEach((data, index) => {
    if (index === campaignIndex) {
      data.classList.add("dot--active");
    } else {
      data.classList.remove("dot--active");
    }
  });
  campaignIndex++;
}

let carousel = setInterval(() => {
  // campaignIndex++;
  toggleCampaign();
}, 2000);

showCampaign();
