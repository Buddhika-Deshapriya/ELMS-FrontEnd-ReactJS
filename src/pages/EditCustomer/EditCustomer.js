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

import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import UpdateIcon from '@material-ui/icons/Update';


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
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function EditCustomer(props) {

    
  const classes = useStyles();
  const [status, setStatus] = useState([]);
  //Setup initial State
  const initLoan  = {
    title: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    gender: null,
    dob: null,
    nic: null,
    address: null,
    telephone: null,
    mobile: null,
    email: null,
    marriedStatus: null,
    familyIncome: null,
    total_members: null,
    income: null,
    passport: null,
    membershipType: null,
    membership_no: null
  }
  const [newCustomer, setNewCustomer] = useState(initCustomer );
  const resetData  = () => {
    setNewCustomer(initCustomer)
  }

  const customerId = props.match.params.id


  const onChange = (e) => {
    e.persist();
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  }


  //Get Common Status
  const fetchLoanTypeStatus = async () => {
    axios.get(`${baseUrl}/commonstatus/list`)
      .then(response => {
        console.log('response', response);
        setStatus(response.data);
      })
  };

  //Get Customer details by ID
  const fetchCustomerData = async (CustomerId) => {
    axios.get(`${baseUrl}/customer/list/` + CustomerId)
      .then(response => {
        console.log('response', response);
        setNewCustomer({
            ...newCustomer,
            ...response.data,
            status:response.data.status.id
        })
        // console.log('format',{
        //     ...newCustomer,
        //     ...response.data,
        //     status:response.data.status.id
        // });

      })
  };
  
  


  //Error Handling
  const initErrors  = {
    title: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    dob: '',
    nic: '',
    address: '',
    telephone: '',
    mobile: '',
    email: '',
    marriedStatus: '',
    familyIncome: '',
    total_members: '',
    income: '',
    passport: '',
    membershipType: '',
    membership_no: ''
  }
  const [errors, setErrors] = useState(initErrors);
  const resetError  = () => {
    setErrors(initErrors)
  }
  

 
  const UpdateCustomer = (e) => {
    e.preventDefault();
    const data = {
      id : newCustomer.id,
      mobile: newCustomer.mobile,
      telephone: newCustomer.telephone,
      email: newCustomer.email,
      address: newCustomer.address,
      familyIncome: newCustomer.familyIncome,
      total_members: newCustomer.total_members,
      income: newCustomer.income,
      familyType:newCustomer.familyType,
      marriedStatus: newCustomer.marriedStatus,


      status: {
        id: newCustomer.status,
      },
      membership_no: newCustomer.membership_no,
      title: newCustomer.title,
      first_name: newCustomer.first_name,
      middle_name: newCustomer.middle_name,
      last_name: newCustomer.last_name,
      gender: newCustomer.gender,
      dob: newCustomer.dob,
      nic: newCustomer.nic,
      membershipType: newCustomer.membershipType,
      passport: newCustomer.passport


    };
    console.log('data', data);
    axios.post(`${baseUrl}/customer/add`, data)
      .then(function (response) {
        //console.log(response)
        utils.showSuccess("Customer Updated Successfully.");
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
    fetchCustomerStatus();
    fetchCustomerData(customerId);
  }, []);

  return (
    <AppTemplate>
      <div className="edit-customer">
        {/* <Typography variant="h4" gutterBottom>
        Add New Customer
      </Typography> */}
        <form autoComplete="off" onSubmit={UpdateCustomer}>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <Paper variant="outlined" >
                <Box width="auto" p={1} my={0.5}>
                  <TextField
                    name="address "
                    value={newCustomer.address}
                    id="outlined-full-width"
                    label="Address"
                    placeholder="Enter Address"
                    helperText={errors.address}
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    error={errors.address ? 'error' : ''}
                    
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    onChange={onChange}
                  />
                  <TextField
                    name="telephone"
                    value={newCustomer.telephone}
                    id="outlined-multiline-static"
                    label="Telephone No"
                    placeholder="Enter Telephone No"
                    helperText={errors.telephone}
                    error={errors.telephone ? 'error' : ''}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="mobile"
                    value={newCustomer.mobile}
                    id="outlined-multiline-static"
                    label="Mobile No"
                    placeholder="Enter Mobile No"
                    helperText={errors.mobile}
                    error={errors.mobile ? 'error' : ''}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="email"
                    value={newCustomer.email}
                    id="outlined-multiline-static"
                    label="Email"
                    placeholder="Enter Email"
                    helperText={errors.email}
                    error={errors.email ? 'error' : ''}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  {/* <TextField
                    name="marriedStatus"
                    value={newCustomer.marriedStatus}
                    id="outlined-multiline-static"
                    label="Married Status"
                    placeholder="Enter Family Type"
                    helperText={errors.familyType}
                    error={errors.familyType ? 'error' : ''}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  /> */}
                  <TextField
                    name="familyType"
                    value={newCustomer.familyType}
                    id="outlined-multiline-static"
                    label="Family Type"
                    placeholder="Enter Family Type"
                    helperText={errors.familyType}
                    error={errors.familyType ? 'error' : ''}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="income"
                    value={newCustomer.income}
                    id="outlined-multiline-static"
                    label="Income"
                    placeholder="Enter Income"
                    helperText={errors.income}
                    error={errors.income ? 'error' : ''}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="familyIncome"
                    value={newCustomer.familyIncome}
                    id="outlined-multiline-static"
                    label="Family Income"
                    placeholder="Enter Family Income"
                    helperText={errors.familyIncome}
                    error={errors.familyIncome ? 'error' : ''}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={onChange}
                  />
                  <TextField
                    name="total_members"
                    value={newCustomer.total_members}
                    id="outlined-multiline-static"
                    label="Total Members"
                    placeholder="Enter Total Members"
                    helperText={errors.total_members}
                    error={errors.total_members ? 'error' : ''}
                    fullWidth
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
                      name="status"
                      value={newCustomer.status}
                      displayEmpty
                      className={classes.selectEmpty}
                      inputProps={{ 'aria-label': 'Without label' }}
                      onChange={onChange}
                    >
                      <MenuItem value="" disabled>
                        Placeholder
                      </MenuItem>
                      {
                        status.map((eachRow, index) => {
                          return (
                            <MenuItem value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                          );
                        })
                      }
                    </Select>
                    <FormHelperText>Placeholder</FormHelperText>
                  </FormControl>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={5}>
              <Paper variant="outlined" >
                <div>
                  <TextField
                    name="maxAmount"
                    value={newLoan.maxAmount}
                    id="outlined-helperText"
                    label="Maximum Amount"
                    helperText="Some important text"
                    variant="outlined"
                    style={{ margin: 8 }}
                    onChange={onChange}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    InputProps={{
                        readOnly: true,
                      }}
                  />
                  <TextField
                    name="minAmount"
                    value={newLoan.minAmount}
                    id="outlined-helperText"
                    label="Minimum Amount"
                    helperText="Some important text"
                    variant="outlined"
                    style={{ margin: 8 }}
                    onChange={onChange}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    InputProps={{
                        readOnly: true,
                      }}
                  />
                  <TextField
                    name="maxInterestRate"
                     value={newLoan.maxInterestRate}
                    id="outlined-helperText"
                    label="Maximum Interest Rate"
                    helperText="Some important text"
                    variant="outlined"
                    style={{ margin: 8 }}
                    onChange={onChange}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    InputProps={{
                        readOnly: true,
                      }}
                  />
                  <TextField
                    name="minInterestRate"
                    value={newLoan.minInterestRate}
                    id="outlined-helperText"
                    label="Minimum Interest Rate"
                    helperText="Some important text"
                    variant="outlined"
                    style={{ margin: 8 }}
                    onChange={onChange}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    InputProps={{
                        readOnly: true,
                      }}
                  />
                  <TextField
                    name="maxTimePeriod"
                    value={newLoan.maxTimePeriod}
                    id="outlined-helperText"
                    label="Maximum Time Period"
                    helperText="Some important text"
                    variant="outlined"
                    style={{ margin: 8 }}
                    onChange={onChange}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    InputProps={{
                        readOnly: true,
                      }}

                  />
                  <TextField
                    name="minTimePeriod"
                    value={newLoan.minTimePeriod}
                    id="outlined-helperText"
                    label="Minimum Time Period"
                    helperText="Some important text"
                    variant="outlined"
                    style={{ margin: 8 }}
                    onChange={onChange}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    InputProps={{
                        readOnly: true,
                      }}
                  />

                </div>
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
                startIcon={<DeleteIcon />}
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