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
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function NewLoanApplication(props) {

  const classes = useStyles();
  const [status, setLoanStatus] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());
  const [userId, setUserID] = useState([]);
   //Setup initial State
   const initLoan  = {
    applicayionNo: null,
    calculationNo: null,
    membershipNo: null,
    loanAmount: null,
    loanTypeId: null,
    effectiveRate: null,
    description: null,
    noOfRentals: null,
    otherCharges: null,
    paymentPeriod: null,
    rentalTypeId: null
  }
  const onChange = (e) => {
    e.persist();
    setNewLoanApplication({ ...newAApplication, [e.target.name]: e.target.value });
  }

  //Get Logged in user id
  const getCurrentUser = async () => {
    //console.log(SystemUser.get())
    setUserID(SystemUser.get().id);
  };

  //Get Common Status
  const fetchLoanApplicationStatus = async () => {
    axios.get(`${baseUrl}/loanstatus/list`)
      .then(response => {
        console.log('response', response);
        setLoanStatus(response.data);
      })
  };

 
  const [NewApplication, setNewLoanApplication] = useState(initApplication );
  const resetData  = () => {
    setNewLoanApplication(initApplication)
  }


  //Error Handling
  const initErrors  = {
    applicayionNo: '',
    calculationNo: '',
    membershipNo: '',
    loanAmount: '',
    loanTypeId: '',
    effectiveRate: '',
    description: '',
    noOfRentals: '',
    otherCharges: '',
    paymentPeriod: '',
    rentalTypeId: ''
  }
  const [errors, setErrors] = useState(initErrors);
  const resetError  = () => {
    setErrors(initErrors)
  }
  

 
  const SubmitNewLoanApplication = (e) => {
    e.preventDefault();
    const data = {
      applicationNo: NewApplication.applicationNo,
      calculationNo: NewApplication.calculationNo,
      membershipNo: NewApplication.membershipNo,
      loanTypeId: NewApplication.loanTypeId,
      loanAmount: NewApplication.loanAmount,
      rentalTypeId: NewApplication.rentalTypeId,
      effectiveRate: NewApplication.effectiveRate,
      description: NewApplication.description,
      noOfRentals: NewApplication.noOfRentals,
      paymentPeriod: NewApplication.paymentPeriod,
      otherCharges: NewApplication.otherCharges,


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
    fetchLoanApplicationStatus();
    getCurrentUser();
  }, []);

  return (
    <AppTemplate>
      <div className="new-loan-application">
        <form autoComplete="off" onSubmit={SubmitNewLoanApplication}>
          <Grid container spacing={1}>
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