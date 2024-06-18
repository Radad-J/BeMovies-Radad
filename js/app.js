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
  

let searchUrl = "https://api.themoviedb.org/3/search/movie?query=";
let imageBaseUrl = "http://image.tmdb.org/t/p/";
let imageSize = "w500";
let dummySearch = "fall";
let findByIdUrl = "https://api.themoviedb.org/3/movie/"

async function temp(url, token) {
    let obj = await queryMovieDB(url, authToken)
    console.log(obj.results[0].id);
    let info = await queryMovieDB("https://api.themoviedb.org/3/movie/" + obj.results[0].id, authToken)
    console.log(info);
}

temp(searchUrl+dummySearch, authToken);