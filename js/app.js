import queryMovieDB from "./functions.js"
import authToken from "./auth.js"

const swiper = new Swiper('.mySwiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    slidesPerView: 4,
    // grid: {
    //     rows: 2,
    //     fill: "row",
    // },
    spaceBetween: 30,

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

});


const movieSearchUrl = "https://api.themoviedb.org/3/search/movie?query=";
const imageBaseUrl = "http://image.tmdb.org/t/p/";
const imageSize = "w500";
const imageSearchUrl = imageBaseUrl + imageSize;
const dummySearch = "star wars";
const findByIdUrl = "https://api.themoviedb.org/3/movie/"
const creditsUrl = `https://api.themoviedb.org/3/movie/replaceThis/credits`
const genresSearchUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres='
const latestSearchurl = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.lte=2024-06-19&sort_by=primary_release_date.desc&vote_count.gte=1&with_original_language=en'"

async function grabObjInfo(url, token) {
    let obj = await queryMovieDB(url, token)
    let info = await queryMovieDB(findByIdUrl + obj.results[1].id, token)
    return info;
}

async function swiperFactory (type, token, searchAppend="", genreAppend="", swiperSig) {
    let typeList = ["search", "latest", "genre"];
    let urlList = [movieSearchUrl+searchAppend, latestSearchurl, genresSearchUrl+genreAppend]
    url = urlList[typeList.indexOf(type)];
    let movieList = await queryMovieDB(url, token);
    let swiperChosen = document.querySelector(`.${swiperSig}`);
    //to do, figure out the format of the hover
}


async function populateMovieModal(url, token) {
    function placeValuesInText(parentElem, id, textValue) {
        if (textValue == "") {
            textValue = "N/A";
        }
        else if (typeof textValue == "object") {
            let tempTextValue = textValue[0].name
            if (textValue.length > 1) {
                tempTextValue += "/" + textValue[1].name
            }
            textValue = tempTextValue
        }
        parentElem.querySelector(`#${id}`).innerText = textValue;
    }
    let generalInfo = grabObjInfo(url, token);
    await generalInfo.then((value) => {
        let modalOverlay = document.querySelector(".modal-movie-overlay");
        modalOverlay.querySelector("#img-modal-movie").querySelector("img").src = imageSearchUrl+value.poster_path
        placeValuesInText(modalOverlay, "title-movie-modal", value.original_title)
        placeValuesInText(modalOverlay, "year-release-movie", value.release_date.substr(0, 4))
        placeValuesInText(modalOverlay, "genre-movie-modal", value.genres)
        placeValuesInText(modalOverlay, "description-movie-modal", value.overview)
        placeValuesInText(modalOverlay, "rating-movie", value.vote_average.toPrecision(2))
        let castInfo = queryMovieDB(creditsUrl.replace("replaceThis", value.id), token);
        return castInfo
    }).then((value) => {
        let modalOverlay = document.querySelector(".modal-movie-overlay");
        let castMembers = [];
        for (let i = 0; i < 4; i++) {
            castMembers.push(value.cast[i].name);
        }
        let result = castMembers.join(", ");
        placeValuesInText(modalOverlay, "people-cast", result);
    })
}
populateMovieModal(movieSearchUrl+dummySearch, authToken);
//hack, change later
document.querySelector(".close-btn-movie").addEventListener("click", (evt) => {
    let btn = evt.currentTarget;
    document.querySelector(".modal-movie-overlay").style.display = "none";
})