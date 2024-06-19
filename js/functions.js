import { movieSearchUrl, movieFindUrl, imageSearchUrl, creditsUrl, genresSearchUrl, genresList, latestSearchurl} from "./constants.js";
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
    let milli = new Date;
    let result = milli.getFullYear() + "-" + milli.getMonth() + "-" + milli.getDate();
    return result;
}

export function initSwiper() {
    let swiperOptions = {
        // Optional parameters
        direction: "horizontal",
        loop: true,
        slidesPerGroup: 1,
        slidesPerView: 1,
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1250: {
                slidesPerView: 4,
            },
        },
        spaceBetween: 30,

        // Navigation arrows
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    }
    let swiper = new Swiper(`.mySwiper`, swiperOptions);

    let swiper1 = new Swiper(`.genre-swiper`, swiperOptions);

    let swiper2 = new Swiper(`.latest-swiper`, swiperOptions);
}

function openAndInitModalMovie(evt) {
    let button = evt.currentTarget;
    let id = button.id;
    populateMovieModal(id, authToken);
    document.querySelector(".modal-movie-overlay").style.display = "flex";
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
            tempTextValue += "/" + textValue[1].name;
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
        genresSearchUrl.replace("replaceDateHere", getTodayDate()).replace("replaceGenreHere", genreAppend),
    ];
    let url = urlList[typeList.indexOf(type)];
    console.log(url);
    let resultMovieList = await queryMovieDB(url, token);
    let movieList = resultMovieList.results;
    let swiperChosen = document.querySelector(`.${swiperSig}`);
    //to do, figure out the format of the hover
    let slideContainer = swiperChosen.querySelector(".swiper-wrapper");
    slideContainer.innerHTML = "";
    console.log(movieList, "test");
    for (let i = 0; i < (movieList.length > 8 ? 8 : movieList.length); i++) {
        let newSlide = document.createElement("div");
        let currentMovie = movieList[i];
        newSlide.id = currentMovie.id;
        let genres = currentMovie.genre_ids;
        let genresResult = [];
        for (let i = 0; i < (genres.length > 3 ? 3 : genres.length); i++) {
            console.log(genresList[2].id, genres[i], "zizhgjkez");
            console.log(searchObjectList(genresList, "id", genres[i]));
            genresResult.push(
                genresList[
                    genresList.indexOf(
                        searchObjectList(genresList, "id", genres[i])
                    )
                ].name
            );
            genresResult.join(" / ");
        }
        newSlide.classList.add("swiper-slide");
        newSlide.innerHTML += `
        <img src="${imageSearchUrl + currentMovie.poster_path}" alt="barbie" />
        <div class="info">
            <h3 class="hover-title">${currentMovie.original_title}</h3>
            <h4 class="hover-year">${currentMovie.release_date}</h4>
            <p class="hover-genre">${genresResult}</p>
            <img class="hover-star" src="./images/star.svg" alt="star" />
            <p class="hover-score">${currentMovie.vote_average.toPrecision(
                2
            )}</p>
        </div>
        `;
        console.log(newSlide, "new");
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
    swiperFactory(
        "search",
        authToken,
        "results-swiper-container",
        searchedTerm
    );
    document.querySelector(".results-container").style.display = "block";
}

export async function populateMovieModal(id, token) {
    console.log(id, "adzhfehsghkjhdxfklbhlkr");
    let generalInfo = queryMovieDB(movieFindUrl + id, token);
    console.log(generalInfo);
    await generalInfo
        .then((value) => {
            console.log(value);
            let modalOverlay = document.querySelector(".modal-movie-overlay");
            modalOverlay
                .querySelector("#img-modal-movie")
                .querySelector("img").src = imageSearchUrl + value.poster_path;
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
                (value.overview.length > 400) ? value.overview.substr(0, 400) + "..." : value.overview.substr(0, 400)
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
            for (let i = 0; i < 4; i++) {
                castMembers.push(value.cast[i].name);
            }
            let result = castMembers.join(", ");
            placeValuesInText(modalOverlay, "#people-cast", result);
        });
}

export function openRegisterModal() {
    let registerOverlay = document.querySelector(".modal-register-overlay");
    registerOverlay.style.display = "flex";
    console.log("success");
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
    let formInfo = document.querySelector(".register");
    let username = formInfo.querySelector("[name='username']").value;
    let password = formInfo.querySelector("[name='password']").value;
    formInfo.querySelector("[name='username']").value = "";
    formInfo.querySelector("[name='password']").value = "";
    console.log(
        `Username provided is: ${username}, password provided is: ${password}.`
    );
    document.querySelector(".modal-register-overlay").style.display = "none";
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
    console.log(bigListOfGenres);
    for (let i = 0; i < 6; i++) {
        let button = bigListOfGenres.children[i];
        let id = genres[i].id;
        button.id = id;
        button.addEventListener("click", genreButtonSelect);
    }
}
