export const movieSearchUrl = "https://api.themoviedb.org/3/search/movie?query=";
const imageBaseUrl = "http://image.tmdb.org/t/p/";
const imageSize = "w342";
export const imageSearchUrl = imageBaseUrl + imageSize;
export const creditsUrl = `https://api.themoviedb.org/3/movie/replaceThis/credits`
export const genresSearchUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.lte=replaceDateHere&sort_by=primary_release_date.desc&vote_count.gte=100&with_genres=replaceGenreHere'
export const latestSearchurl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.lte=replaceDateHere&sort_by=primary_release_date.desc&vote_count.gte=100'
export const movieFindUrl = "https://api.themoviedb.org/3/movie/"
export const genresList =  [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 16,
        "name": "Animation"
      },
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 99,
        "name": "Documentary"
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 10751,
        "name": "Family"
      },
      {
        "id": 14,
        "name": "Fantasy"
      },
      {
        "id": 36,
        "name": "History"
      },
      {
        "id": 27,
        "name": "Horror"
      },
      {
        "id": 10402,
        "name": "Music"
      },
      {
        "id": 9648,
        "name": "Mystery"
      },
      {
        "id": 10749,
        "name": "Romance"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      },
      {
        "id": 10770,
        "name": "TV Movie"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 10752,
        "name": "War"
      },
      {
        "id": 37,
        "name": "Western"
      }
]