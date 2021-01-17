import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Button, ListItem, Paper } from '@material-ui/core';


export const MovieList = ({ data, btnOnPress, mode }) => {
	const classes = useStyles();
    
    const renderRow = (movie) => {
        return(
            <ListItem className={classes.row}>
                <h10 className={classes.text}>
                    {movie.title}
                </h10>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => btnOnPress(movie)}
                    disabled={mode === 'search' ? movie.selected : false}
                    className={classes.btn}
                >
                    {mode === 'search' ? 'Nominations' : 'Remove'}
                </Button>
            </ListItem>
        )
    }

	return (
        <Paper component="div" className={classes.root}>
            <List>
                {data.map((movie) => renderRow(movie))}
            </List>
        </Paper>
	);
}

const useStyles = makeStyles((theme) => ({
    row: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: "center",
        width: 400,
        paddingHorizontal: 5
    },
    btn: {
        marginLeft: 5
    },
    text: {
        marginRight: theme.spacing(1),
		flex: 1,
    }
}));