import React, { useEffect , useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';

import {
  Button, Paper, Grid, TableCell, TableRow, TableContainer, Table, TableHead, TableBody, Tooltip,  InputLabel, Select, FormControl,
  FormHelperText, MenuItem
} from '@material-ui/core';

import logo from './coop test2.jpg';
import utils from '../../helper/utils';
import { Height } from '@material-ui/icons';
const { baseUrl } = appConfig;

const StyledTableCell = withStyles((theme) => ({
  head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
  },
  body: {
      fontSize: 14,
  },
}))(TableCell);
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
  },
}))(Tooltip);
const StyledTableRow = withStyles((theme) => ({
  root: {
      '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
      },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
      minWidth: 700,
  },
  title: {
      fontSize: 16,
  },
  root: {
      width: '100%',
  },
  textField: {
      margin: theme.spacing(1, 1, 1, 1),
  },
  heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
  },
  expand: {
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
      }),
  },
}));

export default function HomePage(props) {

  const classes = useStyles();
  const [payment, setPaymentData] = useState([]);

  const fetchPaymentData = async () => {
    axios.get(`${baseUrl}/payments/list`)
      .then(response => {
        console.log('payments', response);
        setPaymentData(response.data);
      })
  }
  useEffect(() => {
    fetchPaymentData();
}, []);
  return (
    <AppTemplate>
      <div className="home-page">
        {/* <h1> Home page.</h1> */}
        <Grid>
          <img src={logo} width="1400" />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                    <StyledTableCell align="left">Amount</StyledTableCell>
                    <StyledTableCell align="left">Date</StyledTableCell>
                    <StyledTableCell align="left">Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payment.length === 0 ?
                    <TableRow align="center">
                      <TableCell colSpan="5">No Manager Approvals</TableCell>
                    </TableRow> :
                    payment.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell align="left">{row.acceptedAmount}</StyledTableCell>
                        <StyledTableCell align="left">{row.createdDate}</StyledTableCell>
                        <StyledTableCell align="left">{row.loanStatus.type}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer> */}
          </Grid>
        </Grid>
      </div>
    </AppTemplate>
  )
}