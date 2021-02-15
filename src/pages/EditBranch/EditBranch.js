import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Grid, TextField, InputLabel, Select, FormControl,
    FormHelperText, MenuItem, Box,

} from '@material-ui/core';

import UpdateIcon from '@material-ui/icons/Update';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

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

export default function EditBranch(props) {


    const classes = useStyles();
    const [branchStatus, setStatus] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());
    const [userId, setUserID] = useState([]);

    //Setup initial State
    const initBranch = {
        branchName: null,
        branchAddress: null,
        branchCode: null,
        branchStatus: null
    }
    const [newBranch, setNewBranch] = useState(initBranch);
    const resetData = () => {
        setNewBranch(initBranch)
    }

    const branchId = props.match.params.id

    const onChange = (e) => {
        e.persist();
        setNewBranch({ ...newBranch, [e.target.name]: e.target.value });
    }


    //Get Common Status
    const fetchBranchStatus = async () => {
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

    //Get Branch details by ID
    const fetchBranchData = async (branchId) => {
        axios.get(`${baseUrl}/branch/list/` + branchId)
            .then(response => {
                console.log('response', response);
                setNewBranch({
                    ...newBranch,
                    ...response.data,
                    userid: response.data.createdUser.id,
                    branchStatus: response.data.branchStatus.id
                })
            })
    };




    //Error Handling
    const initErrors = {
        branchCode: '',
        branchName: '',
        branchAddress: '',
        branchStatus: ''
    }
    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }



    const UpdateBranch = (e) => {
        e.preventDefault();
        const data = {
            id: newBranch.id,
            branchCode: newBranch.branchCode,
            branchName: newBranch.branchName,
            branchStatus: {
                id: newBranch.branchStatus,
            },
            branchAddress: newBranch.branchAddress,
            createdDate: dateTime,
            createdUser: {
                id: userId,
            },

        };
        console.log('data', data);
        axios.post(`${baseUrl}/branch/add`, data)
            .then(function (response) {
                //console.log(response)
                utils.showSuccess("Branch Updated Successfully.");
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
        fetchBranchStatus();
        fetchBranchData(branchId);
        getCurrentUser();

    }, []);

    return (
        <AppTemplate>
            <div className="edit-branch">
                <form autoComplete="off" onSubmit={UpdateBranch}>
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Paper variant="outlined" >
                                <Box width="auto" p={1} my={0.5}>
                                    <TextField
                                        name="BranchCode"
                                        value={newBranch.branchCode}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        label="Branch Code"
                                        placeholder="Enter Branch Code"
                                        helperText={errors.branchCode}
                                        size="small"
                                        error={errors.branchCode ? 'error' : ''}

                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onChange={onChange}
                                    />
                                    <TextField
                                        name="branchName"
                                        value={newBranch.branchName}
                                        id="outlined-multiline-static"
                                        className={classes.textField}
                                        label="Branch Name"
                                        placeholder="Enter Name"
                                        helperText={errors.branchName}
                                        error={errors.branchName ? 'error' : ''}
                                        variant="outlined"
                                        margin="normal"
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onChange={onChange}
                                    />
                                    <TextField
                                        name="branchAddress"
                                        value={newBranch.branchAddress}
                                        className={classes.textField}
                                        id="outlined-multiline-static"
                                        label="Branch Address"
                                        placeholder="Enter Address"
                                        helperText={errors.branchAddress}
                                        multiline
                                        rows={4}
                                        fullWidth
                                        error={errors.branchAddress ? 'error' : ''}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={onChange}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid Container spacing={1}>
                        <Grid item xs={8}>
                            <Paper>
                                <Box>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink htmlFor="age-native-label-placeholder">
                                            Status
                                        </InputLabel>
                                        <Select
                                            name="branchStatus"
                                            value={newBranch.branchStatus}
                                            className={classes.formControl}
                                            className={classes.selectEmpty}
                                            variant="outlined"
                                            margin="normal"
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            onChange={onChange}
                                        >
                                            <MenuItem value="" disabled>
                                                *Required
                                            </MenuItem>
                                            {
                                                branchStatus.map((eachRow, index) => {
                                                    return (
                                                        <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                    );
                                                })
                                            }
                                        </Select>
                                        <FormHelperText>*Required</FormHelperText>
                                    </FormControl>
                                </Box>
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
                                type="reset"
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<RotateLeftIcon />}
                                onClick={resetError}
                            >
                                Reset
                        </Button>
                        </div>
                    </Paper>
                </form>
            </div>
        </AppTemplate>
    )
}