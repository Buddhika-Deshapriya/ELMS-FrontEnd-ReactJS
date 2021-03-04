import 'date-fns';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Grid, TextField, InputLabel, Select, FormControl,
    FormHelperText, MenuItem, Box,
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { green } from '@material-ui/core/colors';

import DateFnsUtils from '@date-io/date-fns';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SendIcon from '@material-ui/icons/Send';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import SystemUser from "../../helper/user"; const { baseUrl } = appConfig;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing(1, 1, 1, 1),
    },
    textField: {
        margin: theme.spacing(1, 1, 1, 1),
    },

    formControl: {
        margin: theme.spacing(1, 1, 1, 2),
        width: 200
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}))(Button);
export default function LoanTrialCalc(props) {

    const history = useHistory();

    const classes = useStyles();

    //Setup initial State
    const initCalc = {
        startDate: null,
        initialBalance: null,
        interestRate: null,
        durationInMonths: null,
        futureValue: null,
        paymentType: null
    }
    const [newCalc, setNewCalculation] = useState(initCalc);
    const resetData = () => {
        setNewCalculation(initCalc)
    }

    // const branchId = props.match.params.id

    const [selectedDate, setSelectedDate] = React.useState(new Date('2021-03-05'));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const onChange = (e) => {
        e.persist();
        setNewCalculation({ ...newCalc, [e.target.name]: e.target.value });
    }

    //Error Handling
    const initErrors = {
        startDate: '',
        initialBalance: '',
        interestRate: '',
        durationInMonths: '',
        futureValue: '',
        paymentType: ''
    }
    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }


    const SubmitNewCalculation = (e) => {
        e.preventDefault();
        const data = {
            startDate: newCalc.startDate,
            initialBalance: newCalc.initialBalance,
            interestRate: newCalc.interestRate,
            durationInMonths: newCalc.durationInMonths,
            futureValue: "0",
            paymentType: "0"
        };
        console.log('data', data);
        axios.post(`${baseUrl}/loancalc/show`, data)
            .then(function (response) {
                //console.log(response)
                utils.showSuccess("Calculated Successfully.");
            })
            .catch(_errors => {
                //console.log('_errors',_errors);
                if (_errors.response) {
                    //console.log('Test');
                    const _sErrors = _errors.response.data.errors;
                    const _error = _errors.response.data.error;
                    if (_sErrors !== undefined) {
                        let errorsObj = {}
                        _sErrors.forEach(error => {
                            const { defaultMessage, field } = error
                            errorsObj[field] = defaultMessage;
                        })
                        setErrors({ ...errors, ...errorsObj });
                    }
                    else {
                        utils.showError(_error)
                    }

                }
            });
    };


    //This is same as componentdidmount()
    useEffect(() => {
    }, []);

    return (
        <AppTemplate>
            <div className="new-loan-calculation">
                <form className={classes.root} noValidate autoComplete="off" onSubmit={SubmitNewCalculation}>
                    <Paper className={classes.button}>
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-helperText"
                                    label="Loan Amount"
                                    name="initialBalance"
                                    variant="outlined"
                                    helperText={errors.initialBalance}
                                    error={errors.initialBalance ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    size="medium"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-helperText"
                                    label="Interest Rate"
                                    name="interestRate"
                                    variant="outlined"
                                    helperText={errors.interestRate}
                                    error={errors.interestRate ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    size="medium"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-helperText"
                                    label="Duration In Months"
                                    name="durationInMonths"
                                    variant="outlined"
                                    helperText={errors.durationInMonths}
                                    error={errors.durationInMonths ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    size="medium"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item xs={3}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    variant="outlined"
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date From"
                                    format="yyyy/MM/dd"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className={classes.button}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <br />
                        <Paper variant="outlined" >
                            <div>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    endIcon={<SendIcon />}
                                >
                                    Calculate
                                </Button>
                                <ColorButton variant="contained" color="secondary" className={classes.margin} type="reset" startIcon={<RotateLeftIcon />} onClick={resetError}>
                                    <b>Reset</b>
                                </ColorButton>
                                {" "}
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    onClick={() => history.goBack()}
                                >
                                    Back
                                </Button>
                            </div>
                        </Paper>
                    </Paper>
                </form>
            </div>
        </AppTemplate>
    )
}