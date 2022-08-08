import httpServ from './httpService.js';

const apiEndPoint = '/genres';

export const getGenres = () => {
    return( httpServ.get(apiEndPoint) );
};

export const getGenre = (genreID) => {
    return( httpServ.get(apiEndPoint +'/'+ genreID) );
};
