import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
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
    margin: theme.spacing(1, 1, 1, 1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    width: 200,
  },
  width: {
    width:400,
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

export default function NewLoanType(props) {

  const history = useHistory();
  const classes = useStyles();
  const [status, setStatus] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());
  const [userId, setUserID] = useState([]);

  //Setup initial State
  const initLoan = {
    loanType: null,
    description: null,
    status: null,
    maxAmount: null,
    minAmount: null,
    minInterestRate: null,
    maxInterestRate: null,
    maxTimePeriod: null,
    minTimePeriod: null
  }
  const onChange = (e) => {
    e.persist();
    setNewLoan({ ...newLoan, [e.target.name]: e.target.value });
  }

  //Get Logged in user id
  const getCurrentUser = async () => {
    //console.log(SystemUser.get())
    setUserID(SystemUser.get().id);
  };

  //Get Common Status
  const fetchLoanTypeStatus = async () => {
    axios.get(`${baseUrl}/commonstatus/list`)
      .then(response => {
        console.log('response', response);
        setStatus(response.data);
      })
  };


  const [newLoan, setNewLoan] = useState(initLoan);
  const resetData = () => {
    setNewLoan(initLoan)
  }


  //Error Handling
  const initErrors = {
    loanType: '',
    description: '',
    status: '',
    maxAmount: '',
    minAmount: '',
    minInterestRate: '',
    maxInterestRate: '',
    maxTimePeriod: '',
    minTimePeriod: '',
  }
  const [errors, setErrors] = useState(initErrors);
  const resetError = () => {
    setErrors(initErrors)
  }



  const SubmitNewLoanType = (e) => {
    e.preventDefault();
    const data = {
      loanType: newLoan.loanType,
      description: newLoan.description,

      status: {
        id: newLoan.status,
      },
      maxAmount: newLoan.maxAmount,
      minAmount: newLoan.minAmount,
      minInterestRate: newLoan.minInterestRate,
      maxInterestRate: newLoan.maxInterestRate,
      maxTimePeriod: newLoan.maxTimePeriod,
      minTimePeriod: newLoan.minTimePeriod,
      createdDate: dateTime,
      createdUser: {
        id: userId,
      },

    };
    console.log('data', data);
    axios.post(`${baseUrl}/loantype/add`, data)
      .then(function (response) {
        //console.log(response)
        utils.showSuccess("New Loan Type Saved Successfully.");
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
    fetchLoanTypeStatus();
    getCurrentUser();
  }, []);

  return (
    <AppTemplate>
      <div className="new-loan-type">
        <form autoComplete="off" onSubmit={SubmitNewLoanType}>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <Paper variant="outlined" >
                <Box width="auto" p={1} my={0.5}>
                  <TextField
                    name="loanType"
                    id="outlined-full-width"
                    label="Loan Type Name"
                    placeholder="Enter Loan Type Name"
                    helperText={errors.loanType}
                    fullWidth
                    size="small"
                    error={errors.loanType ? 'error' : ''}

                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    onChange={onChange}
                  />
                  <TextField
                    name="description"
                    id="outlined-multiline-static"
                    label="Description"
                    placeholder="Enter Description"
                    helperText={errors.description}
                    error={errors.description ? 'error' : ''}
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />

                  <FormControl className={classes.formControl}>
                    <InputLabel shrink >
                      Status
                    </InputLabel>
                    <FormHelperText>{errors.status}</FormHelperText>
                    <Select
                      variant="outlined"
                      name="status"
                      displayEmpty
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}
                      error={errors.status ? 'error' : ''}
                      onChange={onChange}
                    >
                      <MenuItem value="" disabled>

                      </MenuItem>
                      {
                        status.map((eachRow, index) => {
                          return (
                            <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                          );
                        })
                      }
                    </Select>

                  </FormControl>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={5}>
              <Paper variant="outlined" >
                <div>
                  <TextField
                    name="maxAmount"
                    id="outlined-helperText"
                    label="Maximum Amount"
                    placeholder="Enter Maximum Amount"
                    helperText="Some important text"
                    variant="outlined"
                    helperText={errors.maxAmount}
                    error={errors.maxAmount ? 'error' : ''}
                    style={{ margin: 8 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="minAmount"
                    id="outlined-helperText"
                    label="Minimum Amount"
                    placeholder="Enter Minimum Amount"
                    helperText="Some important text"
                    variant="outlined"
                    helperText={errors.minAmount}
                    error={errors.minAmount ? 'error' : ''}
                    style={{ margin: 8 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="maxInterestRate"
                    id="outlined-helperText"
                    label="Maximum Interest Rate"
                    placeholder="Enter Maximum Interest"
                    helperText="Some important text"
                    variant="outlined"
                    helperText={errors.maxInterestRate}
                    error={errors.maxInterestRate ? 'error' : ''}
                    style={{ margin: 8 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="minInterestRate"
                    id="outlined-helperText"
                    label="Minimum Interest Rate"
                    placeholder="Enter Maximum Interest"
                    helperText="Some important text"
                    variant="outlined"
                    helperText={errors.minInterestRate}
                    error={errors.minInterestRate ? 'error' : ''}
                    style={{ margin: 8 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="maxTimePeriod"
                    id="outlined-helperText"
                    label="Maximum Time Period"
                    placeholder="Enter Maximum Time Period"
                    helperText="Some important text"
                    variant="outlined"
                    helperText={errors.maxTimePeriod}
                    error={errors.maxTimePeriod ? 'error' : ''}
                    style={{ margin: 8 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="minTimePeriod"
                    id="outlined-helperText"
                    label="Minimum Time Period"
                    placeholder="Enter Minimum Time Period"
                    helperText="Some important text"
                    variant="outlined"
                    helperText={errors.minTimePeriod}
                    error={errors.minTimePeriod ? 'error' : ''}
                    style={{ margin: 8 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />

                </div>
              </Paper>
            </Grid>
          </Grid>
          <br />
          <Paper variant="outlined" className={classes.width} >
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
              <ColorButton variant="contained" color="secondary" className={classes.margin} type="reset" startIcon={<RotateLeftIcon />} onClick={resetError}>
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