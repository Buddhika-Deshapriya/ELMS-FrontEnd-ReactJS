import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles, withStyles, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {
    Button, TableCell, TableRow, TableBody, TableHead, TableContainer, Table, Paper, Grid, TextField, InputLabel, Select, FormControl,
    MenuItem, FormHelperText,
    Typography,
} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import SystemUser from "../../helper/user";
const { baseUrl } = appConfig;

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.background,
        border: 0,
        fontSize: 16,
        borderRadius: 3,
        boxShadow: theme.boxShadow,
        color: 'black',
        height: 48,
        padding: '0 30px',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    button: {
        margin: theme.spacing(1, 1, 1, 1),
    },
    formControl: {
        margin: theme.spacing(1, 1, 1, 1),
        width: 185,
    },
    selectEmpty: {
        margin: theme.spacing(1, 1, 1, 1),
        width: 180,
    },
    typography: {
        margin: theme.spacing(1, 1, 1, 1),
    },
    textFields: {
        margin: theme.spacing(1, 1, 1, 1),
        width: 235,
    },
    descriptions: {
        margin: theme.spacing(1, 1, 1, 1),
        width: 485,
    },
    table: {
        width: 1200,
    },
    width: {
        width: 235
    },
    paper: {
        width: 1300
    }
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
export default function Payment(props) {

    const history = useHistory();

    const classes = useStyles();
    const [dateTime, setDateTime] = useState(new Date());
    const [userId, setUserID] = useState([]);
    const [transactionType, setTransactionType] = useState([]);
    const [accountType, setAccountType] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [genVoucher, setGenVoucherNo] = useState([]);

    //Setup initial State
    const initPayment = {
        voucherNo: null,
        description: null,
        amount: null,
        membershipNo: null,
        paymentMethod: null,
        transactionType: null,
        accountType: null,
    }
    const onChange = (e) => {
        e.persist();
        setNewPayment({ ...NewPayment, [e.target.name]: e.target.value });
    }

    //Get Account Type details
    const fetchAccountTypeData = async () => {
        axios.get(`${baseUrl}/accounttype/list`)
            .then(response => {
                console.log('Account Types', response);
                setAccountType(response.data);
            })
    }
    //Get Payment Method details
    const fetchPaymentMethodData = async () => {
        axios.get(`${baseUrl}/paymentmethod/list`)
            .then(response => {
                console.log('Payment methods', response);
                setPaymentMethod(response.data);
            })
    }
    //Get payment voucher generated id
    const fetchPaymentVoucherGenId = async () => {
        axios.get(`${baseUrl}/paymentvoucherid/takeid`)
            .then(response => {
                console.log('Generated No', response);
                setGenVoucherNo(response.data);
            })
    }
    //Get Transaction type details
    const fetchTransactionTypeData = async () => {
        axios.get(`${baseUrl}/transactiontype/list`)
            .then(response => {
                console.log('response', response);
                setTransactionType(response.data);
            })
    }

    //Get Logged in user id
    const getCurrentUser = async () => {
        //console.log(SystemUser.get())
        setUserID(SystemUser.get().id);
    };

    const [NewPayment, setNewPayment] = useState(initPayment);
    const resetData = () => {
        setNewPayment(initPayment)
    }

    //Error Handling
    const initErrors = {
        voucherNo: '',
        description: '',
        amount: '',
        paymentMethod: '',
        transactionType: '',
        accountType: '',
    }
    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }

    const SubmitNewPayment = (e) => {
        e.preventDefault();
        const data = {
            voucherNo: genVoucher.voucherNo,
            description: NewPayment.description,
            amount: NewPayment.amount,
            membershipNo: NewPayment.membershipNo,
            paymentMethod: {
                id: NewPayment.paymentMethod,
            },
            transactionType: {
                id: NewPayment.transactionType,
            },
            accountType: {
                id: NewPayment.accountType,
            },
            createdDate: dateTime,
            createdUser: {
                id: userId,
            },
            //   customers: [
            //     {
            //       id: custId2,
            //     },
            //   ],
        };
        console.log('data', data);
        axios.post(`${baseUrl}/payments/add`, data)
            .then(function (response) {
                //console.log(response)
                utils.showSuccess("Transaction Successfully.");
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
        fetchAccountTypeData();
        fetchPaymentMethodData();
        fetchTransactionTypeData();
        getCurrentUser();
        fetchPaymentVoucherGenId();
    }, []);

    return (
        <AppTemplate>
            <div className="new-payment">
                <form autoComplete="off" onSubmit={SubmitNewPayment}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.root} >
                            <h2>
                                <b>Transactions</b>
                            </h2>
                        </Typography>
                    </Paper>
                    <TableContainer component={Paper} className={classes.paper}>
                        <div className={classes.typography}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <Grid container spacing={2} className={classes.paper}>
                                    <Grid item xs={5}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="left">Voucher No:</TableCell>
                                                <TableCell align="left">
                                                    <TextField
                                                        name="voucherNo"
                                                        id="outlined-full-width"
                                                        label="Voucher No"
                                                        value={genVoucher.voucherNo}
                                                        helperText={errors.voucherNo}
                                                        size="small"
                                                        error={errors.voucherNo ? 'error' : ''}
                                                        className={classes.textFields}
                                                        margin="normal"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        variant="outlined"
                                                        onChange={onChange}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">Amount:</TableCell>
                                                <TableCell align="left">
                                                    <TextField
                                                        name="amount"
                                                        id="outlined-full-width"
                                                        label="Amount"
                                                        helperText={errors.amount}
                                                        size="small"
                                                        error={errors.amount ? 'error' : ''}
                                                        className={classes.textFields}
                                                        margin="normal"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        onChange={onChange}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">Transaction Type:</TableCell>
                                                <TableCell align="left">
                                                    <FormControl className={classes.formControl} variant="outlined" >
                                                        <InputLabel id="demo-simple-select-filled-label">--Please Select--</InputLabel>

                                                        <Select
                                                            variant="outlined"
                                                            name="transactionType"
                                                            displayEmpty
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            label="Transaction Type"
                                                            error={errors.transactionType ? 'error' : ''}
                                                            onChange={onChange}
                                                            className={classes.width}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled>

                                                            </MenuItem>
                                                            {
                                                                transactionType.map((eachRow, index) => {
                                                                    return (
                                                                        <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                                    );
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                            <TableCell align="left">Description:</TableCell>
                                            <TableCell align="left">
                                                <TextField
                                                    name="description"
                                                    id="outlined-full-width"
                                                    label="Description"
                                                    helperText={errors.description}
                                                    size="small"
                                                    multiline
                                                    rows={4}
                                                    error={errors.description ? 'error' : ''}
                                                    className={classes.textFields}
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    onChange={onChange}
                                                />
                                            </TableCell>
                                        </TableBody>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="left">Membership No:</TableCell>
                                                <TableCell align="left">
                                                    <TextField
                                                        name="membershipNo"
                                                        id="outlined-full-width"
                                                        label="Membership No"
                                                        helperText={errors.membershipNo}
                                                        size="small"
                                                        error={errors.membershipNo ? 'error' : ''}
                                                        className={classes.textFields}
                                                        margin="normal"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        onChange={onChange}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">Account Type:</TableCell>
                                                <TableCell align="left">
                                                    <FormControl className={classes.formControl} variant="outlined" >
                                                        <InputLabel id="demo-simple-select-filled-label">--Please Select--</InputLabel>

                                                        <Select
                                                            variant="outlined"
                                                            name="accountType"
                                                            displayEmpty
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            label="Account Type"
                                                            error={errors.accountType ? 'error' : ''}
                                                            onChange={onChange}
                                                            className={classes.width}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled>

                                                            </MenuItem>
                                                            {
                                                                accountType.map((eachRow, index) => {
                                                                    return (
                                                                        <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                                    );
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">Payment Method:</TableCell>
                                                <TableCell align="left">
                                                    <FormControl className={classes.formControl} variant="outlined" >
                                                        <InputLabel id="demo-simple-select-filled-label">--Please Select--</InputLabel>

                                                        <Select
                                                            variant="outlined"
                                                            name="paymentMethod"
                                                            displayEmpty
                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                            label="Account Type"
                                                            error={errors.paymentMethod ? 'error' : ''}
                                                            onChange={onChange}
                                                            className={classes.width}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled>

                                                            </MenuItem>
                                                            {
                                                                paymentMethod.map((eachRow, index) => {
                                                                    return (
                                                                        <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.method}</MenuItem>
                                                                    );
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Grid>
                                </Grid>
                            </Table>
                        </div>
                    </TableContainer>
                    <br />
                    <Paper className={classes.paper}>
                        <div>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                endIcon={<SendIcon />}
                            >
                                Save Transaction
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