import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Button, ListItem, Paper } from '@material-ui/core';

export const MovieList = ({ data, rowBtn, mode, nextPageBtn, lastPageBtn, lastPageBtnDisable, nextPageBtnDisable }) => {
    const classes = useStyles();

    const renderRow = (movie) => {
        return (
            <ListItem className={classes.row}>
                <h10 className={classes.text}>{`${movie.title} (${movie.year})`}</h10>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => rowBtn(movie)}
                    disabled={mode === 'search' ? movie.selected : false}
                    className={classes.btn}>
                    {mode === 'search' ? 'Nominations' : 'Remove'}
                </Button>
            </ListItem>
        );
    };

    return (
        <>
            {data && data.length !== 0 && (
                <Paper component="div" className={classes.root}>
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
            )}
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
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
