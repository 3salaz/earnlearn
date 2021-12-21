
var fVideo = document.getElementById("video");
var fVTitle = document.getElementById("videoTitle");
var fVDescription = document.getElementById("description");
var fVTimeStamps = document.getElementById("timeStamps");


var createList = document.createElement("LI");
var videoData = [];
var speakerData = [];

class Accordion {
  constructor(el) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector('summary');
    // Store the <div class="content"> element
    this.content = el.querySelector('.content');

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
    // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;
    
    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;
    
    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }
    
    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: 400,
      easing: 'ease-out'
    });
    
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => this.isClosing = false;
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;
    
    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }
    
    // Start a WAAPI animation
    this.animation = this.el.animate({
      // Set the keyframes from the startHeight to endHeight
      height: [startHeight, endHeight]
    }, {
      duration: 400,
      easing: 'ease-out'
    });
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => this.isExpanding = false;
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = '';
  }
}

document.querySelectorAll('details').forEach((el) => {
  new Accordion(el);
});

// FUNCTIONS
function featured(arrayOfVideos) {
  $("#videoPlayer").removeClass("hide");
  $("#highlights").addClass("hide");
  $("#speakers").removeClass("hide");
  $("#sidebar").removeClass("hide");
}
function loadAllVideos() {
  $(".card").removeClass("hide");
}

function skipToTimeStamp(time) {
  var MintimeStamp = time.getAttribute("data-timeStamp");
  var timeStampArr = MintimeStamp.split(":");
  let minutesInSec = timeStampArr[0] * 60;
  var seconds = timeStampArr[1];
  var timeStamp = parseInt(minutesInSec, 10) + parseInt(seconds, 10);
  video.currentTime = timeStamp;
}
function loadSlide() {
  $(".card").addClass("hide");
}

function randomizeVideo(arrayOfGroups) {
  var randomVideo = Math.floor(Math.random() * arrayOfGroups.length);
  loadVideo(randomVideo);
}

// function loadVideo(videoObject) {
//   // console.log(videoData[videoObject])
//   // fVTitle.innerHTML = videoData[videoObject][12][1];
//   // fVideo.src = videoData[videoObject][13][1];
//   // fVDescription.innerHTML = videoData[videoObject][2][1];
//   // var timeStampsName = videoData[videoObject][0][1].split(",");
//   // var timeStamps = videoData[videoObject][1][1].split(",");
//   // timeStamps.innerHTML = "";
//   // if (timeStamps[0] === "") {
//   //   $("#timeStamps").addClass("hide");
//   // } else {
//   //   for (var i = 0; i < timeStamps.length; i++) {
//   //     $("#timeStamp").removeClass("hide");
//   //     timeStamp = timeStamps[i];
//   //     timeStamps.innerHTML += `<li data-timeStamp="${timeStamp}" onclick="skipToTimeStamp(this)" id="timeStamp${i}"><button class="timeStampBtn"><h5 class="timeStampName">${timeStampsName[i]}</h5><p>${timeStamp}</p></button></li>`;
//   //   }
//   // }
// }

// FIREBASE CONFIGURATION
var firebaseConfig = {
  apiKey: "AIzaSyAr_6YLjrmuD2BrQxlO8odnOZFjeARzdBM",
  authDomain: "earn-and-learn-6172e.firebaseapp.com",
  databaseURL: "https://earn-and-learn-6172e-default-rtdb.firebaseio.com",
  projectId: "earn-and-learn-6172e",
  storageBucket: "earn-and-learn-6172e.appspot.com",
  messagingSenderId: "629002563246",
  appId: "1:629002563246:web:690608ce280c51492d873f",
  measurementId: "G-DG0YFL0TB6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase
  .database()
  .ref("videos")
  .on("value", function (snap) {
      let videoData = snap.val();

    // for (var i = 0; i < videoData.length; i++) {
    //   var video = videoData[i];
    //   var videoTags = video[10][1];
    //   var videoThumbnail = video[11][1];
    //   var videoName = video[12][1];
    // }
    for (var i = 0; i < videoData.length; i++) {
      let vName = videoData[i]['VideoName'];
      let vTags = videoData[i]['Tags'];
      let vThumbnail = videoData[i]['ThumbnailUrl'];
      $("#gallery").append(
        `<div id="card${i}" class="card" data-tags="${vTags}"><img src="${vThumbnail}"><div class="overlay"><h5>${vName}</h5></div></div>`
      );
    }


    var $cards = $("#gallery .card");
    var $buttons = $("#tags");
    var tagged = {};

    $cards.click(()=>{
      console.log(this)
      fVideo.src = "google.com"
    })
    $cards.each(function () {
      var card = this;
      var tags = $(this).data("tags");
      if (tags) {
        tags.split(",").forEach(function (tagName) {
          if (tagged[tagName] == null) {
            tagged[tagName] = [];
          }
          tagged[tagName].push(card);
        });
      }
    });
    
    $("<button />", {
      text: "Show All",
      class: "active",
      click: function () {
        $(this).addClass("active").siblings().removeClass("active");
        $cards.show();
      },
    }).appendTo($buttons);

    $.each(tagged, function (tagName) {
      $("<button/>", {
        text: tagName + " (" + tagged[tagName].length + ")",
        click: function () {
          $(this).addClass("active").siblings().removeClass("active");
          $cards.hide().filter(tagged[tagName]).show();
        },
      }).appendTo($buttons);
    });
  });

firebase
  .database()
  .ref("contacts")
  .on("value", function (snap) {
    // snap.forEach(function (childNodes) {
    //   speakerData.push(
    //     Object.keys(childNodes.val()).map((key) => [
    //       Number(key),
    //       childNodes.val()[key],
    //     ])
    //   );
    // });
    // for (var i = 0; i < speakerData.length; i++) {
    //   var speaker = speakerData[i];
    //   var speakerEmail = speaker[0][1];
    //   var speakerName = speaker[1][1];
    //   var speakerProfilePic = speaker[2][1];
      
    //   $("#speakersList").append(
    //     `<div class="card-speaker e-col-6">
    //       <div class="card-content">
    //         <h3>${speakerName}</h3>
    //         <ul class="contactLinks">
    //           <li><a href="">${speakerEmail}<span class="material-icons">email</span></a></li>
    //           <li><a href="">.com<span class="material-icons">maps_home_work</span></a></li>
    //         </ul>
    //       </div>
    //       <img src="${speakerProfilePic}" alt="${speakerProfilePic}">
    //     </div>
    //   `);
    // }
    let contactsData = snap.val();
    console.log(contactsData);
  });