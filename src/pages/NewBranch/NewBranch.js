import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Grid, TextField, InputLabel, Select, FormControl,
    FormHelperText, MenuItem, Box,
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

export default function NewBranch(props) {

    const history = useHistory();

    const classes = useStyles();
    const [branchStatus, setBranchStatus] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());
    const [userId, setUserID] = useState([]);
    //Setup initial State
    const initBranch = {
        branchCode: null,
        branchName: null,
        branchAddress: null,
        branchStatus: null,
    }
    const onChange = (e) => {
        e.persist();
        setNewBranch({ ...newBranch, [e.target.name]: e.target.value });
    }

    //Get Logged in user id
    const getCurrentUser = async () => {
        //console.log(SystemUser.get())
        setUserID(SystemUser.get().id);
    };

    //Get Common Status
    const fetchBranchStatus = async () => {
        axios.get(`${baseUrl}/commonstatus/list`)
            .then(response => {
                console.log('response', response);
                setBranchStatus(response.data);
            })
    };


    const [newBranch, setNewBranch] = useState(initBranch);
    const resetData = () => {
        setNewBranch(initBranch)
    }


    //Error Handling
    const initErrors = {
        branchCode: '',
        branchName: '',
        branchAddress: '',
        branchStatus: '',
    }
    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }



    const SubmitNewBranch = (e) => {
        e.preventDefault();
        const data = {
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
                console.log(response)
                utils.showSuccess("New Branch Saved Successfully.");
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
        fetchBranchStatus();
        getCurrentUser();
    }, []);

    return (
        <AppTemplate>
            <div className="new-branch">
                <form autoComplete="off" onSubmit={SubmitNewBranch}>
                    <Paper variant="outlined" >
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Box width="auto" p={1} my={0.5}>
                                    <TextField
                                        name="branchCode"
                                        id="outlined-full-width"
                                        label="Branch Code"
                                        helperText={errors.branchCode}
                                        className={classes.textFields}
                                        size="medium"
                                        error={errors.branchCode ? 'error' : ''}

                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onChange={onChange}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Box width="auto" p={1} my={0.5}>
                                    <TextField
                                        name="branchName"
                                        id="outlined-full-width"
                                        label="Branch Name"
                                        helperText={errors.branchName}
                                        className={classes.textFields}
                                        placeholder="Enter Name"
                                        size="medium"
                                        error={errors.branchCode ? 'error' : ''}

                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        onChange={onChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={6} className={classes.selectEmpty} >
                            <TextField
                                name="branchAddress"
                                id="outlined-multiline-static"
                                label="Address"
                                placeholder="Enter Address"
                                helperText={errors.branchAddress}
                                error={errors.branchAddress ? 'error' : ''}
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={onChange}
                            />
                            </Grid>
                        </Grid>
                        <Grid>
                            <Grid>
                                <Box>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink >
                                            Status
                                        </InputLabel>
                                        <FormHelperText>{errors.branchStatus}</FormHelperText>
                                        <Select
                                            variant="outlined"
                                            name="branchStatus"
                                            className={classes.margin}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            error={errors.branchStatus ? 'error' : ''}
                                            onChange={onChange}
                                        >
                                            <MenuItem value="" disabled>

                                            </MenuItem>
                                            {
                                                branchStatus.map((eachRow, index) => {
                                                    return (
                                                        <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
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