import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
    Button, ButtonGroup,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid, Container, TextField, InputLabel, Select, FormControl, Icon,
    FormHelperText, MenuItem, Box, NativeSelect

} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import UpdateIcon from '@material-ui/icons/Update';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

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

    formControl: {
        margin: theme.spacing(1, 1, 1, 1),
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function EditLoanApplication(props) {


    const classes = useStyles();
    const [loanStatus, setStatus] = useState([]);

    //Setup initial State
    const initLoanApplication = {
        loanAmount: null,
        description: null,
        effectiveRate: null,
        loanTypeId: null,
        noOfRentals: null,
        otherCharges: null,
        paymentPeriod: null,
        rentalType: null
    }
    const [newApp, setNewLoanApplication] = useState(initLoanApplication);
    const resetData = () => {
        setNewLoanApplication(initLoanApplication)
    }

    const LoanApplicationId = props.match.params.id


    const onChange = (e) => {
        e.persist();
        setNewLoanApplication({ ...newApp, [e.target.name]: e.target.value });
    }


    //Get Loan Status
    const fetchLoanStatus = async () => {
        axios.get(`${baseUrl}/loanstatus/list`)
            .then(response => {
                console.log('response', response);
                setStatus(response.data);
            })
    };

    //Get loan application details by ID
    const fetchLoanApplicationData = async (LoanApplicationId) => {
        axios.get(`${baseUrl}/loanapplication/list/` + LoanApplicationId)
            .then(response => {
                console.log('response', response);
                setNewLoanApplication({
                    ...newApp,
                    ...response.data,
                    membership_no: response.data.customers.membership_no,
                    rentalTypeId: response.data.rentalTypeId.type,
                    loanStatus: response.data.loanStatus.type,
                    loanTypeId:response.data.loanTypeId.loanType,
                })
            })
    };




    //Error Handling
    const initErrors = {
        applicationNo: '',
        calculationNo: '',
        loanAmount: '',
        Description: '',
        effectiveRate: '',
        loanstatus: '',
        noOfRentals: '',
        otherCharges: '',
        paymentPeriod: '',
        loanTypeId: '',
        membership_no: '',
        rentalType: ''
    }
    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }



    const UpdateLoanApplication = (e) => {
        e.preventDefault();
        const data = {
            id: newApp.id,
            loanAmount: newApp.loanAmount,
            description: newApp.description,
            noOfRentals: newApp.noOfRentals,
            effectiveRate: newApp.effectiveRate,
            otherCharges: newApp.otherCharges,
            paymentPeriod: newApp.paymentPeriod,
            rentalTypeId: newApp.rentalTypeId,
            createdDate: newApp.createdDate,
            membership_no: newApp.membership_no,
            createdUser: {
                id: newApp.userid,
            }

        };
        console.log('data', data);
        axios.post(`${baseUrl}/loanapplication/add`, data)
            .then(function (response) {
                //console.log(response)
                utils.showSuccess("Loan Application Updated Successfully.");
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
        fetchLoanStatus();
        fetchLoanApplicationData(LoanApplicationId);
    }, []);

    return (
        <AppTemplate>
            <div className="edit-loan-application">
                <form autoComplete="off" onSubmit={UpdateLoanApplication}>
                    <Paper>
                        <Grid container spacing={4}>
                            <Grid item xs={3}>
                                <TextField
                                    name="membership_no"
                                    value={newApp.membership_no}
                                    id="outlined-helperText"
                                    label="Membership No"
                                    variant="outlined"
                                    style={{ margin: 8 }}
                                    onChange={onChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                            <TextField
                                    name="applicationNo"
                                    value={newApp.applicationNo}
                                    id="outlined-helperText"
                                    label="Application No"
                                    variant="outlined"
                                    style={{ margin: 8 }}
                                    onChange={onChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                            <TextField
                                    name="calculationNo"
                                    value={newApp.calculationNo}
                                    id="outlined-helperText"
                                    label="Calculatio No"
                                    variant="outlined"
                                    style={{ margin: 8 }}
                                    onChange={onChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                            <TextField
                                    name="loanStatus"
                                    value={newApp.loanStatus}
                                    id="outlined-helperText"
                                    label="Loan Status"
                                    variant="outlined"
                                    style={{ margin: 8 }}
                                    onChange={onChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                    <br />
                    <br />
                    <Grid container spacing={1}>
                        <Grid item xs={5}>
                            <Paper variant="outlined" >
                                <Box width="auto" p={1} my={0.5}>
                                    <TextField
                                        name="loanAmount"
                                        value={newApp.loanAmount}
                                        id="outlined-full-width"
                                        label="Loan Amount"
                                        placeholder="Enter Amount"
                                        helperText={errors.loanAmount}
                                        error={errors.loanAmount ? 'error' : ''}
                                        fullWidth
                                        size="small"
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onChange={onChange}
                                    />
                                    <TextField
                                        name="description"
                                        value={newApp.description}
                                        id="outlined-multiline-static"
                                        label="Description"
                                        placeholder="Enter Description"
                                        helperText={errors.description}
                                        error={errors.description ? 'error' : ''}
                                        multiline
                                        rows={4}
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={onChange}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={5}>
                            <Paper variant="outlined" >
                                <div>
                                <TextField
                                        name="loanTypeId"
                                        value={newApp.loanTypeId}
                                        id="outlined-helperText"
                                        label="Loan Type"
                                        helperText="Some important text"
                                        variant="outlined"
                                        style={{ margin: 8 }}
                                        onChange={onChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        name="effectiveRate"
                                        value={newApp.effectiveRate}
                                        id="outlined-helperText"
                                        label="Effective Rate"
                                        helperText="Some important text"
                                        variant="outlined"
                                        helperText={errors.effectiveRate}
                                        error={errors.effectiveRate ? 'error' : ''}
                                        style={{ margin: 8 }}
                                        onChange={onChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        name="paymentPeriod"
                                        value={newApp.paymentPeriod}
                                        id="outlined-helperText"
                                        label="Payment Period"
                                        helperText="Some important text"
                                        helperText={errors.paymentPeriod}
                                        error={errors.paymentPeriod ? 'error' : ''}
                                        variant="outlined"
                                        style={{ margin: 8 }}
                                        onChange={onChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        name="noOfRentals"
                                        value={newApp.noOfRentals}
                                        id="outlined-helperText"
                                        label="No of Rentals"
                                        helperText="Some important text"
                                        variant="outlined"
                                        style={{ margin: 8 }}
                                        onChange={onChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        name="rentalTypeId"
                                        value={newApp.rentalTypeId}
                                        id="outlined-helperText"
                                        label="Rental Type"
                                        helperText="Some important text"
                                        variant="outlined"
                                        style={{ margin: 8 }}
                                        onChange={onChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}

                                    />
                                    <TextField
                                        name="otherCharges"
                                        value={newApp.otherCharges}
                                        id="outlined-helperText"
                                        label="Other Charges"
                                        helperText="Some important text"
                                        variant="outlined"
                                        style={{ margin: 8 }}
                                        onChange={onChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            </Paper>
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
                                endIcon={<UpdateIcon />}
                            >
                                Update
            </Button>
                            {" "}
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={resetError}
                            >
                                Back
                        </Button>
                        </div>
                    </Paper>
                </form>
            </div>
        </AppTemplate>
    )
}