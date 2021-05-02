import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Grid, TextField, InputLabel, Select, FormControl,
    FormHelperText, MenuItem, Box, TableRow, Tab, TableCell, ListItem, ListItemAvatar, Avatar, ListItemText,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';

import SendIcon from '@material-ui/icons/Send';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import LockIcon from '@material-ui/icons/Lock';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EmailIcon from '@material-ui/icons/Email';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PersonIcon from '@material-ui/icons/Person';

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
                    id: newUser.role,
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
        fetchUserRoles();
    }, []);

    return (
        <AppTemplate>
            <div className="new-system-user">
                <form autoComplete="off" onSubmit={SubmitNewUser}>
                    <Paper variant="outlined">
                        <Grid container spacing={2}>
                            <Grid item xs={5}>
                                <TableRow>
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AccountCircleIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Enter"} secondary="First Name" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            name="firstName"
                                            id="outlined-full-width"
                                            label="First Name"
                                            helperText={errors.firstName}
                                            error={errors.firstName ? 'error' : ''}
                                            className={classes.textFields}
                                            placeholder="Enter Name"
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
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AccountCircleIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Enter"} secondary="Middle Name" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            name="middleName"
                                            id="outlined-full-width"
                                            label="Middle Name"
                                            helperText={errors.middleName}
                                            error={errors.middleName ? 'error' : ''}
                                            className={classes.textFields}
                                            placeholder="Enter Name"
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
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AccountCircleIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Enter"} secondary="Last Name" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            name="lastName"
                                            id="outlined-full-width"
                                            label="Last Name"
                                            helperText={errors.lastName}
                                            error={errors.lastName ? 'error' : ''}
                                            className={classes.textFields}
                                            placeholder="Enter Name"
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
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <LocationOnIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Enter"} secondary="Address" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            name="address"
                                            id="outlined-full-width"
                                            label="Address"
                                            helperText={errors.address}
                                            error={errors.address ? 'error' : ''}
                                            className={classes.textFields}
                                            placeholder="Enter Address"
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
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PermIdentityIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Enter"} secondary="NIC" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            name="nic"
                                            id="outlined-full-width"
                                            label="NIC No"
                                            helperText={errors.nic}
                                            error={errors.nic ? 'error' : ''}
                                            className={classes.textFields}
                                            placeholder="Enter NIC"
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                            onChange={onChange}
                                        />
                                    </TableCell>
                                </TableRow>
                            </Grid>
                            <Grid item xs={5}>
                                <TableRow>
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <CalendarTodayIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Enter"} secondary="Date of Birth" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            name="dob"
                                            id="outlined-full-width"
                                            label="Date of Birth"
                                            helperText={errors.dob}
                                            error={errors.dob ? 'error' : ''}
                                            className={classes.textFields}
                                            placeholder="Enter Birthday"
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
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <EmailIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Enter"} secondary="Email Address" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            name="email"
                                            id="outlined-full-width"
                                            label="Email Address"
                                            helperText={errors.email}
                                            error={errors.email ? 'error' : ''}
                                            className={classes.textFields}
                                            placeholder="Enter Email"
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
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Enter"} secondary="User Name" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            name="username"
                                            id="outlined-full-width"
                                            label="User Name"
                                            helperText={errors.username}
                                            error={errors.username ? 'error' : ''}
                                            className={classes.textFields}
                                            placeholder="Enter User Name"
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
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <LockIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Enter"} secondary="Password" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            name="password"
                                            id="outlined-full-width"
                                            label="Password"
                                            helperText={errors.password}
                                            error={errors.password ? 'error' : ''}
                                            className={classes.textFields}
                                            placeholder="Enter Password"
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
                                    <TableCell align="left">
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <SupervisedUserCircleIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={"Set"} secondary="User Roles" />
                                        </ListItem>
                                    </TableCell>
                                    <TableCell align="left">
                                        <FormControl className={classes.formControl} variant="outlined" >
                                            <InputLabel id="demo-simple-select-filled-label">--Please Select--</InputLabel>
                                            <Select
                                                variant="outlined"
                                                name="role"
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                label="User roles"
                                                error={errors.roles ? 'error' : ''}
                                                onChange={onChange}
                                                className={classes.width}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            >
                                                <MenuItem value="" disabled>

                                                </MenuItem>
                                                {
                                                    roles.map((eachRow, index) => {
                                                        return (
                                                            <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.name}</MenuItem>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            </Grid>
                        </Grid>
                    </Paper>
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
        </AppTemplate >
    )
}