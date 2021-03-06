import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles, withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { green, purple } from '@material-ui/core/colors';

import {
    Button, Paper, Grid, InputLabel, Select, FormControl, TextField,
    FormHelperText, MenuItem, Card, Typography
} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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
        margin: theme.spacing(1),
        width: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    margin: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 1000,
    },
    width: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 700,
    },
    spacing: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    Typography: {
        marginLeft: theme.spacing(2),
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

const BootstrapButton = withStyles({
    root: {
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#0063cc',
        borderColor: '#0063cc',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
    },
})(Button);

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

export default function NewLoanResponse(props) {

    const history = useHistory();

    const loanApplicationId = props.match.params.id

    const classes = useStyles();
    const [loanStatus, setLoanStatus] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());
    const [userId, setUserID] = useState([]);

    const [loanApplication, ViewLoanApplication] = useState([]);
    const [membershipNo, ViewMembershipNo] = useState([]);
    const [loanType, ViewLoanType] = useState([]);
    const [status, ViewLoanStatus] = useState([]);
    const [user, ViewUser] = useState([]);
    const [userRole, ViewUserRole] = useState([]);
    const [rentalType, ViewRentalType] = useState([]);
    const [branch, ViewBranch] = useState([]);

    const fetchLoanApplicationData = async (loanApplicationId) => {
        axios.get(`${baseUrl}/loanapplication/list/` + loanApplicationId)
            .then(response => {
                console.log('response', response);
                ViewLoanApplication(response.data);
                ViewMembershipNo(response.data.customers[0]);
                ViewLoanType(response.data.loanTypeId);
                ViewLoanStatus(response.data.loanStatus);
                ViewBranch(response.data.branch);
                ViewRentalType(response.data.rentalTypeId);
                ViewUser(response.data.createdUser);
                ViewUserRole(response.data.createdUser.roles[0]);
            })
    };

    //Setup initial State
    const initResponse = {
        acceptedAmount: null,
        description: null,
        loanStatus: null,
    }
    const onChange = (e) => {
        //  e.persist();
        setNewResponse({ ...newResponse, [e.target.name]: e.target.value });
    }

    //Get Common Status
    const fetchLoanStatus = async () => {
        axios.get(`${baseUrl}/loanstatus/list`)
            .then(response => {
                console.log('status', response);
                setLoanStatus(response.data);
            })
    };

    //Get Logged in user id
    const getCurrentUser = async () => {
        //console.log(SystemUser.get())
        setUserID(SystemUser.get().id);
    };

    const [newResponse, setNewResponse] = useState(initResponse);
    const resetData = () => {
        setNewResponse(initResponse)
    }

    //Error Handling
    const initErrors = {
        acceptedAmount: '',
        loanStatus: '',
        description: '',
    }

    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }

    const SubmitNewLoanResponse = (e) => {
        e.preventDefault();
        const data = {
            id:loanApplicationId,
            description: newResponse.description,
            loanStatus: {
                id: newResponse.loanStatus,
            },
            acceptedAmount: newResponse.acceptedAmount,
            loanApplications: [
                {
                    id: loanApplicationId,
                }
            ],
            createdDate: dateTime,
            createdUser: {
                id: userId,
            },
        };

        console.log('data-set', data);
        axios.post(`${baseUrl}/loanapplicationresponse/add`, data)
            .then(function (response) {
                //console.log(response)
                utils.showSuccess("New Response Saved Successfully.");
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
        getCurrentUser();
        fetchLoanApplicationData(loanApplicationId);
    }, []);

    return (
        <AppTemplate>
            <div className="new-approve">
                <br />
                <Paper variant="outlined">
                <Typography variant="H2" component="H2" className={classes.Typography}>
                        LOAN APPLICATION DETAILS
                            </Typography>
                    <br />
                    <Grid container spacing={5} className={classes.spacing}>
                        <Grid item xs={2}>
                            <TextField
                                name="applicationNo"
                                value={loanApplication.applicationNo}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Application No"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="calculationNo"
                                value={loanApplication.calculationNo}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Calculation No"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="loanStatus"
                                value={status.type}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Loan Status"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="loanAmount"
                                value={loanApplication.loanAmount}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Loan Amount"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="effectiveRate"
                                value={loanApplication.effectiveRate}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Effective Rate"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} className={classes.spacing}>
                        <Grid item xs={2}>
                            <TextField
                                name="loanType"
                                value={loanType.loanType}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Loan Type"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="rentalType"
                                value={rentalType.type}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Rental Type"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="noOfRentals"
                                value={loanApplication.noOfRentals}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="No of Rentals"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="paymentPeriod"
                                value={loanApplication.paymentPeriod}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Payment Period"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} className={classes.spacing}>
                            <Link to={"/loan-application-customer-data/" + loanApplicationId}>
                            <BootstrapButton variant="contained" color="primary" disableRipple className={classes.spacing}>
                                See Customers
                            </BootstrapButton>
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>
                <br />
                
                <form autoComplete="off" onSubmit={SubmitNewLoanResponse}>
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Paper variant="outlined" >
                                <Card width="500">
                                    <Card width="500">
                                        <TextField
                                            name="acceptedAmount"
                                            id="outlined-helperText"
                                            label="Accepted Amount"
                                            placeholder="Enter Amount"
                                            variant="outlined"
                                            helperText={errors.acceptedAmount}
                                            error={errors.acceptedAmount ? 'error' : ''}
                                            style={{ margin: 8 }}
                                            size="small"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={onChange}
                                        />
                                        <br />
                                        <TextField
                                            name="description"
                                            id="outlined-multiline-static"
                                            label="Description"
                                            placeholder="Enter Description"
                                            helperText={errors.description}
                                            error={errors.description ? 'error' : ''}
                                            multiline
                                            rows={4}
                                            className={classes.width}
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={onChange}
                                        />
                                    </Card>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink >
                                            Status
                                     </InputLabel>
                                        <FormHelperText>{errors.loanStatus}</FormHelperText>
                                        <Select
                                            name="loanStatus"
                                            variant="outlined"
                                            displayEmpty
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            error={errors.loanStatus ? 'error' : ''}
                                            onChange={onChange}
                                        >
                                            <MenuItem value="" disabled>

                                            </MenuItem>
                                            {
                                                loanStatus.map((eachRow, index) => {
                                                    return (
                                                        <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Card>
                            </Paper>
                            <br />
                            <Paper variant="outlined" className={classes.width}  >
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
                        </Grid>
                    </Grid>
                </form>
            </div>
        </AppTemplate>
    )
}