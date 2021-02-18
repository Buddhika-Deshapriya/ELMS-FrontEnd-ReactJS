import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Grid, TextField, InputLabel, Select, FormControl, MenuItem,

} from '@material-ui/core';

import UpdateIcon from '@material-ui/icons/Update';
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
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        width: 175
    },
    margin: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 190
    },
    grid: {
        marginLeft: theme.spacing(1),
    },
    width: {
        width:615
    }

}));

export default function EditLoanType(props) {


    const classes = useStyles();
    const [customerStatus, setStatus] = useState([]);
    const [title, setTitles] = useState([]);
    const [gender, setGenders] = useState([]);
    const [marriedStatus, setMarriedStatus] = useState([]);
    const [membershipType, setMembershipType] = useState([]);
    const [familyType, setFamilyType] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());
    const [userId, setUserID] = useState([]);

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

    const CustomerId = props.match.params.id


    const onChange = (e) => {
        e.persist();
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    }


    //Get Common Status
    const fetchCustomerStatus = async () => {
        axios.get(`${baseUrl}/commonstatus/list`)
            .then(response => {
                console.log('response', response);
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
                console.log('response', response);
                setTitles(response.data);
            })
    };

    //Get customer Gender
    const fetchCustomerGender = async () => {
        axios.get(`${baseUrl}/gender/list/`)
            .then(response => {
                console.log('response', response);
                setGenders(response.data);
            })
    };

    //Get marial status
    const fetchCustomerMarriedStatus = async () => {
        axios.get(`${baseUrl}/marriedstatus/list/`)
            .then(response => {
                console.log('response', response);
                setMarriedStatus(response.data);
            })
    };

    //Get membership type
    const fetchCustomerMembershipType = async () => {
        axios.get(`${baseUrl}/membershiptype/list/`)
            .then(response => {
                console.log('response', response);
                setMembershipType(response.data);
            })
    };

    //Get family type
    const fetchCustomerFamilyType = async () => {
        axios.get(`${baseUrl}/familytype/list/`)
            .then(response => {
                console.log('response', response);
                setFamilyType(response.data);
            })
    };

    //Get Loan Type details by ID
    const fetchCustomerData = async (CustomerId) => {
        axios.get(`${baseUrl}/customer/list/` + CustomerId)
            .then(response => {
                console.log('response', response);
                setNewCustomer({
                    ...newCustomer,
                    ...response.data,
                    customerStatus: response.data.customerStatus.id,
                    userid: response.data.createdUser.id,
                    familyType: response.data.familyType.id,
                    marriedStatus: response.data.marriedStatus.id,
                    membershipType: response.data.membershipType.id,
                    title: response.data.title.id,
                    gender: response.data.gender.id
                })
            })
    };




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



    const UpdateCustomer = (e) => {
        e.preventDefault();
        const data = {
            id: newCustomer.id,
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

            membership_no: newCustomer.membership_no,
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
                id: newCustomer.customerStatus,
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
                utils.showSuccess("Customer Updated Successfully.");
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
        fetchCustomerData(CustomerId);
        fetchCustomerTitle();
        fetchCustomerGender();
        fetchCustomerMarriedStatus();
        fetchCustomerMembershipType();
        fetchCustomerFamilyType();
        fetchCustomerStatus();
        getCurrentUser();
    }, []);

    return (
        <AppTemplate>
            <div className="edit-customer">
                <form autoComplete="off" onSubmit={UpdateCustomer}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Paper variant="outlined">
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                                        Title
                                    </InputLabel>
                                    <Select
                                        name="title"
                                        value={newCustomer.title}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        onChange={onChange}
                                        readOnly="readonly"
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
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                                        Gender
                                    </InputLabel>
                                    <Select
                                        name="gender"
                                        value={newCustomer.gender}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        onChange={onChange}
                                        readOnly="readonly"
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
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                                        Membership Type
                                    </InputLabel>
                                    <Select
                                        name="membershipType"
                                        value={newCustomer.membershipType}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        onChange={onChange}
                                        readOnly="readonly"
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
                            </Paper>
                            <br />
                            <Paper variant="outlined">
                                <TextField
                                    name="address"
                                    value={newCustomer.address}
                                    id="outlined-multiline-static"
                                    label="Address"
                                    placeholder="Enter Address"
                                    helperText={errors.address}
                                    error={errors.address ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="telephone"
                                    value={newCustomer.telephone}
                                    id="outlined-multiline-static"
                                    label="Telephone No"
                                    placeholder="Enter Telephone"
                                    helperText={errors.telephone}
                                    error={errors.telephone ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="mobile"
                                    value={newCustomer.mobile}
                                    id="outlined-multiline-static"
                                    label="Enter Mobile"
                                    placeholder="Enter Mobile"
                                    helperText={errors.mobile}
                                    error={errors.mobile ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="email"
                                    value={newCustomer.email}
                                    id="outlined-multiline-static"
                                    label="Email Address"
                                    placeholder="Enter Email"
                                    helperText={errors.email}
                                    error={errors.email ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="income"
                                    value={newCustomer.income}
                                    id="outlined-multiline-static"
                                    label="Applicant Income"
                                    placeholder="Enter Income"
                                    helperText={errors.income}
                                    error={errors.income ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="familyIncome"
                                    value={newCustomer.familyIncome}
                                    id="outlined-multiline-static"
                                    label="Family Income"
                                    placeholder="Enter Family Income"
                                    helperText={errors.familyIncome}
                                    error={errors.familyIncome ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <TextField
                                    name="total_members"
                                    value={newCustomer.total_members}
                                    id="outlined-multiline-static"
                                    label="Total Members"
                                    placeholder="Enter Total Members"
                                    helperText={errors.total_members}
                                    error={errors.total_members ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                />
                                <br />
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                                        Married Status
                                    </InputLabel>
                                    <Select
                                        name="marriedStatus"
                                        value={newCustomer.marriedStatus}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'Without label' }}
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
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                                        Family Type
                                    </InputLabel>
                                    <Select
                                        name="familyType"
                                        value={newCustomer.familyType}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'Without label' }}
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
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                                        Customer Status
                                    </InputLabel>
                                    <Select
                                        name="customerStatus"
                                        value={newCustomer.customerStatus}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        onChange={onChange}
                                    >
                                        <MenuItem value="" disabled>

                                        </MenuItem>
                                        {
                                            customerStatus.map((eachRow, index) => {
                                                return (
                                                    <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper variant="outlined">
                                <TextField
                                    name="first_name"
                                    value={newCustomer.first_name}
                                    id="outlined-multiline-static"
                                    label="First Name"
                                    helperText={errors.first_name}
                                    error={errors.first_name ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    name="middle_name"
                                    value={newCustomer.middle_name}
                                    id="outlined-multiline-static"
                                    label="Middle Name"
                                    helperText={errors.middle_name}
                                    error={errors.middle_name ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    name="last_name"
                                    value={newCustomer.last_name}
                                    id="outlined-multiline-static"
                                    label="Last Name"
                                    helperText={errors.last_name}
                                    error={errors.last_name ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    name="membership_no"
                                    value={newCustomer.membership_no}
                                    id="outlined-multiline-static"
                                    label="Membership No"
                                    helperText={errors.membership_no}
                                    error={errors.membership_no ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    name="nic"
                                    value={newCustomer.nic}
                                    id="outlined-multiline-static"
                                    label="NIC no"
                                    helperText={errors.nic}
                                    error={errors.nic ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    name="passport"
                                    value={newCustomer.passport}
                                    id="outlined-multiline-static"
                                    label="Passport"
                                    helperText={errors.passport}
                                    error={errors.passport ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    name="dob"
                                    value={newCustomer.dob}
                                    id="outlined-multiline-static"
                                    label="Date of Birth"
                                    placeholder="Enter Description"
                                    helperText={errors.dob}
                                    error={errors.dob ? 'error' : ''}
                                    variant="outlined"
                                    className={classes.margin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={onChange}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid>
                        <br />
                        <Paper variant="outlined" className={classes.width}>
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
                                type="reset"
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<RotateLeftIcon />}
                                onClick={resetError}
                            >
                                Reset
                        </Button>
                        </Paper>
                    </Grid>
                </form>
            </div>
        </AppTemplate>
    )
}