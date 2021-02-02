import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Button, ListItem, Paper } from '@material-ui/core';

export const MovieList = ({ data, rowBtn, mode, nextPageBtn, lastPageBtn, lastPageBtnDisable, nextPageBtnDisable, disableAllRowBtn }) => {
    const classes = useStyles();

    const renderRow = (movie) => {
        return (
            <ListItem className={classes.row} key={movie.id}>
                <h10 className={classes.text}>{`${movie.title} (${movie.year})`}</h10>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => rowBtn(movie)}
                    disabled={disableAllRowBtn ? true : mode === 'search' ? movie.selected : false}
                    className={classes.btn}>
                    {mode === 'search' ? 'Nominate' : 'Remove'}
                </Button>
            </ListItem>
        );
    };

    return (
        <Paper component="div" className={classes.root}>
            <h4 className={classes.title}>{mode === 'search' ? 'Search Result' : 'Nominated'}</h4>
            <List>{data.map((movie) => renderRow(movie))}</List>
            {(!lastPageBtnDisable || !nextPageBtnDisable) && (
                <>
                    <Button variant="outlined" color="primary" onClick={lastPageBtn} disabled={lastPageBtnDisable} className={classes.pageBtn}>
                        {'Last'}
                    </Button>
                    <Button variant="outlined" color="primary" onClick={nextPageBtn} disabled={nextPageBtnDisable} className={classes.pageBtn}>
                        {'Next'}
                    </Button>
                </>
            )}
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: 10,
        paddingRight: 5,
        marginBottom: 10,
        width: 400,
    },
    title: {
        marginLeft: 16,
    },
    row: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 400,
    },
    btn: {
        marginLeft: 5,
    },
    text: {
        marginRight: theme.spacing(1),
        flex: 1,
    },
    pageBtn: {
        marginLeft: 5,
    },
}));
