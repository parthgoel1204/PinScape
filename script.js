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

let currentImageIndex = 0;

gallery.addEventListener("click", function (e) {
  if (e.target.tagName === "IMG") {
    modal.classList.remove("hidden");
    imagePreview.src = e.target.src;

    const images = Array.from(document.querySelectorAll(".pin img"));
    currentImageIndex = images.indexOf(e.target);
  }
});

closeBtn.addEventListener("click", function () {
  modal.classList.add("hidden");
});

nextBtn.addEventListener("click", function () {
  const images = document.querySelectorAll(".pin img");
  currentImageIndex = (currentImageIndex + 1) % images.length;
  imagePreview.src = images[currentImageIndex].src;
});

prevBtn.addEventListener("click", function () {
  const images = document.querySelectorAll(".pin img");
  currentImageIndex =
    (currentImageIndex - 1 + images.length) % images.length;
  imagePreview.src = images[currentImageIndex].src;
});

