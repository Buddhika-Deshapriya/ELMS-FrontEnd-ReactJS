import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';

import BackupIcon from '@material-ui/icons/Backup';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PhotoCamera from '@material-ui/icons/PhotoCamera';



import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import { Grid, Paper } from '@material-ui/core';
const { baseUrl } = appConfig;



const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 750,
    },
    width: {
        '& > *': {
            margin: theme.spacing(1),
            maxWidth: 250,
        },
        title: {
            fontSize: 16,
        },
        pos: {
            marginBottom: 12,
        },
        input: {
            display: 'none',
        },
    }
}));

export default function ViewCustomer(props) {


    const classes = useStyles();
    const [customer, ViewCustomer] = useState([]);
    const [status, ViewStatus] = useState([]);
    const [user, ViewUser] = useState([]);
    const customerId = props.match.params.id;

    const fecthCustomerData = async (customerId) => {

        axios.get(`${baseUrl}/customer/list/` + customerId)
            .then(response => {
                // console.log('response', response);
                ViewCustomer(response.data);
                ViewStatus(response.data.status);
                ViewUser(response.data.createdUser);
            })
            .catch(_errors => {
                if (_errors.response) {
                    const { status, data } = _errors.response;
                    console.log('_errors.response', _errors.response);
                    if (status === 401) {
                        console.log('data.error', data.error);
                        utils.showError("Bad Credintials");
                    }
                    else {
                        let errorsObj = {}
                        data.errors.forEach(error => {
                            const { defaultMessage, field } = error
                            errorsObj[field] = defaultMessage;
                        })
                        console.log(errorsObj);
                        this.setState({ errors: errorsObj });
                    }

                }
            });



    };

    useEffect(() => {
        fecthCustomerData(customerId);
    }, []);

    return (
        <AppTemplate>
            <div className="customer-view">
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Card className={classes.width} variant="outlined">
                            <CardContent>
                                <Typography>
                                    {"Scanned images of NIC card"}
                                </Typography>
                                <Typography>
                                    
                                </Typography>

                            </CardContent>
                        </Card>
                        <br />
                        <br />
                        
                        {/* 
                        upload link to inndividual customer NIC images in both sides              */}
                        <Card className={classes.width} variant="outlined">
                            <CardContent>
                                <Typography>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                    />
                                    <label htmlFor="contained-button-file">
                                        <br />
                                    </label>
                                    <input accept="image/*" className={classes.width} id="icon-button-file" type="file" />
                                    <label htmlFor="icon-button-file">
                                        <br />
                                        <Button variant="contained" color="primary" component="span">
                                            <BackupIcon fontSize="small" />
                                            Upload
                                    </Button>

                                    </label>
                                </Typography>
                            </CardContent>
                        </Card>

                    </Grid>
                    <Grid item xs>
                        <Card className={classes.root} variant="outlined">
                            <CardContent>

                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs>

                    </Grid>
                </Grid>
            </div>

        </AppTemplate>
    );

}