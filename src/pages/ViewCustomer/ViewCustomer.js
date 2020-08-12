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

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import { Grid, Paper } from '@material-ui/core';
const { baseUrl } = appConfig;



const useStyles = makeStyles({
    root: {
        maxWidth: 450,
    },
    width: {
        maxWidth: 300,
    },
    title: {
        fontSize: 16,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function ViewLCustomer(props) {


    const classes = useStyles();
    const [customer, ViewCustomer] = useState([]);
    const [status, ViewStatus] = useState([]);
    const [user, ViewUser] = useState([]);
    const customerId = props.match.params.id;

    const fetchLoanTypeData = async (customerId) => {

        axios.get(`${baseUrl}/customer/list/` + loanTypeId)
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
        fetchLoanTypeData(customerId);
    }, []);

    return (
        <AppTemplate>
            <div className="customer-view">
                <Grid container spacing={3}>
                    <Grid item xs>
                        
                        <br />
                        <br />
                        
                    </Grid>
                    <Grid item xs>
                        
                    </Grid>
                    <Grid item xs>

                    </Grid>
                </Grid>
            </div>

        </AppTemplate>
    );

}