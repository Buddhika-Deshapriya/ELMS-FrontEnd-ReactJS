import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {
    Button, Paper, Grid, TextField, InputLabel, Select, FormControl,
    FormHelperText, MenuItem
} from '@material-ui/core';

import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SendIcon from '@material-ui/icons/Send';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import SystemUser from "../../helper/user";

const { baseUrl } = appConfig;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '23ch',
        },

    },
    button: {
        margin: theme.spacing(1, 1, 1, 1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 190,
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

export default function NewCustomer(props) {

    const history = useHistory();

    const classes = useStyles();
    const [state, setState] = React.useState({

    });
    const [title, setTitles] = useState([]);
    const [gender, setGenders] = useState([]);
    const [marriedStatus, setMarriedStatus] = useState([]);
    const [membershipType, setMembershipType] = useState([]);
    const [familyType, setFamilyType] = useState([]);
    const [status, setStatus] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());
    const [userId, setUserID] = useState([]);
    const [genMemNo, setGenMemNo] = useState([]);

    //Setup initial State
    const initCustomer = {
        membership_no: null,
        first_name: null,
        middle_name: null,
        last_name: null,
        dob: null,
        nic: null,
        address: null,
        telephone: null,
        mobile: null,
        email: null,
        familyIncome: null,
        total_members: null,
        income: null,
        passport: null,
        membershipType: null,
        familyType: null,
        customerStatus: null,
        title: null,
        gender: null,
        marriedStatus: null

    }

    const [newCustomer, setNewCustomer] = useState(initCustomer);
    const resetData = () => {
        setNewCustomer(initCustomer)
    }


    const onChange = (e) => {
        e.persist();
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };

    //Get Common Status
    const fetchCustomerStatus = async () => {
        axios.get(`${baseUrl}/commonstatus/list`)
            .then(response => {
                // console.log('response', response);
                setStatus(response.data);
            })
    };

    //Get Logged in user id
    const getCurrentUser = async () => {
        //console.log(SystemUser.get())
        setUserID(SystemUser.get().id);
    };

    //Get customer Title
    const fetchCustomerTitle = async () => {
        axios.get(`${baseUrl}/title/list/`)
            .then(response => {
                // console.log('response', response);
                setTitles(response.data);
            })
    };

    //Get customer Gender
    const fetchCustomerGender = async () => {
        axios.get(`${baseUrl}/gender/list/`)
            .then(response => {
                // console.log('response', response);
                setGenders(response.data);
            })
    };

    //Get marial status
    const fetchCustomerMarriedStatus = async () => {
        axios.get(`${baseUrl}/marriedstatus/list/`)
            .then(response => {
                // console.log('response', response);
                setMarriedStatus(response.data);
            })
    };

    //Get membership type
    const fetchCustomerMembershipType = async () => {
        axios.get(`${baseUrl}/membershiptype/list/`)
            .then(response => {
                // console.log('response', response);
                setMembershipType(response.data);
            })
    };

    //Get family type
    const fetchCustomerFamilyType = async () => {
        axios.get(`${baseUrl}/familytype/list/`)
            .then(response => {
                // console.log('response', response);
                setFamilyType(response.data);
            })
    };

    //Get Customer Membership generated No
    const fetchCustomerGenMembershipNo = async () => {
        axios.get(`${baseUrl}/customergenmembershipno/takememno`)
            .then(response => {
                console.log('Generated No', response);
                setGenMemNo(response.data[0]);
            })
    }

    //Error Handling
    const initErrors = {
        membership_no: '',
        first_name: '',
        middle_name: '',
        dob: '',
        nic: '',
        address: '',
        telephone: '',
        mobile: '',
        email: '',
        familyIncome: '',
        familyType: '',
        total_members: '',
        income: '',
        passport: '',
        membershipType: '',
        title: '',
        gender: '',
        marriedStatus: '',
        customerStatus: ''
    }
    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }

    const SubmitNewCustomer = (e) => {
        e.preventDefault();
        const data = {
            title: {
                id: newCustomer.title,
            },
            gender: {
                id: newCustomer.gender,
            },
            marriedStatus: {
                id: newCustomer.marriedStatus,
            },
            membershipType: {
                id: newCustomer.membershipType,
            },
            familyType: {
                id: newCustomer.familyType,
            },

            membership_no: genMemNo.membership_no,
            nic: newCustomer.nic,
            first_name: newCustomer.first_name,
            middle_name: newCustomer.middle_name,
            last_name: newCustomer.last_name,
            dob: newCustomer.dob,
            email: newCustomer.email,
            address: newCustomer.address,
            telephone: newCustomer.telephone,
            mobile: newCustomer.mobile,
            passport: newCustomer.passport,
            income: newCustomer.income,
            familyIncome: newCustomer.familyIncome,
            total_members: newCustomer.total_members,

            customerStatus: {
                id: newCustomer.status,
            },
            createdDate: dateTime,
            createdUser: {
                id: userId,
            },
        };
        console.log('data', data);
        axios.post(`${baseUrl}/customer/add`, data)
            .then(function (response) {
                //console.log(response)
                utils.showSuccess("New Customer Saved Successfully.");
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
        fetchCustomerTitle();
        fetchCustomerGender();
        fetchCustomerMarriedStatus();
        fetchCustomerMembershipType();
        fetchCustomerFamilyType();
        fetchCustomerStatus();
        fetchCustomerGenMembershipNo();
        getCurrentUser();
    }, []);

    return (
        <AppTemplate>
            <div className="new-customer">
                <form className={classes.root} noValidate autoComplete="off" onSubmit={SubmitNewCustomer}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Paper variant="outlined" >
                                <TextField
                                    id="outlined-helperText"
                                    label="Membership No"
                                    name="membership_no"
                                    variant="outlined"
                                    value={genMemNo.mem}
                                    helperText={errors.membership_no}
                                    error={errors.membership_no ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    id="outlined-helperText"
                                    name="nic"
                                    label="NIC Number"
                                    variant="outlined"
                                    helperText={errors.nic}
                                    placeholder="Enter NIC Number"
                                    error={errors.nic ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                    <br />
                    <Paper variant="outlined" >
                        <div>
                            <FormControl className={classes.formControl} variant="outlined" >
                                <InputLabel id="demo-simple-select-filled-label">
                                    Title
                                </InputLabel>
                                <Select
                                    variant="outlined"
                                    name="title"
                                    //value={newLoan.status}
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    label="Title"
                                    error={errors.title ? 'error' : ''}
                                    onChange={onChange}
                                >
                                    <MenuItem value="" disabled>

                                    </MenuItem>
                                    {
                                        title.map((eachRow, index) => {
                                            return (
                                                <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl} variant="outlined" >
                                <InputLabel id="demo-simple-select-filled-label">Gender</InputLabel>

                                <Select
                                    variant="outlined"
                                    name="gender"
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    label="Gender"
                                    error={errors.gender ? 'error' : ''}
                                    onChange={onChange}
                                >
                                    <MenuItem value="" disabled>

                                    </MenuItem>
                                    {
                                        gender.map((eachRow, index) => {
                                            return (
                                                <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl} variant="outlined" >
                                <InputLabel id="demo-simple-select-filled-label">Married Status</InputLabel>

                                <Select
                                    variant="outlined"
                                    name="marriedStatus"
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    label="Married Status"
                                    error={errors.marriedStatus ? 'error' : ''}
                                    onChange={onChange}
                                >
                                    <MenuItem value="" disabled>

                                    </MenuItem>
                                    {
                                        marriedStatus.map((eachRow, index) => {
                                            return (
                                                <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl} variant="outlined" >
                                <InputLabel id="demo-simple-select-filled-label">Membership Type</InputLabel>

                                <Select
                                    variant="outlined"
                                    name="membershipType"
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    label="Membership Type"
                                    error={errors.membershipType ? 'error' : ''}
                                    onChange={onChange}

                                >
                                    <MenuItem value="" disabled>

                                    </MenuItem>
                                    {
                                        membershipType.map((eachRow, index) => {
                                            return (
                                                <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl} variant="outlined" >
                                <InputLabel id="demo-simple-select-filled-label">Family Type</InputLabel>

                                <Select
                                    variant="outlined"
                                    name="familyType"
                                    displayEmpty
                                    className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    label="Family Type"
                                    error={errors.familyType ? 'error' : ''}
                                    onChange={onChange}
                                >
                                    <MenuItem value="" disabled>

                                    </MenuItem>
                                    {
                                        familyType.map((eachRow, index) => {
                                            return (
                                                <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </Paper>
                    <br />
                    <Grid container spacing={1}>
                        <Grid item xs={7}>
                            <Paper variant="outlined" >
                                <TextField
                                    name="first_name"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="First Name"
                                    placeholder="Enter First Name"
                                    variant="outlined"
                                    helperText={errors.first_name}
                                    error={errors.first_name ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="middle_name"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Middle Name"
                                    placeholder="Enter Middle Name"
                                    variant="outlined"
                                    helperText={errors.middle_name}
                                    error={errors.middle_name ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="last_name"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Last Name"
                                    placeholder="Enter Last Name"
                                    variant="outlined"
                                    helperText="*Not Required"
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="dob"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Date of Birth"
                                    placeholder="Enter Birthday"
                                    variant="outlined"
                                    helperText={errors.dob}
                                    error={errors.dob ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="email"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Email Address"
                                    placeholder="Enter Email"
                                    variant="outlined"
                                    helperText="*Not Required"
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="address"
                                    //value={newLoan.description}
                                    id="outlined-multiline-static"
                                    label="Address"
                                    placeholder="Enter Address"
                                    helperText={errors.address}
                                    error={errors.address ? 'error' : ''}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />

                            </Paper>
                        </Grid>
                        <Grid item xs={5}>
                            <Paper variant="outlined" >
                                <TextField
                                    name="telephone"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Telephone No"
                                    placeholder="Enter Telephone No"
                                    variant="outlined"
                                    helperText={errors.telephone}
                                    error={errors.telephone ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="mobile"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Mobile No"
                                    placeholder="Enter Mobile No"
                                    variant="outlined"
                                    helperText={errors.mobile}
                                    error={errors.mobile ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />

                                <TextField
                                    name="passport"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Passport No"
                                    placeholder="Enter Passport No"
                                    variant="outlined"
                                    helperText="*Not Required"
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />


                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Paper variant="outlined" >
                                <TextField
                                    name="income"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Applicant Income"
                                    placeholder="Enter Income"
                                    variant="outlined"
                                    helperText={errors.income}
                                    error={errors.income ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="familyIncome"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Family Income"
                                    placeholder="Enter Family Income"
                                    variant="outlined"
                                    helperText={errors.familyIncome}
                                    error={errors.familyIncome ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="total_members"
                                    //value={newLoan.maxAmount}
                                    id="outlined-helperText"
                                    label="Total Members"
                                    placeholder="Enter Total Members"
                                    variant="outlined"
                                    helperText={errors.total_members}
                                    error={errors.total_members ? 'error' : ''}
                                    style={{ margin: 8 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                                        Customer Status
                                    </InputLabel>
                                    <Select
                                        variant="outlined"
                                        name="status"
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        error={errors.status ? 'error' : ''}
                                        onChange={onChange}
                                    >
                                        <MenuItem value="" disabled>

                                        </MenuItem>
                                        {
                                            status.map((eachRow, index) => {
                                                return (
                                                    <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                );
                                            })
                                        }
                                    </Select>
                                    <FormHelperText>*Required</FormHelperText>
                                </FormControl>

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
                </form>
            </div>
        </AppTemplate>
    )
}