import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles , withStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Grid, TextField, InputLabel, Select, FormControl, MenuItem, Box,

} from '@material-ui/core';
import { green } from '@material-ui/core/colors';

import SendIcon from '@material-ui/icons/Send';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import SystemUser from "../../helper/user";
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

export default function EditLoanApplication(props) {

    const history = useHistory();

    const classes = useStyles();
    const [loanTypeId, setLoanType] = useState([]);
    const [rentalTypeId, setRentalType] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());
    const [userId, setUserID] = useState([]);

    //Setup initial State
    const initLoanApplication = {
        loanAmount: null,
        description: null,
        effectiveRate: null,
        loanTypeId: null,
        noOfRentals: null,
        otherCharges: null,
        paymentPeriod: null,
        rentalTypeId: null,

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
    //Get rental type details
    const fetchRentalTypeData = async () => {
        axios.get(`${baseUrl}/rentaltype/list`)
            .then(response => {
                console.log('response', response);
                setRentalType(response.data);
            })
    }

    //Get loan type details
    const fetchLoanTypeData = async () => {
        axios.get(`${baseUrl}/loantype/list`)
            .then(response => {
                console.log('loanType', response);
                setLoanType(response.data);
            })
    }
    //Get Logged in user id
    const getCurrentUser = async () => {
        //console.log(SystemUser.get())
        setUserID(SystemUser.get().id);
    };

    //Get loan application details by ID
    const fetchLoanApplicationData = async (LoanApplicationId) => {
        axios.get(`${baseUrl}/loanapplication/list/` + LoanApplicationId)
            .then(response => {
                console.log('response', response);
                setNewLoanApplication({
                    ...newApp,
                    ...response.data,
                    membership_no: response.data.customers[0].membership_no,
                    rentalTypeId: response.data.rentalTypeId.id,
                    loanStatus: response.data.loanStatus.type,
                    loanTypeId: response.data.loanTypeId.id,
                    userid: response.data.createdUser.id,
                    branch: response.data.branch.branchCode,
                    branchId: response.data.branch.id,
                    customerId: response.data.customers[0],

                });
            })
    };

    //Error Handling
    const initErrors = {
        applicationNo: '',
        calculationNo: '',
        loanAmount: '',
        Description: '',
        effectiveRate: '',
        loanStatus: '',
        noOfRentals: '',
        otherCharges: '',
        paymentPeriod: '',
        loanTypeId: '',
        membership_no: '',
        rentalTypeId: '',
    }
    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }

    const UpdateLoanApplication = (e) => {
        e.preventDefault();
        const data = {
            id: newApp.id,
            applicationNo: newApp.applicationNo,
            calculationNo: newApp.calculationNo,
            loanAmount: newApp.loanAmount,
            description: newApp.description,
            noOfRentals: newApp.noOfRentals,
            effectiveRate: newApp.effectiveRate,
            otherCharges: newApp.otherCharges,
            paymentPeriod: newApp.paymentPeriod,
            rentalTypeId: {
                id: newApp.rentalTypeId,
            },
            loanTypeId: {
                id: newApp.loanTypeId,
            },
            loanStatus: {
                id: 1,
            },
            branch: {
                id: newApp.branchId,
            },
            createdDate: newApp.createdDate,
            membership_no: newApp.membership_no,
            createdDate: dateTime,
            createdUser: {
                id: userId,
            },
            customers: [
                {
                    id: newApp.customerId.id,
                }
            ],

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
        fetchLoanApplicationData(LoanApplicationId);
        fetchLoanTypeData();
        fetchRentalTypeData();
        getCurrentUser();

    }, []);

    return (
        <AppTemplate>
            <div className="edit-loan-application">
                <form autoComplete="off" onSubmit={UpdateLoanApplication}>
                    <Paper>
                        <Grid container spacing={5}>
                            <Grid item xs={2}>
                                <TextField
                                    name="membership_no"
                                    value={newApp.membership_no}
                                    id="outlined-helperText"
                                    label="Membership No"
                                    variant="outlined"
                                    style={{ margin: 8 }}
                                    onChange={onChange}
                                    size="small"
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
                                    size="small"
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
                                    size="small"
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
                            <Grid item xs={2}>
                                <TextField
                                    name="loanStatus"
                                    value={newApp.loanStatus}
                                    id="outlined-helperText"
                                    label="Loan Status"
                                    variant="outlined"
                                    size="small"
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
                            <Grid item xs={2}>
                                <TextField
                                    name="branch"
                                    value={newApp.branch}
                                    id="outlined-helperText"
                                    label="Branch Code"
                                    variant="outlined"
                                    size="small"
                                    style={{ margin: 10 }}
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
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel shrink htmlFor="age-native-label-placeholder">
                                                    Loan Type
                                        </InputLabel>
                                                <Select
                                                    name="loanTypeId"
                                                    value={newApp.loanTypeId}
                                                    displayEmpty
                                                    className={classes.selectEmpty}

                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    onChange={onChange}
                                                >
                                                    <MenuItem value="" disabled>

                                                    </MenuItem>
                                                    {
                                                        loanTypeId.map((eachRow, index) => {
                                                            return (
                                                                <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.loanType}</MenuItem>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                name="effectiveRate"
                                                value={newApp.effectiveRate}
                                                id="outlined-helperText"
                                                label="Effective Rate"
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
                                                helperText={errors.paymentPeriod}
                                                error={errors.paymentPeriod ? 'error' : ''}
                                                variant="outlined"
                                                style={{ margin: 8 }}
                                                onChange={onChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel shrink htmlFor="age-native-label-placeholder">
                                                    Rental Type
                                        </InputLabel>
                                                <Select
                                                    name="rentalTypeId"
                                                    value={newApp.rentalTypeId}
                                                    displayEmpty
                                                    className={classes.selectEmpty}
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    onChange={onChange}
                                                >
                                                    <MenuItem value="" disabled>

                                                    </MenuItem>
                                                    {
                                                        rentalTypeId.map((eachRow, index) => {
                                                            return (
                                                                <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                name="noOfRentals"
                                                value={newApp.noOfRentals}
                                                id="outlined-helperText"
                                                label="No of Rentals"
                                                helperText={errors.noOfRentals}
                                                error={errors.noOfRentals ? 'error' : ''}
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
                                                helperText={errors.otherCharges}
                                                error={errors.otherCharges ? 'error' : ''}
                                                variant="outlined"
                                                style={{ margin: 8 }}
                                                onChange={onChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
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
                                endIcon={<SendIcon />}
                            >
                                Save
            </Button>
                            <ColorButton variant="contained" color="secondary" type="reset" startIcon={<RotateLeftIcon />} onClick={resetError}>
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
                </form>
            </div>
        </AppTemplate>
    )
}