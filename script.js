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

// Lazy Loading

// const lazyImages = [
//   "https://images.unsplash.com/photo-1473225071450-1f1462d5aa92",
//   "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
//   "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
//   "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
//   "https://images.unsplash.com/photo-1519681393784-d120267933ba",
//   "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
//   "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee",
//   "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
//   "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
//   "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
//   "https://images.unsplash.com/photo-1503264116251-35a269479413",
//   "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
//   "https://images.unsplash.com/photo-1500534623283-312aade485b7",
//   "https://images.unsplash.com/photo-1482160549825-59d1b23cb208",
//   "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7",
//   "https://images.unsplash.com/photo-1599894019794-50339c9ad89c",
//   "https://images.unsplash.com/photo-1583225214464-9296029427aa",
//   "https://images.unsplash.com/photo-1543589077-47d81606c1bf"
// ];

// let lazyIndex = 0;
// const BATCH_SIZE = 4;
// let isLoading = false;

const UNSPLASH_ACCESS_KEY = "2z80aopyRETbSVR8KawyUEQBSLCoolDX9RZt0XVTwmU";

const API_STATE = {
  page: 1,
  perPage: 6,
  loading: false,
  hasMore: true
};

async function fetchImagesFromUnsplash() {
  if (API_STATE.loading || !API_STATE.hasMore) return;

  API_STATE.loading = true;

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${API_STATE.page}&per_page=${API_STATE.perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    const images = await response.json();

    if (!images.length) {
      API_STATE.hasMore = false;
      observer.disconnect();
      return;
    }

    renderImages(images);
    API_STATE.page++;
  } 
  catch (error) {
    console.error("Unsplash fetch error:", error);
  } 
  finally {
    API_STATE.loading = false;
  }
}

function renderImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach(photo => {
    const pin = document.createElement("div");
    pin.className = "pin";

    const img = document.createElement("img");
    img.src = photo.urls.regular;
    img.alt = photo.alt_description || "Unsplash Image";
    img.loading = "lazy";
    img.crossOrigin = "anonymous";

    img.addEventListener("load", () => {
      pinScapeDisplay(pin);
    });

    pin.appendChild(img);
    fragment.appendChild(pin);
  });

  gallery.insertBefore(fragment, sentinel);
}


const sentinel = document.createElement("div");
sentinel.className = "sentinel";
gallery.appendChild(sentinel);

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      fetchImagesFromUnsplash();
    }
  },
  {
    rootMargin: "300px"
  }
);

// function loadMoreImages() {
//   if (isLoading) return;
//   isLoading = true;

//   const fragment = document.createDocumentFragment();
//   let loadedCount = 0;

//   for (let i = 0; i < BATCH_SIZE; i++) {
//     if (lazyIndex >= lazyImages.length) {
//       observer.disconnect();
//       return;
//     }

//     const pin = document.createElement("div");
//     pin.className = "pin";

//     const img = document.createElement("img");
//     img.src = lazyImages[lazyIndex];
//     img.loading = "lazy";
//     img.crossOrigin = "anonymous";

//     pin.appendChild(img);
//     fragment.appendChild(pin);

//     img.addEventListener("load", function () {
//       loadedCount++;
//       pinScapeDisplay(pin);

//       if (loadedCount === BATCH_SIZE) {
//         isLoading = false;
//       }
//     });

//     lazyIndex++;
//   }

//   gallery.insertBefore(fragment, sentinel);
// }

window.addEventListener("load", () => {
  masonryStyle();
  observer.observe(sentinel);
  fetchImagesFromUnsplash();
});
