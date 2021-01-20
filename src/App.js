import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SearchBar, MovieList } from './Component'
import { getMovieInfo } from './Services'

export const App = () => {
	const [searchList, setSearchList] = useState([]);
	const [selectedList, setSelectedList] = useState([]);
	const [displaySelectedList, setDisplaySelectedList] = useState([]);
	const [searchListPage, setSearchListPage] = useState(0);
	const [selectedListPage, setSelectedListPage] = useState(0);
	const [movieTitle, setMovieTitle] = useState('');
	const [nextSearchDisable, setNextSearchDisable] = useState(true);
	const classes = useStyles();

	const searchMovie = async (title, page) => {
		const data = await getMovieInfo(title, page);
		if(!data || data.length === 0){
			setSearchList([]);
			return
		}
		if(page < 99){
			const nextPageData = await getMovieInfo(title, page+1);
			setNextSearchDisable(!nextPageData || nextPageData.length === 0)
		}else{
			setNextSearchDisable(true)
		}

		const searchList = data.map((movie) => (
			{
				id: movie.imdbID,
				title: movie.Title,
				year: movie.Year,
				selected: selectedList.findIndex((movieInList) => movieInList.id === movie.imdbID) === -1 ? false : true
			}
		))
		setSearchList(searchList);
	}

	const addToSelectedList = (addMovie) => {
		const index = searchList.findIndex((movie) => movie.id === addMovie.id);
		searchList[index].selected = true;
		const newSelectedList = [...selectedList, addMovie];
		setSearchList(searchList);
		setSelectedList(newSelectedList);
		setDisplaySelectedList(newSelectedList.slice(10*selectedListPage, 10*selectedListPage+10));
	}

	const removeFromSelectedList = (removeMovie) => {
		const removeIndex = selectedList.findIndex((movie) => movie.id === removeMovie.id);
		const newSelectedList = [...selectedList.slice(0, removeIndex), ...selectedList.slice(removeIndex + 1, selectedList.length)];
		const index = searchList.findIndex((movie) => movie.id === removeMovie.id);
		if(index !== -1){
			searchList[index].selected = false;
		}
		setSelectedList(newSelectedList);
		setDisplaySelectedList(newSelectedList.slice(10*selectedListPage, 10*selectedListPage+10));
	}

	const getNextSearchPage = () => {
		const page = searchListPage + 1;
		searchMovie(movieTitle, page);
		setSearchListPage(page);
	}

	const getLastSearchPage = () => {
		const page = searchListPage - 1;
		searchMovie(movieTitle, page);
		setSearchListPage(page);
	}

	const getNextSelectedPage = () => {
		const page = selectedListPage + 1;
		setDisplaySelectedList(selectedList.slice(10*page, 10*page+10));
		setSelectedListPage(page);
	}

	const getLastSelectedPage = () => {
		const page = selectedListPage - 1;
		setDisplaySelectedList(selectedList.slice(10*page, 10*page+10));
		setSelectedListPage(page);
	}

	const updateMovieTitle = async (title) => {
		setMovieTitle(title);
		await searchMovie(title, 0);
	}

	return (
		<div className={classes.center}>
			<SearchBar onSearchClick={updateMovieTitle}/>
			<div className={classes.container}>
				<MovieList
					mode={'search'}
					data={searchList}
					className={classes.searchList}
					rowBtn={addToSelectedList}
					nextPageBtn={getNextSearchPage}
					nextPageBtnDisable={nextSearchDisable}
					lastPageBtn={getLastSearchPage}
					lastPageBtnDisable={searchListPage === 0}
				/>
				<MovieList
					mode={'selected'}
					data={displaySelectedList}
					rowBtn={removeFromSelectedList}
					nextPageBtn={getNextSelectedPage}
					nextPageBtnDisable={selectedListPage*10+displaySelectedList.length >= selectedList.length}
					lastPageBtn={getLastSelectedPage}
					lastPageBtnDisable={selectedListPage === 0}
				/>
			</div>
		</div>
	);
}

const useStyles = makeStyles((theme) => ({
	center: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)'
	},
	container: {
		display: 'flex',
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between'
	},
	searchList: {
		marginRight: 10
	},
}));