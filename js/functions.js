import {
  movieSearchUrl,
  movieFindUrl,
  imageSearchUrl,
  creditsUrl,
  genresSearchUrl,
  genresList,
  latestSearchurl,
  latestSearchurl2,
} from "./constants.js";
import authToken from "./auth.js";
async function queryMovieDB(url, authToken) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  const jsonObject = await response.json().then((data) => {
    return data;
  });
  return jsonObject;
}

function getTodayDate() {
  let milli = new Date();
  let result =
    milli.getFullYear() + "-" + milli.getMonth() + "-" + milli.getDate();
  return result;
}

export function initSwiper() {
  let swiperOptions = {
    // Optional parameters
    direction: "horizontal",
    // loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  };
  let swiper = new Swiper(`.results-swiper`, swiperOptions);

  let swiper1 = new Swiper(`.genre-swiper`, swiperOptions);

  let swiper2 = new Swiper(`.latest-swiper`, swiperOptions);
}

function openAndInitModalMovie(evt) {
  let button = evt.currentTarget;
  let id = button.id;
  populateMovieModal(id, authToken);
  document.querySelector(".modal-movie-overlay").style.display = "flex";
  document.querySelector(".modal-movie-overlay").style.overflow =
    "auto !important";
  document.querySelector("body").style.overflow = "hidden";
}

function searchObjectList(list, key, value) {
  for (let object of list) {
    if (object[key] == value) {
      return object;
    }
  }
}

function placeValuesInText(parentElem, selector, textValue) {
  if (textValue == "") {
    textValue = "N/A";
  } else if (typeof textValue == "object") {
    let tempTextValue = textValue[0].name;
    if (textValue.length > 1) {
      tempTextValue += " / " + textValue[1].name;
    }
    textValue = tempTextValue;
  }
  parentElem.querySelector(selector).innerText = textValue;
}

export default async function swiperFactory(
  type,
  token,
  swiperSig,
  searchAppend = "",
  genreAppend = ""
) {
  let typeList = ["search", "latest", "genre"];
  let urlList = [
    movieSearchUrl + searchAppend,
    latestSearchurl.replace("replaceDateHere", getTodayDate()),
    genresSearchUrl
      .replace("replaceDateHere", getTodayDate())
      .replace("replaceGenreHere", genreAppend),
  ];
  let url = urlList[typeList.indexOf(type)];
  let resultMovieList = await queryMovieDB(url, token);
  let movieList = resultMovieList.results;
  let swiperChosen = document.querySelector(`.${swiperSig}`);
  let slideContainer = swiperChosen.querySelector(".swiper-wrapper");
  slideContainer.innerHTML = "";
  for (let i = 0; i < movieList.length; i++) {
    let newSlide = document.createElement("div");
    let currentMovie = movieList[i];
    newSlide.id = currentMovie.id;
    let genres = currentMovie.genre_ids;
    let genresResult = [];
    for (let i = 0; i < (genres.length > 3 ? 3 : genres.length); i++) {
      genresResult.push(
        genresList[
          genresList.indexOf(searchObjectList(genresList, "id", genres[i]))
        ].name
      );
    }
    newSlide.classList.add("swiper-slide");
    // Check if poster_path is null or undefined
    if (!currentMovie.poster_path) {
      currentMovie.poster_path = "images/place-holder-image.png";
    } else {
      // Concatenate imageSearchUrl with poster_path
      currentMovie.poster_path = imageSearchUrl + currentMovie.poster_path;
    }
    newSlide.innerHTML += `
        <img src="${currentMovie.poster_path}" alt="${
      currentMovie.original_title
    }" />
        <div class="info">
            <h3 class="hover-title">${currentMovie.original_title}</h3>
            <h4 class="hover-year">${currentMovie.release_date.slice(0, 4)}</h4>
            <p class="hover-genre">${genresResult.join(" / ")}</p>
            <img class="hover-star" src="./images/star.svg" alt="star" />
            <p class="hover-score">${currentMovie.vote_average.toPrecision(
              2
            )}</p>
        </div>
        `;
    newSlide.addEventListener("click", openAndInitModalMovie);
    slideContainer.appendChild(newSlide);
  }
  initSwiper();
}

export function searchButton(evt) {
  evt.preventDefault();
  let searchedTerm = document.querySelector("#search-bar").value;
  document.querySelector(
    ".search-p"
  ).innerText = `Results for "${searchedTerm}"`;
  swiperFactory("search", authToken, "results-swiper-container", searchedTerm);
  document.querySelector(".results-container").style.display = "block";
}

async function populateMovieModal(id, token) {
  let generalInfo = queryMovieDB(movieFindUrl + id, token);
  await generalInfo
    .then((value) => {
      let modalOverlay = document.querySelector(".modal-movie-overlay");
      if (!value.poster_path) {
        value.poster_path = "images/place-holder-image.png";
      } else {
        // Concatenate imageSearchUrl with poster_path
        value.poster_path = imageSearchUrl + value.poster_path;
      }
      modalOverlay.querySelector("#img-modal-movie").querySelector("img").src =
        value.poster_path;
      placeValuesInText(
        modalOverlay,
        "#title-movie-modal",
        value.original_title
      );
      placeValuesInText(
        modalOverlay,
        "#year-release-movie",
        value.release_date.substr(0, 4)
      );
      placeValuesInText(modalOverlay, "#genre-movie-modal", value.genres); //value.genres.reduce((acc, elem) => {acc.push(elem.name), []}).join(" / "))
      placeValuesInText(
        modalOverlay,
        "#description-movie-modal",
        value.overview
      );
      placeValuesInText(
        modalOverlay,
        "#rating-movie",
        value.vote_average.toPrecision(2)
      );
      let castInfo = queryMovieDB(
        creditsUrl.replace("replaceThis", value.id),
        token
      );
      return castInfo;
    })
    .then((value) => {
      let modalOverlay = document.querySelector(".modal-movie-overlay");
      let castMembers = [];
      let result = "";

      if (!value.cast || value.cast.length === 0) {
        result = "unknown";
      } else {
        // Loop through up to 4 elements or all elements if less than 4
        for (let i = 0; i < Math.min(100, value.cast.length); i++) {
          if (value.cast[i].name) {
            // Check if 'name' property exists
            castMembers.push(value.cast[i].name);
          }
        }
        result = castMembers.join(", ") + ".";
      }

      placeValuesInText(modalOverlay, "#people-cast", result);
    })
    .catch((error) => {
      console.error("Error fetching or processing cast members:", error);
      // Handle the error as needed (e.g., display a default message)
      placeValuesInText(
        modalOverlay,
        "#people-cast",
        "Cast information unavailable."
      );
    });
}

export function openRegisterModal() {
  let registerOverlay = document.querySelector(".modal-register-overlay");
  registerOverlay.style.display = "flex";
}

function genreButtonSelect(evt) {
  let button = evt.target;
  let bigListOfGenres = document.querySelector(".genre-list");
  let chosenGenreButton = evt.currentTarget;
  //remove currently selected
  bigListOfGenres.querySelector(".selected").classList = "genre-list-item";
  chosenGenreButton.classList.add("selected");
  //make swiper code
  swiperFactory("genre", authToken, "genre-swiper-container", "", button.id);
}

export function completeSignIn(evt) {
  evt.preventDefault();
  let formInfo = document.querySelector(".login-form");
  let username = formInfo.querySelector("[name='username']").value;
  let password = formInfo.querySelector("[name='password']").value;
  formInfo.querySelector("[name='username']").value = "";
  formInfo.querySelector("[name='password']").value = "";
  console.log(
    `Username provided is: ${username}, password provided is: ${password}.`
  );
  document.querySelector(".modal-register-overlay").style.display = "none";
}

export function completeSignUp(evt) {
  const regexEmail = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  evt.preventDefault();
  let formInfo = document.querySelector(".register-form");
  let username = formInfo.querySelector("[name='username']").value;
  let password = formInfo.querySelector("[name='password']").value;
  let passwordConf = formInfo.querySelector("[name='confPassword']").value;
  let email = formInfo.querySelector("[name='email']").value;
  let termsConditions = formInfo.querySelector(
    "[name='terms-conditions']"
  ).checked;
  formInfo.querySelector("[name='username']").value = "";
  formInfo.querySelector("[name='password']").value = "";
  formInfo.querySelector("[name='email']").value = "";
  formInfo.querySelector("[name='confPassword']").value = "";
  let check1 =
    username.length > 6 && username.length < 21
      ? ""
      : "Username has to be between 7 and 20 characters long. \n";
  let check2 =
    email.match(regexEmail) && email.match(regexEmail)[0] == email
      ? ""
      : "Email has to be a valid email address. \n";
  let check3 =
    password.length > 10
      ? ""
      : "Password has to be at least 10 characters long. \n";
  let check4 =
    passwordConf == password && passwordConf.length > 10
      ? ""
      : "Password confirmation has to be identical to password. \n";
  let check5 = termsConditions
    ? ""
    : "You need to accept our terms and conditions.";
  let bigCheck = check1 + check2 + check3 + check4 + check5;
  if (bigCheck) {
    alert(bigCheck);
  } else {
    console.log(
      `Username provided is: ${username}, password provided is: ${password} and email provided is: ${email}.`
    );
    document.querySelector(".modal-register-overlay").style.display = "none";
  }
}

export function genreButtonFactory() {
  let genres = [
    {
      id: 35,
      name: "Comedy",
    },
    {
      id: 18,
      name: "Drama",
    },
    {
      id: 28,
      name: "Action",
    },
    {
      id: 10749,
      name: "Romance",
    },
    {
      id: 14,
      name: "Fantasy",
    },
    {
      id: 16,
      name: "Animation",
    },
  ];
  let bigListOfGenres = document.querySelector(".genre-list");
  for (let i = 0; i < 6; i++) {
    let button = bigListOfGenres.children[i];
    let id = genres[i].id;
    button.id = id;
    button.addEventListener("click", genreButtonSelect);
  }
}

export function openLoginRegisterForm(evt) {
  let button = evt.currentTarget;
  let registerForm = document.querySelector(".register-form");
  let loginForm = document.querySelector(".login-form");
  let btnTab = document.querySelector(".btnTab");
  let modalOverlay = document.querySelector(".modal-register-overlay");

  // Clear existing active class
  btnTab.querySelector(".active").classList.remove("active");

  // Open the modal
  modalOverlay.style.display = "flex";

  if (button.classList.contains("open-button-signin")) {
    btnTab.querySelector(".login").classList.add("active");
    registerForm.style.display = "none";
    loginForm.style.display = "flex";
  } else {
    btnTab.querySelector(".signup").classList.add("active");
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
  }
}

export function switchTabButton(evt) {
  let button = evt.currentTarget;
  let registerForm = document.querySelector(".register-form");
  let loginForm = document.querySelector(".login-form");
  let btnTab = document.querySelector(".btnTab");

  // Clear existing active class
  btnTab.querySelector(".active").classList.remove("active");

  // Add active class to the clicked button
  button.classList.add("active");

  if (button.classList.contains("signup")) {
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
  } else {
    registerForm.style.display = "none";
    loginForm.style.display = "flex";
  }
}

// Event listener for close button to close the modal
document.querySelector(".close-button").addEventListener("click", () => {
  document.querySelector(".modal-register-overlay").style.display = "none";
});

export function burgerButton(evt) {
  let btn = evt.currentTarget;
  if (btn.classList == "menu-icon") {
    btn.parentElement.querySelector("ul").style.display = "flex";
    btn.parentElement.querySelector(".close-icon").style.display = "block";
    btn.style.display = "none";
  } else {
    btn.parentElement.querySelector("ul").style.display = "none";
    btn.parentElement.querySelector(".menu-icon").style.display = "block";
    btn.style.display = "none";
  }
}

export function handleResize() {
  let menuIcon = document.querySelector(".menu-icon");
  let closeIcon = document.querySelector(".close-icon");
  let navMenu = document.querySelector(".nav-container ul");
  if (window.innerWidth > 768) {
    menuIcon.style.display = "none";
    closeIcon.style.display = "none";
    navMenu.style.display = "flex";
  } else {
    menuIcon.style.display = "block";
    closeIcon.style.display = "none";
    navMenu.style.display = "none";
  }
}
