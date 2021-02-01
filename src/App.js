import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { SearchBar, MovieList } from './Component';
import { getMovieInfoByTitle, getMovieInfoById } from './Services';
import { Paper } from '@material-ui/core';
import queryString from 'query-string';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            searchList: [],
            selectedList: [],
            searchListPage: 0,
            movieTitle: '',
            nextSearchDisable: true,
        };
    }

    componentDidMount = async () => {
        const location = this.props.location;
        const UrlQueryStrings = location.search;
        const { id } = queryString.parse(UrlQueryStrings);
        if (id) {
            var list = [];
            try {
                list = await Promise.all(
                    id.map(async (movieId) => {
                        const movie = await getMovieInfoById(movieId);
                        const movieObject = {
                            id: movie.imdbID,
                            title: movie.Title,
                            year: movie.Year,
                        };
                        return movieObject;
                    })
                );
                list = list.filter((value, index, self) => {
                    return value.id ? self.indexOf(value) === index : false;
                });
                this.setState({ selectedList: list.slice(0, 5), loading: false });
            } catch (error) {
                console.log('error in componentDidMount', error);
                this.setState({ loading: false });
            }
        }
    };

    searchMovie = async (title, page) => {
        const { selectedList } = this.state;
        try {
            const data = await getMovieInfoByTitle(title, page);
            if (!data || data.length === 0) {
                this.setState({ searchList: [] });
                return;
            }
            if (page < 99) {
                const nextPageData = await getMovieInfoByTitle(title, page + 1);
                this.setState({ nextSearchDisable: !nextPageData || nextPageData.length === 0 });
            } else {
                this.setState({ nextSearchDisable: true });
            }

            const searchList = data.map((movie) => ({
                id: movie.imdbID,
                title: movie.Title,
                year: movie.Year,
                selected: selectedList.findIndex((movieInList) => movieInList.id === movie.imdbID) === -1 ? false : true,
            }));
            this.setState({ searchList });
        } catch (error) {
            console.log('error in searchMovie', error);
        }
    };

    addToSelectedList = (addMovie) => {
        const { searchList, selectedList } = this.state;
        if (selectedList.length >= 5) {
            return;
        }
        const index = searchList.findIndex((movie) => movie.id === addMovie.id);
        searchList[index].selected = true;
        const newSelectedList = [...selectedList, addMovie];
        this.setState({ searchList, selectedList: newSelectedList });
    };

    removeFromSelectedList = (removeMovie) => {
        const { searchList, selectedList } = this.state;
        const removeIndex = selectedList.findIndex((movie) => movie.id === removeMovie.id);
        const newSelectedList = [...selectedList.slice(0, removeIndex), ...selectedList.slice(removeIndex + 1, selectedList.length)];
        const index = searchList.findIndex((movie) => movie.id === removeMovie.id);
        if (index !== -1) {
            searchList[index].selected = false;
        }
        this.setState({ selectedList: newSelectedList });
    };

    getNextSearchPage = () => {
        const { searchListPage, movieTitle } = this.state;
        const page = searchListPage + 1;
        this.searchMovie(movieTitle, page);
        this.setState({ searchListPage: page });
    };

    getLastSearchPage = () => {
        const { searchListPage, movieTitle } = this.state;
        const page = searchListPage - 1;
        this.searchMovie(movieTitle, page);
        this.setState({ searchListPage: page });
    };

    updateMovieTitle = async (movieTitle) => {
        if (!movieTitle || movieTitle.length === 0) {
            return;
        }
        this.setState({ movieTitle });
        try {
            await this.searchMovie(movieTitle, 0);
        } catch (error) {
            console.log('error in updateMovieTitle', error);
        }
    };

    render = () => {
        const { searchList, nextSearchDisable, searchListPage, selectedList } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.background}>
                <Paper className={classes.center}>
                    <h2>Movie Awards for Entrepreneurs</h2>
                    <SearchBar onSearchClick={this.updateMovieTitle} />
                    {selectedList.length > 4 && (
                        <Paper className={classes.banner}>
                            <p className={classes.bannerText}>You have nominated 5 movies</p>
                        </Paper>
                    )}
                    <div className={classes.container}>
                        <MovieList
                            mode={'search'}
                            data={searchList}
                            className={classes.searchList}
                            rowBtn={this.addToSelectedList}
                            nextPageBtn={this.getNextSearchPage}
                            nextPageBtnDisable={nextSearchDisable}
                            lastPageBtn={this.getLastSearchPage}
                            lastPageBtnDisable={searchListPage === 0}
                            disableAllRowBtn={selectedList.length >= 5}
                        />
                        <MovieList
                            mode={'selected'}
                            data={selectedList}
                            rowBtn={this.removeFromSelectedList}
                            lastPageBtnDisable={true}
                            nextPageBtnDisable={true}
                        />
                    </div>
                </Paper>
            </div>
        );
    };
}

export default withStyles((theme) => ({
    background: {
        width: '100%',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    banner: {
        padding: 1,
        marginBottom: 10,
        backgroundColor: '#f75563',
    },
    bannerText: {
        color: '#ffffff',
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    center: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: 50,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    searchList: {
        marginRight: 10,
    },
}))(App);
