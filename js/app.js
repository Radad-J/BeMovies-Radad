import authToken from "./auth.js";
import swiperFactory from "./functions.js";
import {
  searchButton,
  openRegisterModal,
  completeSignIn,
  completeSignUp,
  genreButtonFactory,
  initSwiper,
  openLoginRegisterForm,
  switchTabButton,
} from "./functions.js";

initSwiper();

swiperFactory("latest", authToken, "last-releases-swiper-container");

document.querySelector(".results-container").style.display = "none";

//hack, change later
document.querySelector(".close-btn-movie").addEventListener("click", (evt) => {
  document.querySelector(".modal-movie-overlay").style.display = "none";
});

document.querySelector("#submit-btn").addEventListener("click", searchButton);

document
  .querySelector(".open-button-signin")
  .addEventListener("click", openRegisterModal);

genreButtonFactory();
swiperFactory("genre", authToken, "genre-swiper-container", "", 35);

let registerOverlay = document.querySelector(".modal-register-overlay");
let closeButton = registerOverlay.querySelector(".close-button");
closeButton.addEventListener("click", () => {
  document.querySelector(".modal-register-overlay").style.display = "none";
});

registerOverlay.style.display = "none";

let registerButtons = document.querySelectorAll(".open-button-register");
let loginButtons = document.querySelectorAll(".open-button-signin");

registerButtons.forEach((element) => {
  element.addEventListener("click", openLoginRegisterForm);
});

loginButtons.forEach((element) => {
  element.addEventListener("click", openLoginRegisterForm);
});

let switchTabButtons = document.querySelector(".btnTab").querySelectorAll("a");

switchTabButtons.forEach((element) => {
  element.addEventListener("click", switchTabButton);
});

let notMemberYetButton = document
  .querySelector(".bottom")
  .querySelector(".signup")
  .querySelector("p")
  .querySelector("a");
notMemberYetButton.addEventListener("click", () => {
  registerOverlay.querySelector(".active").classList.remove("active");
  registerOverlay.querySelector(".login").classList.add("active");
  registerOverlay.querySelector(".register-form").style.display = "none";
  registerOverlay.querySelector(".login-form").style.display = "flex";
});

document.querySelector(".login_btn").addEventListener("click", completeSignIn);
document.querySelector(".signup_btn").addEventListener("click", completeSignUp);
