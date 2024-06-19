import authToken from "./auth.js";
import swiperFactory from "./functions.js";
import {
    searchButton,
    openRegisterModal,
    completeSignIn,
    genreButtonFactory,
    initSwiper,
} from "./functions.js";

initSwiper();

swiperFactory("latest", authToken, "last-releases-swiper-container");

document.querySelector(".results-container").style.display = "none";

//hack, change later
document.querySelector(".close-btn-movie").addEventListener("click", (evt) => {
    let btn = evt.currentTarget;
    document.querySelector(".modal-movie-overlay").style.display = "none";
});

document.querySelector("#submit-btn").addEventListener("click", searchButton);

document
    .querySelector(".open-button-signin")
    .addEventListener("click", openRegisterModal);

let registerOverlay = document.querySelector(".modal-register-overlay");
let closeButton = registerOverlay.querySelector(".close-button");
let signInButton = registerOverlay.querySelector(".register_btn");
closeButton.addEventListener("click", () => {
    document.querySelector(".modal-register-overlay").style.display = "none";
});
signInButton.addEventListener("click", completeSignIn);

genreButtonFactory();
swiperFactory("genre", authToken, "genre-swiper-container", "", 35)
