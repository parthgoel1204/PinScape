const colorThief = new ColorThief();

const body = document.body;
const themeToggle = document.querySelector('#themeToggle');
const themeIcon = document.querySelector('#themeIcon');

themeIcon.addEventListener('click',function(){
    body.classList.toggle("dark");

    if(body.classList.contains("dark")){
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        localStorage.setItem("theme", "dark");
    }
    else{
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        localStorage.setItem("theme", "light");
    }
})

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  body.classList.add("dark");
  themeIcon.classList.remove("fa-sun");
  themeIcon.classList.add("fa-moon");
}

// const images = document.querySelectorAll(".pin img");
const gallery = document.querySelector(".gallery");

const modal = document.querySelector("#imageModal");
const imagePreview = document.querySelector("#modalImage");
const closeBtn = document.querySelector(".close-btn");
const nextBtn = document.querySelector(".nav-btn.next");
const prevBtn = document.querySelector(".nav-btn.prev");

function getAllImages() {
  return Array.from(document.querySelectorAll(".pin img"));
}

let currentImageIndex = 0;

gallery.addEventListener("click", function (e) {
  if (e.target.tagName === "IMG") {
    modal.classList.remove("hidden");
    imagePreview.src = e.target.src;

    const images = getAllImages();
    currentImageIndex = images.indexOf(e.target);

    imagePreview.onload = applyDominantColor;
  }
});

closeBtn.addEventListener("click", function () {
  modal.classList.add("hidden");
});

nextBtn.addEventListener("click", function () {
  const images = getAllImages();
  currentImageIndex = (currentImageIndex + 1) % images.length;
  imagePreview.src = images[currentImageIndex].src;
});

prevBtn.addEventListener("click", function () {
  const images = getAllImages();
  currentImageIndex =
    (currentImageIndex - 1 + images.length) % images.length;
  imagePreview.src = images[currentImageIndex].src;
});

document.addEventListener('keydown',function(e){
  if(e.key === "Escape" && !modal.classList.contains("hidden")){
    modal.classList.add("hidden");
  }
});

document.addEventListener("keydown", function (e) {
  if (modal.classList.contains("hidden")) return;

  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === "ArrowLeft") prevBtn.click();
});

// exracting dominant color by using colorthief 
function applyDominantColor() {
  const dominantColor = colorThief.getColor(imagePreview);
  modal.style.backgroundColor = `rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.85)`;
}

function pinScapeDisplay(item){
  const rowHeight = parseInt(
    getComputedStyle(gallery).getPropertyValue("grid-auto-rows")
  );
  const rowGap = parseInt(
    getComputedStyle(gallery).getPropertyValue("gap")
  );
  const img = item.querySelector("img");
  if(!img)return;

  const contentHeight = img.getBoundingClientRect().height;
// we have used Math.ceil because if there is a rowspan in points we don't want it to be cut by using floor or round
  const rowSpan = Math.ceil(
    (contentHeight + rowGap) / (rowHeight + rowGap)
  );
  item.style.gridRowEnd = `span ${rowSpan}`;
}

// Pinterest Style is called Masonry Style
function masonryStyle(){
  const images = document.querySelectorAll('.pin');
  images.forEach(function (element){
    const img = element.querySelector('img');
    if(img.complete){
      pinScapeDisplay(element);
    }
    else{
      img.addEventListener('load',function(){
        pinScapeDisplay(element);
      });
    }
  });
}

window.addEventListener("load", masonryStyle);
