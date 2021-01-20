import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Button, InputBase } from '@material-ui/core';

export const SearchBar = ({ onSearchClick }) => {
    const classes = useStyles();
    const [textValue, setTextValue] = useState();

    return (
        <Paper component="form" className={classes.root}>
            <InputBase className={classes.input} placeholder="Please enter movie title" onChange={(event) => setTextValue(event.target.value)} />
            <Button variant="outlined" color="primary" onClick={() => onSearchClick(textValue)}>
                Search
            </Button>
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        width: 800,
        padding: 20,
        marginBottom: 10,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
}));
