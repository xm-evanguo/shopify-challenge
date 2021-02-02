import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField, Modal } from '@material-ui/core';
import { SearchBar, MovieList } from './Component';
import { getMovieInfoByTitle, getMovieInfoById } from './Services';
import { Paper } from '@material-ui/core';
import queryString from 'query-string';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            modalVisible: false,
            shareLink: '',
        };
    }

    componentDidMount = async () => {
        const location = this.props.location;
        const UrlQueryStrings = location.search;
        const { id } = queryString.parse(UrlQueryStrings);
        if (id) {
            var list = [];
            console.log(id, location, 'id and location')
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
                list = list.filter((curMovie, index, self) => {
                    return curMovie.id ? index === self.findIndex((tmpMovie) => tmpMovie.id === curMovie.id) : false;
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
                this.noMovieFound();
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

    shareLink = () => {
        const { selectedList } = this.state;
        var url = 'https://xm-evanguo.github.io/shopify-challenge/?';
        selectedList.forEach((movie, index) => {
            if (index === 0) {
                url = url + `id=${movie.id}`;
            } else {
                url = url + `&id=${movie.id}`;
            }
        });
        this.setState({ modalVisible: true, shareLink: url });
    };

    onModalClose = () => {
        this.setState({ modalVisible: false });
    };

    afterCopyClick = () => {
        toast.success('Successfully copy to clipboard', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    noMovieFound = () => {
        toast.error(`No movie found`, {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    render = () => {
        const { searchList, nextSearchDisable, searchListPage, selectedList, modalVisible, shareLink } = this.state;
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
                    {selectedList.length !== 0 && (
                        <Button variant="outlined" color="primary" onClick={this.shareLink} className={classes.pageBtn}>
                            {'Create share link'}
                        </Button>
                    )}
                </Paper>
                <Modal open={modalVisible} onClose={this.onModalClose}>
                    <Paper className={[classes.shareLinkContainer, classes.center]}>
                        <TextField disabled multiline label="Share Link" defaultValue={shareLink} className={classes.link} />
                        <CopyToClipboard text={shareLink} onCopy={this.afterCopyClick}>
                            <Button variant="outlined" color="primary" onClick={this.shareLink} className={classes.pageBtn}>
                                {'Copy'}
                            </Button>
                        </CopyToClipboard>
                    </Paper>
                </Modal>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                />
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
    shareLinkContainer: {
        minHeight: 50,
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    link: {
        width: '100%',
    },
    pageBtn: {
        marginLeft: 5,
    },
}))(App);
