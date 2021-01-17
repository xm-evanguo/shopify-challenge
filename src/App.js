import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SearchBar, MovieList } from './Component'
import { getMovieInfo } from './Services'

export const App = () => {
	const [searchList, setSearchList] = useState([]);
	const [selectedList, setSelectedList] = useState([]);
	const classes = useStyles();

	const searchMovie = async (movieTitle) => {
		const data = await getMovieInfo(movieTitle);
		if(!data || data.length === 0){
			setSearchList([]);
			return
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
	}

	const removeFromSelectedList = (removeMovie) => {
		const removeIndex = selectedList.findIndex((movie) => movie.id === removeMovie.id);
		const newSelectedList = [...selectedList.slice(0, removeIndex), ...selectedList.slice(removeIndex + 1, selectedList.length)];
		const index = searchList.findIndex((movie) => movie.id === removeMovie.id);
		if(index !== -1){
			searchList[index].selected = false;
		}
		setSelectedList(newSelectedList)
	}

	return (
		<div className={classes.center}>
			<SearchBar onSearchClick={searchMovie}/>
			<div className={classes.container}>
				<MovieList mode={'search'} className={classes.searchList} data={searchList} btnOnPress={addToSelectedList} />
				<MovieList mode={'selected'} data={selectedList} btnOnPress={removeFromSelectedList} />
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