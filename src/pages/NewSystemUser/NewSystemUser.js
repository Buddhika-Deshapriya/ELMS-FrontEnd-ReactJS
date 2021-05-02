import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Grid, TextField, InputLabel, Select, FormControl,
    FormHelperText, MenuItem, Box,
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
        width: 300,
        margin: theme.spacing(1, 1, 1, 1),
    },
    selectEmpty: {
        margin: theme.spacing(1, 1, 1, 1),
    },
    margin: {
        marginTop: theme.spacing(2),
    },
    textFields: {
        width: 300,
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

export default function NewSystemUser(props) {

    const history = useHistory();

    const classes = useStyles();
    const [dateTime, setDateTime] = useState(new Date());
    const [userId, setUserID] = useState([]);
    const [roles, setUserRoles] = useState([]);

    //Setup initial State
    const initUser = {
        firstName: null,
        middleName: null,
        lastName: null,
        address: null,
        mobile: null,
        nic: null,
        dob: null,
        email: null,
        username: null,
        password: null,
        roles: null,
    }
    const onChange = (e) => {
        e.persist();
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    }

    const fetchUserRoles = async () => {
        axios.get(`${baseUrl}/userroles/list`)
            .then(response => {
                console.log('roles', response);
                setUserRoles(response.data);
            })
    };


    //Get Logged in user id
    const getCurrentUser = async () => {
        //console.log(SystemUser.get())
        setUserID(SystemUser.get().id);
    };

    const [newUser, setNewUser] = useState(initUser);
    const resetData = () => {
        setNewUser(initUser)
    }


    //Error Handling
    const initErrors = {
        firstName: '',
        middleName: '',
        lastName: '',
        address: '',
        mobile: '',
        nic: '',
        dob: '',
        email: '',
        username: '',
        password: '',
        roles: '',
    }
    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }



    const SubmitNewUser = (e) => {
        e.preventDefault();
        const data = {
            firstName: newUser.firstName,
            middleName: newUser.middleName,
            lastName: newUser.lastName,
            address: newUser.address,
            mobile: newUser.mobile,
            nic: newUser.nic,
            dob: newUser.dob,
            email: newUser.email,
            username: newUser.username,
            password: newUser.password,
            roles: [
                {
                  id: newUser.role1,
                },
                {
                  id: newUser.role2,
                }
              ],
            createdDate: dateTime,
            createdUser: {
                id: userId,
            },

        };
        console.log('data', data);
        axios.post(`${baseUrl}/user/add`, data)
            .then(function (response) {
                console.log(response)
                utils.showSuccess("New User Saved Successfully.");
            })
            .catch(_errors => {
                if (_errors.response) {
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
        getCurrentUser();
    }, []);

    return (
        <AppTemplate>
            <div className="new-system-user">
                <form autoComplete="off" onSubmit={SubmitNewUser}>
                    
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