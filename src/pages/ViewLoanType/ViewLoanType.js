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

export default function ViewLoanType(props) {


    const classes = useStyles();
    const [LoanType, ViewLoanType] = useState([]);
    const [status, ViewStatus] = useState([]);
    const [user, ViewUser] = useState([]);
    //console.log('Loan Types', LoanType);
    // console.log('props', props);
    const loanTypeId = props.match.params.id;

    const fetchLoanTypeData = async (loanTypeId) => {

        axios.get(`${baseUrl}/loantype/list/` + loanTypeId)
            .then(response => {
                // console.log('response', response);
                ViewLoanType(response.data);
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
        fetchLoanTypeData(loanTypeId);
    }, []);

    return (
        <AppTemplate>
            <div className="loan-type-view">
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Card className={classes.root} variant="outlined">
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Loan Type is:
                        </Typography>
                                <Typography variant="h5" component="h2">
                                    {LoanType.loanType} Loan
                        </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Description of the loan type:
                        </Typography>
                                <Typography variant="body1" component="p">
                                    {LoanType.description}
                                </Typography>
                                <br />
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Status:
                        </Typography>
                                <Typography variant="body1" component="p">
                                    {status.type == "ACTIVE" ? <ThumbUpIcon color="primary" /> : <ThumbDownIcon color="secondary" />}
                                </Typography>
                            </CardContent>
                        </Card>
                        <br />
                        <br />
                        <Card className={classes.root} variant="outlined">
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Created By:
                        </Typography>
                                <Typography variant="h5" component="h2">
                                    {user.firstName} {" "}
                                    {user.middleName} {" "}
                                    {user.lastName}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Created Date:
                        </Typography>
                                <Typography variant="body1" component="p">
                                    {LoanType.createdDate}
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card className={classes.root} variant="outlined">
                            <CardContent>
                                <Typography variant="h6" component="h6">
                                    NUMERICAL DETAILS :
                            </Typography>
                                <br />
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Maximum Amount :
                        </Typography>
                                <Typography variant="body1" component="p">
                                    {LoanType.maxAmount}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Minimum Amount:
                        </Typography>
                                <Typography variant="body1" component="p">
                                    {LoanType.minAmount}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Maximum Interest Rate:
                        </Typography>
                                <Typography variant="body1" component="p">
                                    {LoanType.maxInterestRate}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Minimum Interest Rate:
                        </Typography>
                                <Typography variant="body1" component="p">
                                    {LoanType.minInterestRate}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Maximum Time Period:
                        </Typography>
                                <Typography variant="body1" component="p">
                                    {LoanType.maxTimePeriod}
                                </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Minimum Time Period:
                        </Typography>
                                <Typography variant="body1" component="p">
                                    {LoanType.minTimePeriod}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs>

                    </Grid>
                </Grid>
                <br />
                <Grid className={classes.width} variant="outlined" >
                    <Card>
                        <CardContent>
                            <Typography>
                                <ButtonGroup>
                                    <Link to={"/edit-loan-type/" + LoanType.id} >
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
                                    <Link to={"/loantype-list"} >
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