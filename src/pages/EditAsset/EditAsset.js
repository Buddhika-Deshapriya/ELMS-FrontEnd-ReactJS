import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button, ButtonGroup,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Grid, Container, TextField, InputLabel, Select, FormControl, Icon,
  FormHelperText, MenuItem, Box, NativeSelect

} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import UpdateIcon from '@material-ui/icons/Update';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

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
    margin: theme.spacing(1, 1, 1, 1),
    width: 100
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function EditAsset(props) {

    
  const classes = useStyles();
  const [assetsStatus, setStatus] = useState([]);
  const [assetsType, setAssetType] = useState([]);
  
  //Setup initial State
  const initAsset  = {
    assetsType: null,
    description: null,
    assetsStatus: null,
    value: null
  }
  const [newAsset, setNewAsset] = useState(initAsset );
  const resetData  = () => {
    setNewAsset(initAsset)
  }

  const assetId = props.match.params.id

  const onChange = (e) => {
    e.persist();
    setNewAsset({ ...newAsset, [e.target.name]: e.target.value });
  }


  //Get Common Status
  const fetchAssetStatus = async () => {
    axios.get(`${baseUrl}/commonstatus/list`)
      .then(response => {
        console.log('response', response);
        setStatus(response.data);
      })
  };
  //Asset type details
  const fetchAssetType = async () => {
    axios.get(`${baseUrl}/customerassetstype/list`)
      .then(response => {
        console.log('response', response);
        setAssetType(response.data);
      })
  };

  //Get Asset details by ID
  const fetchAssetData = async (assetId) => {
    axios.get(`${baseUrl}/customerassets/list/` + assetId)
      .then(response => {
        console.log('response', response);
        setNewAsset({
            ...newAsset,
            ...response.data,
            assetsStatus:response.data.assetsStatus.id,
            assetsType:response.data.assetsType.id,
            customerId:response.data.id,

        })
      })
  };
  
  


  //Error Handling
  const initErrors  = {
    assetsType: '',
    description: '',
    assetsStatus: '',
    value: ''
  }
  const [errors, setErrors] = useState(initErrors);
  const resetError  = () => {
    setErrors(initErrors)
  }
  

 
  const UpdateAsset = (e) => {
    e.preventDefault();
    const data = {
      id : newAsset.id,
      description: newAsset.description,
      value: newAsset.value,
      assetsType: {
        id: newAsset.assetsType,
      },
      assetsStatus: {
        id: newAsset.assetsStatus,
      },
      customers:[
        {
          id:newAsset.customerId
        }
      ]
    };
    console.log('data', data);
    axios.post(`${baseUrl}/customerassets/add`, data)
      .then(function (response) {
        //console.log(response)
        utils.showSuccess("Asset Updated Successfully.");
      })
      .catch(_errors => {
        //console.log('_errors',_errors);
        if (_errors.response) {
          //console.log('Test');
          const _sErrors = _errors.response.data.errors;
          const _error = _errors.response.data.error;
          if(_sErrors!==undefined){
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
    fetchAssetData(assetId);
  }, []);

  return (
    <AppTemplate>
      <div className="edit-asset">
        {/* <Typography variant="h4" gutterBottom>
        Add New Loan Type
      </Typography> */}
        <form autoComplete="off" onSubmit={UpdateAsset}>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <Paper variant="outlined" >
                <Box width="auto" p={1} my={0.5}>
                <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                      Asset Type
                    </InputLabel>
                    <Select
                      name="assetsType"
                      value={newAsset.assetsType}
                      displayEmpty
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}
                      readOnly="readonly"
                      onChange={onChange}
                    >
                      <MenuItem value="" disabled>
                        Placeholder
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
                  <TextField
                    name="description"
                    value={newAsset.description}
                    id="outlined-full-width"
                    label="Description"
                    placeholder="Enter Description"
                    helperText={errors.description}
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    error={errors.description ? 'error' : ''}
                    
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    onChange={onChange}
                  />
                  <TextField
                    name="value"
                    value={newAsset.value}
                    id="outlined-multiline-static"
                    label="value"
                    placeholder="Enter Value"
                    helperText={errors.value}
                    error={errors.value ? 'error' : ''}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />

                  <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="age-native-label-placeholder">
                      Status
                    </InputLabel>
                    <Select
                      name="assetsStatus"
                      value={newAsset.assetsStatus}
                      displayEmpty
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}
                      onChange={onChange}
                    >
                      <MenuItem value="" disabled>
                        *Required
                      </MenuItem>
                      {
                        assetsStatus.map((eachRow, index) => {
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