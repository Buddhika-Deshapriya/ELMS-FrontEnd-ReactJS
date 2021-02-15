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

export default function ViewLoanApplication(props) {


    const classes = useStyles();
    const [loanApplication, ViewLoanApplication] = useState([]);
    const [membershipNo, ViewMembershipNo] = useState([]);
    const [loanType, ViewLoanType] = useState([]);
    const [loanStatus, ViewLoanStatus] = useState([]);
    const [user, ViewUser] = useState([]);
    const [userRole, ViewUserRole] = useState([]);
    const [rentalType, ViewRentalType] = useState([]);
    const [branch, ViewBranch] = useState([]);

    const loanApplicationId = props.match.params.id;

    const fetchLoanApplicationData = async (loanApplicationId) => {

        axios.get(`${baseUrl}/loanApplication/list/` + loanApplicationId)
            .then(response => {
                // console.log('response', response);
                ViewLoanApplication(response.data);
                ViewMembershipNo(response.data.customers);
                ViewLoanType(response.data.loanTypeId);
                ViewLoanStatus(response.data.loanStatus);
                ViewBranch(response.data.branch);
                ViewRentalType(response.data.rentalTypeId);
                ViewUser(response.data.createdUser);
                ViewUserRole(response.data.createdUser.roles);
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
        fetchLoanApplicationData(loanApplicationId);
    }, []);

    return (
        <AppTemplate>
            <div className="loan-application-view">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card className={classes.root} variant="outlined">
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Membership No:
                        </Typography>
                                <Typography variant="h5" component="h2">
                                    {/* {membershipNo.membership_no} */}
                        </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid className={classes.width} variant="outlined" >
                    <Card>
                        <CardContent>
                            <Typography>
                                <ButtonGroup>
                                    <Link to={"/edit-loan-application/" + loanApplication.id} >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                        >
                                            <EditIcon fontSize="small" />
                                        Edit

                                    </Button>
                                    </Link>
                                </ButtonGroup>
                                {" "}
                                <ButtonGroup>
                                    <Link to={"/loanApplication-list"} >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            className={classes.button}
                                        >
                                            <ArrowBackIosIcon fontSize="small" />
                                        Back
                                    </Button>
                                    </Link>
                                </ButtonGroup>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </div>

        </AppTemplate>
    );

}