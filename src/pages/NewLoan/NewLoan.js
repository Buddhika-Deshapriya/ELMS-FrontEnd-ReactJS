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
    width: 185,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    width: 180,
  },
  textFields: {
    margin: theme.spacing(1, 1, 1, 1),
  },
}));

export default function NewLoanApplication(props) {

  const classes = useStyles();
  const [dateTime, setDateTime] = useState(new Date());
  const [userId, setUserID] = useState([]);
  const [rentalTypeId, setRentalType] = useState([]);
  const [loanTypeId, setLoanType] = useState([]);
  const [branch, setBranch] = useState([]);


  //Setup initial State
  const initApplication = {
    applicationNo: null,
    calculationNo: null,
    membershipNo: null,
    loanAmount: null,
    loanTypeId: null,
    effectiveRate: null,
    description: null,
    noOfRentals: null,
    otherCharges: null,
    paymentPeriod: null,
    rentalTypeId: null,
    loanStatus: null,
    branch: null
  }
  const onChange = (e) => {
    e.persist();
    setNewLoanApplication({ ...NewApplication, [e.target.name]: e.target.value });
  }

  //Get branch details
  const fetchBranchData = async () => {
    axios.get(`${baseUrl}/branch/list`)
      .then(response => {
        console.log('branch', response);
        setBranch(response.data);
      })
  }
  //Get rental type details
  const fetchRentalTypeData = async () => {
    axios.get(`${baseUrl}/rentaltype/list`)
      .then(response => {
        console.log('response', response);
        setRentalType(response.data);
      })
  }
  //Get loan type details
  const fetchLoanTypeData = async () => {
    axios.get(`${baseUrl}/loantype/list`)
      .then(response => {
        console.log('loanType', response);
        setLoanType(response.data);
      })
  }
  //Get Logged in user id
  const getCurrentUser = async () => {
    //console.log(SystemUser.get())
    setUserID(SystemUser.get().id);
  };


  const [NewApplication, setNewLoanApplication] = useState(initApplication);
  const resetData = () => {
    setNewLoanApplication(initApplication)
  }


  //Error Handling
  const initErrors = {
    applicationNo: '',
    calculationNo: '',
    membershipNo: '',
    loanAmount: '',
    loanTypeId: '',
    effectiveRate: '',
    description: '',
    noOfRentals: '',
    otherCharges: '',
    paymentPeriod: '',
    rentalTypeId: '',
    branch: '',
  }
  const [errors, setErrors] = useState(initErrors);
  const resetError = () => {
    setErrors(initErrors)
  }



  const SubmitNewLoanApplication = (e) => {
    e.preventDefault();
    const data = {
      applicationNo: NewApplication.applicationNo,
      calculationNo: NewApplication.calculationNo,
      membershipNo: NewApplication.membershipNo,
      loanTypeId: {
        id: NewApplication.loanTypeId,
      },
      loanAmount: NewApplication.loanAmount,
      rentalTypeId: {
        id: NewApplication.rentalTypeId,
      },
      branch: {
        id: NewApplication.branch,
      },
      effectiveRate: NewApplication.effectiveRate,
      description: NewApplication.description,
      noOfRentals: NewApplication.noOfRentals,
      paymentPeriod: NewApplication.paymentPeriod,
      otherCharges: NewApplication.otherCharges,
      loanStatus: {
        id: "1",
      },
      createdDate: dateTime,
      createdUser: {
        id: userId,
      },

    };
    console.log('data', data);
    axios.post(`${baseUrl}/loanapplication/add`, data)
      .then(function (response) {
        //console.log(response)
        utils.showSuccess("New Application Saved Successfully.");
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
    fetchBranchData();
    fetchLoanTypeData();
    fetchRentalTypeData();
    getCurrentUser();
  }, []);

  return (
    <AppTemplate>
      <div className="new-loan-application">
        <form autoComplete="off" onSubmit={SubmitNewLoanApplication}>
          <Grid container spacing={1}>
            <Paper>
              <TextField
                name="applicationNo"
                id="outlined-full-width"
                label="Application No"
                helperText={errors.applicationNo}
                size="small"
                error={errors.applicationNo ? 'error' : ''}
                className={classes.textFields}

                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={onChange}
              />
              <TextField
                name="calculationNo"
                id="outlined-full-width"
                label="Calculation No"
                helperText={errors.calculationNo}
                size="small"
                error={errors.calculationNo ? 'error' : ''}
                className={classes.textFields}

                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={onChange}
              />
            </Paper>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper>
              <FormControl className={classes.formControl} variant="outlined" >
                  <InputLabel id="demo-simple-select-filled-label">Branch Code</InputLabel>

                  <Select
                    variant="outlined"
                    name="branch"
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    label="Branch Code"
                    error={errors.branch ? 'error' : ''}
                    onChange={onChange}
                  >
                    <MenuItem value="" disabled>

                    </MenuItem>
                    {
                      branch.map((eachRow, index) => {
                        return (
                          <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                        );
                      })
                    }
                  </Select>
                </FormControl>
              <FormControl className={classes.formControl} variant="outlined" >
                  <InputLabel id="demo-simple-select-filled-label">Loan Type</InputLabel>

                  <Select
                    variant="outlined"
                    name="loanTypeId"
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    label="Gender"
                    error={errors.loanTypeId ? 'error' : ''}
                    onChange={onChange}
                  >
                    <MenuItem value="" disabled>

                    </MenuItem>
                    {
                      loanTypeId.map((eachRow, index) => {
                        return (
                          <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                        );
                      })
                    }
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl} variant="outlined" >
                  <InputLabel id="demo-simple-select-filled-label">Rental Type</InputLabel>

                  <Select
                    variant="outlined"
                    name="rentalTypeId"
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    label="Gender"
                    error={errors.rentalTypeId ? 'error' : ''}
                    onChange={onChange}
                  >
                    <MenuItem value="" disabled>

                    </MenuItem>
                    {
                      rentalTypeId.map((eachRow, index) => {
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
          <Grid>
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
          </Grid>
        </form>
      </div>
    </AppTemplate>
  )
}