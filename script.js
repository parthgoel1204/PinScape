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
