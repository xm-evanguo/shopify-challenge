export const getMovieInfo = async (movieTitle) => {
    try {
        const rawRespond = await fetch(`https://www.omdbapi.com/?apikey=5f098a0e&s=${movieTitle}&type=movie`);
        const respond = await rawRespond.json();
        return respond.Search;
    } catch (error) {
        console.log('Error in services');
    }
};
