import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
    Button, Paper, Grid, Container, TextField, InputLabel, Select, FormControl, Icon,
    FormHelperText, MenuItem, Card, NativeSelect

} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import CustomerList from '../CustomerList/CustomerList';
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
    margin:{
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 500,
    }
}));

export default function NewAsset(props) {

    const classes = useStyles();
    const [assetsStatus, setAssetsStatus] = useState([]);
    const [assetsType, setAssetsType] = useState([]);

    //Setup initial State
    const initAsset = {
        assetsType: null,
        description: null,
        assetsStatus: null,
        value: null,
    }
    const onChange = (e) => {
        e.persist();
        setNewAsset({ ...NewAsset, [e.target.name]: e.target.value });
    }

    //Get Common Status
    const fetchAssetStatus = async () => {
        axios.get(`${baseUrl}/commonstatus/list`)
            .then(response => {
                console.log('response', response);
                setAssetsStatus(response.data);
            })
    };
    const fetchAssetType = async () => {
        axios.get(`${baseUrl}/customerassetstype/list`)
            .then(response => {
                console.log('response', response);
                setAssetsType(response.data);
            })
    };

    const [newAsset, setNewAsset] = useState(initAsset);
    const resetData = () => {
        setNewAsset(initAsset)
    }


    //Error Handling
    const initErrors = {
        assetsStatus: '',
        assetsType: '',
        description: '',
        value: '',
    }

    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }


    const SubmitNewAsset = (e) => {
        e.preventDefault();
        const data = {
            assetsType: newAsset.assetsType,
            description: newAsset.description,

            assetsStatus: {
                id: newAsset.assetsStatus,
            },
            value: newAsset.value,
        };

        console.log('data', data);
        axios.post(`${baseUrl}/customerassets/add`, data)
            .then(function (response) {
                //console.log(response)
                utils.showSuccess("New Asset Saved Successfully.");
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
        fetchAssetStatus();
        fetchAssetType();
    }, []);

    return (
        <AppTemplate>
            <div className="new-asset">
                <form autoComplete="off" onSubmit={SubmitNewAsset}>
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Paper variant="outlined" >
                                <Card width="500">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink >
                                            Asset Type
                                     </InputLabel>
                                        <FormHelperText>{errors.assetsType}</FormHelperText>
                                        <Select
                                            variant="outlined"
                                            name="assetsType"
                                            //value={newLoan.status}
                                            displayEmpty
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            error={errors.status ? 'error' : ''}
                                            onChange={onChange}
                                        >
                                            <MenuItem value="" disabled>

                                            </MenuItem>
                                            {
                                                assetsType.map((eachRow, index) => {
                                                    return (
                                                        <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                    );
                                                })
                                            }
                                        </Select>

                                    </FormControl>
                                    <Card width="500">
                                    <TextField
                                        name="value"
                                        id="outlined-helperText"
                                        label="Value"
                                        placeholder="Enter Value"
                                        variant="outlined"
                                        helperText={errors.value}
                                        error={errors.value ? 'error' : ''}
                                        style={{ margin: 8 }}
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
                                        className={classes.margin}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={onChange}
                                    />
                                    </Card>
                                </Card>
                            </Paper>
                            <br />
                            <Paper>
                            <FormControl className={classes.formControl}>
                                <InputLabel shrink >
                                    Status
                                     </InputLabel>
                                <FormHelperText>{errors.assetsStatus}</FormHelperText>
                                <Select
                                    variant="outlined"
                                    name="status"
                                    //value={newLoan.status}
                                    displayEmpty
                                    label="Status"
                                    className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    error={errors.status ? 'error' : ''}
                                    onChange={onChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                >
                                    <MenuItem value="" disabled>

                                    </MenuItem>
                                    {
                                        assetsStatus.map((eachRow, index) => {
                                            return (
                                                <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                            );
                                        })
                                    }
                                </Select>
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
                    <Grid item xs={2}>
                        <Paper variant="outlined">
                            <Link to={"view-customer"} >
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}

                                >
                                    <ArrowBackIosIcon fontSize="small" />
                                        Back
                                    </Button>
                            </Link>
                        </Paper>
                    </Grid>
                </form>
            </div>
        </AppTemplate>
    )
}