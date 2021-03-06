import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import {
    Button, Paper, Grid, InputLabel, Select, FormControl, TextField,
    FormHelperText, MenuItem, Card,

} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
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
        width: 500,
    },
    width: {
        width: 830,
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

export default function NewAsset(props) {

    const history = useHistory();

    const classes = useStyles();
    const [assetsStatus, setAssetsStatus] = useState([]);
    const [assetsType, setAssetsType] = useState([]);

    const customerId = props.match.params.id

    //Setup initial State
    const initAsset = {
        assetsType: null,
        description: null,
        assetsStatus: null,
        value: null
    }
    const onChange = (e) => {
         e.persist();
        setNewAsset({ ...newAsset, [e.target.name]: e.target.value });
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
        value: ''
    }

    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }

    const SubmitNewAsset = (e) => {
        e.preventDefault();
        const data = {
            description: newAsset.description,
            assetsType: {
                id: newAsset.assetsType,
            },
            assetsStatus: {
                id: newAsset.assetsStatus,
            },
            value: newAsset.value,
            customers: [
                {
                    id: customerId,
                }
            ],
        };

        console.log('data-set', data);
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
                                            displayEmpty
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            error={errors.assetsType ? 'error' : ''}
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
                                        name="assetsStatus"
                                        displayEmpty
                                        label="Status"
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        error={errors.assetsStatus ? 'error' : ''}
                                        onChange={onChange}
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
                            <ColorButton variant="contained" color="secondary"  type="reset" startIcon={<RotateLeftIcon />} onClick={resetError}>
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