import 'date-fns';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Grid, TextField, TableBody, Table, TableRow,
    TableContainer, TableCell, TableHead, Card, Collapse
} from '@material-ui/core';

import { green } from '@material-ui/core/colors';

import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SendIcon from '@material-ui/icons/Send';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
const { baseUrl } = appConfig;

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
        marginLeft: theme.spacing(2),
    },
    Table: {
        width: 1200,
        margin: theme.spacing(1, 1, 1, 1),
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
}));
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);
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

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const history = useHistory();

    const classes = useStyles();

    const [paymentList, setPaymentList] = useState([]);

    //Setup initial State
    const initCalc = {
        startDate: null,
        initialBalance: null,
        interestRate: null,
        durationInMonths: null,
        futureValue: null,
        paymentType: null,
    }
    const [newCalc, setNewCalculation] = useState(initCalc);
    const resetData = () => {
        setNewCalculation(initCalc)
    }

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
        paymentType: '',
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
                console.log(response)
                utils.showSuccess("Calculated Successfully.");
                setPaymentList(response.data.paymentList)
            })
            .catch(_errors => {
                console.log('_errors', _errors);
                if (_errors.response) {
                    console.log('Test');
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
                                    placeholder="Enter Amount"
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
                                    placeholder="Enter Interest"
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
                                    placeholder="Enter Duration"
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
                                <TextField
                                    id="date"
                                    name="startDate"
                                    helperText={errors.startDate}
                                    error={errors.startDate ? 'error' : ''}
                                    label="Date From"
                                    type="date"
                                    placeholder="2021-03-05"
                                    className={classes.button}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                            </Grid>
                        </Grid>
                        <div>
                            <Grid className={classes.button}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.selectEmpty}
                                    endIcon={<SendIcon />}
                                    className={clsx(classes.expand, {
                                        [classes.expandOpen]: expanded,
                                    })}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="show more"
                                >
                                    Calculate
                                </Button>
                                {" "}
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
                            </Grid>
                        </div>
                    </Paper>
                    <br />
                    <Paper className={classes.button}>
                        <Card>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <TableContainer component={Paper}>
                                    <Table className={classes.Table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                                <StyledTableCell align="left">Payment No</StyledTableCell>
                                                <StyledTableCell align="left">Principal Paid</StyledTableCell>
                                                <StyledTableCell align="left">Interest Paid</StyledTableCell>
                                                <StyledTableCell align="left">Payment Date</StyledTableCell>
                                                <StyledTableCell align="left">Balance</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                paymentList.map((row) => (
                                                    <StyledTableRow key={row.id}>
                                                        <StyledTableCell align="left">{row.paymentNumber}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.principalPaid}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.interestPaid}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.paymentDate}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.balance}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Collapse>
                        </Card>
                    </Paper>
                </form>
            </div>
        </AppTemplate>
    )
}