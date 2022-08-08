import httpServ from './httpService.js';

const apiEndPoint = '/movies';

export const getMovies = () => {
    return( httpServ.get(apiEndPoint) );
}

export const getMovie = (movieID) => {
    return( httpServ.get(apiEndPoint +'/'+ movieID) );
}

export const saveMovie = (movie) => {
    return( httpServ.post(apiEndPoint, movie) ); 
}

export const updateMovie = (movieID, movie) => {
    return( httpServ.put(apiEndPoint +'/'+ movieID, movie) );
}

export const deleteMovie = (movieID) => {
    return( httpServ.delete(apiEndPoint +'/'+ movieID) );
}
