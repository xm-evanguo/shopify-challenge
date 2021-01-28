import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SearchBar, MovieList } from './Component'
import { getMovieInfoByTitle, getMovieInfoById } from './Services'
import { Paper } from '@material-ui/core';
import queryString from 'query-string';
import { useLocation } from "react-router-dom";

export const App = () => {
	const [searchList, setSearchList] = useState([]);
	const [selectedList, setSelectedList] = useState([]);
	const [searchListPage, setSearchListPage] = useState(0);
	const [movieTitle, setMovieTitle] = useState('');
	const [nextSearchDisable, setNextSearchDisable] = useState(true);
	const classes = useStyles();

	const getMovieById = (idObject) => {
		var list = [];
		console.log(idObject);
		setSelectedList(list);
	}	
const location = useLocation();
	const UrlQueryStrings = location.search;
	const { id } = queryString.parse(UrlQueryStrings);
	console.log(id, 'id?')
	if(id){
		getMovieById(id);
	}
	const searchMovie = async (title, page) => {
		const data = await getMovieInfoByTitle(title, page);
		if(!data || data.length === 0){
			setSearchList([]);
			return
		}
		if(page < 99){
			const nextPageData = await getMovieInfoByTitle(title, page+1);
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
		if(selectedList.length >= 5){
			return
		}
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
		setSelectedList(newSelectedList);
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

	const updateMovieTitle = async (title) => {
		if(!title || title.length === 0){
			return;
		}
		setMovieTitle(title);
		await searchMovie(title, 0);
	}

	return (
		<div className={classes.background}>
			<Paper className={classes.center}>
				<h2>Movie Awards for Entrepreneurs</h2>
				<SearchBar onSearchClick={updateMovieTitle}/>
				{
					selectedList.length > 4 && <Paper className={classes.banner}>
						<p className={classes.bannerText}>You have nominated 5 movies</p>
					</Paper>
				}
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
						disableAllRowBtn={selectedList.length >= 5}
					/>
					<MovieList
						mode={'selected'}
						data={selectedList}
						rowBtn={removeFromSelectedList}
						lastPageBtnDisable={true}
						nextPageBtnDisable={true}
					/>
				</div>
			</Paper>
		</div>
	);
}

const useStyles = makeStyles((theme) => ({
	background: {
		width: '100%',
		height: '100vh',
		backgroundColor: '#f5f5f5'
	},
	banner: {
		padding: 1,
		marginBottom: 10,
		backgroundColor: '#f75563',
	},
	bannerText: {
		color: '#ffffff',
		textAlign: 'center',
		verticalAlign: 'middle'
	},
	center: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		padding: 50
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