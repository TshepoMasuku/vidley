import * as genresAPI from "./fakeGenreService";

const movies = [
    {
        _id: "5b21ca3eeb7f6fbccd471815",
        title: "Terminator",
        genre: { _id: "5b21ca3eeb7f6fbccd471814", name: "Action" },
        numberInStock: 6,
        dailyRentalRate: 5,
        liked: true,
        publishDate: "2018-01-03T19:04:28.809Z"
    },
    {
        _id: "5b21ca3eeb7f6fbccd471816",
        title: "Die Hard",
        genre: { _id: "5b21ca3eeb7f6fbccd471814", name: "Action" },
        numberInStock: 5,
        dailyRentalRate: 5,
        liked: true,
        publishDate: "2018-01-03T19:04:28.809Z"
    },
    {
        _id: "5b21ca3eeb7f6fbccd471817",
        title: "Get Out",
        genre: { _id: "5b21ca3eeb7f6fbccd471820", name: "Thriller" },
        numberInStock: 8,
        dailyRentalRate: 7,
        liked: false,
        publishDate: "2018-01-03T19:04:28.809Z"
    },
    {
        _id: "5b21ca3eeb7f6fbccd471819",
        title: "Trip to Italy",
        genre: { _id: "5b21ca3eeb7f6fbccd471818", name: "Comedy" },
        numberInStock: 7,
        dailyRentalRate: 7,
        liked: false,
        publishDate: "2018-01-03T19:04:28.809Z"
    },
    {
        _id: "5b21ca3eeb7f6fbccd47181a",
        title: "Airplane",
        genre: { _id: "5b21ca3eeb7f6fbccd471818", name: "Comedy" },
        numberInStock: 7,
        dailyRentalRate: 7,
        liked: false,
        publishDate: "2018-01-03T19:04:28.809Z"
    },
    {
        _id: "5b21ca3eeb7f6fbccd47181b",
        title: "Wedding Chrushers",
        genre: { _id: "5b21ca3eeb7f6fbccd471818", name: "Comedy" },
        numberInStock: 7,
        dailyRentalRate: 7,
        liked: true,
        publishDate: "2018-01-03T19:04:28.809Z"
    },
    {
        _id: "5b21ca3eeb7f6fbccd47181e",
        title: "Gone Girl",
        genre: { _id: "5b21ca3eeb7f6fbccd471820", name: "Thriller" },
        numberInStock: 7,
        dailyRentalRate: 9,
        liked: false,
        publishDate: "2018-01-03T19:04:28.809Z"
    },
    {
        _id: "5b21ca3eeb7f6fbccd47181f",
        title: "The Sixth Sense",
        genre: { _id: "5b21ca3eeb7f6fbccd471820", name: "Thriller" },
        numberInStock: 4,
        dailyRentalRate: 7,
        liked: true,
        publishDate: "2018-01-03T19:04:28.809Z"
    },
    {
        _id: "5b21ca3eeb7f6fbccd471821",
        title: "The Avengers",
        genre: { _id: "5b21ca3eeb7f6fbccd471814", name: "Action" },
        numberInStock: 7,
        dailyRentalRate: 7,
        liked: true,
        publishDate: "2018-01-03T19:04:28.809Z"
    },
]

export function getMovies() { return movies }

export function getMovie(id) { 
    return( movies.find( m => m._id === id )) 
}

export function saveMovie(movie) {
    // check if movie already exists in MOVIES
    const movieInDb = getMovie(movie._id) || null;
    console.log('is movieInDb :>> ', Boolean(movieInDb));
    // MOVIE doesn't exist in the MOVIES array --> SAVE movie.
    if (!movieInDb) {
        movies.push(movie);
        return;
    }
    // MOVIE exists in the MOVIES array --> UPDATE movie.
    if (movieInDb) {
        movieInDb.title = movie.title;
        movieInDb.genre = genresAPI.getGenre(movie);
        movieInDb.numberInStock = movie.numberInStock;
        movieInDb.dailyRentalRate = movie.dailyRentalRate;
        return;
    }
}
