import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
    Grid, TextField,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Button,
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider } from '@material-ui/styles';
import { useHistory } from "react-router-dom";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
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

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
});

export default function ViewLoanApplication(props) {

    const history = useHistory();

    const classes = useStyles();
    const [LoanApps, ViewLoanApplication] = useState([]);
    const [rentalType, ViewRentalType] = useState([]);
    const [loanType, ViewLoanType] = useState([]);
    const [loanStatus, ViewLoanStatus] = useState([]);
    const [branch, ViewBranchName] = useState([]);
    const [customers, ViewCustomer] = useState([]);
    const [applications, SetLoanApplications] = useState([]);
    const [responses, ViewLoanResponses] = useState([]);
    const [directorResponses, ViewLoanDirectorResponses] = useState([]);


    const loanApplicationId = props.match.params.id;

    const fetchLoanApplicationList = async () => {
        axios.get(`${baseUrl}/loanapplication/list`)
            .then(response => {
                console.log('loan applications', response);
                SetLoanApplications(response.data);
            })
    }

    const fetchLoanApplicationData = async (loanApplicationId) => {

        axios.get(`${baseUrl}/loanapplication/list/` + loanApplicationId)
            .then(response => {
                console.log('response', response);
                ViewLoanApplication(response.data);
                ViewRentalType(response.data.rentalTypeId);
                ViewLoanType(response.data.loanTypeId);
                ViewLoanStatus(response.data.loanStatus);
                ViewBranchName(response.data.branch);
                ViewCustomer(response.data.customers);
                ViewLoanResponses(response.data.loanApplicationResponses);
                ViewLoanDirectorResponses(response.data.loanApplicationDirectorResponses);
            })
            .catch(_errors => {
                if (_errors.response) {
                    const { status, data } = _errors.response;
                    console.log('_errors.response', _errors.response);
                    if (status === 401) {
                        console.log('data.error', data.error);
                        utils.showError("Bad Credintials");
                    }
                    else {
                        let errorsObj = {}
                        data.errors.forEach(error => {
                            const { defaultMessage, field } = error
                            errorsObj[field] = defaultMessage;
                        })
                        console.log(errorsObj);
                        this.setState({ errors: errorsObj });
                    }
                }
            });
    };

    useEffect(() => {
        fetchLoanApplicationData(loanApplicationId);
        fetchLoanApplicationList();
    }, []);

    return (
        <AppTemplate>
            <div className="loan-application-view">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}> <b>Loan Application Details: </b> </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid>
                            <Grid container spacing={4}>
                                <Grid item xs={3}>
                                    <TextField
                                        name="applicationNo"
                                        value={LoanApps.applicationNo}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Application No"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        name="calculationNo"
                                        value={LoanApps.calculationNo}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Calculation No"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        name="branch"
                                        value={branch.branchName}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Branch Name"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        name="createdDate"
                                        value={LoanApps.createdDate}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Applied Date"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={4}>
                                <Grid item xs={3}>
                                    <TextField
                                        name="loanAmount"
                                        value={LoanApps.loanAmount}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Loan Amount"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        name="effectiveRate"
                                        value={LoanApps.effectiveRate}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Effective Rate"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        name="loanType"
                                        value={loanType.loanType}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Loan Type"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        name="rentalType"
                                        value={rentalType.type}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Rental Type"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={4}>
                                <Grid item xs={3}>
                                    <TextField
                                        name="noOfRentals"
                                        value={LoanApps.noOfRentals}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="No of Rentals"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        name="paymentPeriod"
                                        value={LoanApps.paymentPeriod + " Year"}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Payment Period"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        name="loanStatus"
                                        value={loanStatus.type}
                                        className={classes.textField}
                                        id="outlined-full-width"
                                        helperText="Loan Status"
                                        size="medium"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}> <b>Customer Details: </b> </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                        <StyledTableCell align="left">Membership No</StyledTableCell>
                                        <StyledTableCell>Customer Name</StyledTableCell>
                                        <StyledTableCell align="left">NIC</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        customers.length === 0 ?
                                            <TableRow align="center">
                                                <TableCell colSpan="5">No Customers Available</TableCell>
                                            </TableRow> :
                                            customers.map((row) => (
                                                <StyledTableRow key={row.id}>
                                                    <StyledTableCell align="left">
                                                        <Link to={"/view-customer/" + row.id}>
                                                            <ThemeProvider theme={theme}>
                                                                <Typography color="primary">
                                                                    {row.membership_no}
                                                                </Typography>
                                                            </ThemeProvider>
                                                        </Link>
                                                    </StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">
                                                        {row.first_name}{" "}{row.middle_name}{" "}{row.last_name}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">{row.nic}</StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}><b>Previous Loans Details: </b></Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                            <StyledTableCell align="left">Application No</StyledTableCell>
                                            <StyledTableCell>Date</StyledTableCell>
                                            <StyledTableCell align="left">Loan Amount</StyledTableCell>
                                            <StyledTableCell align="left">Status</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            applications.length === 0 ?
                                                <TableRow align="center">
                                                    <TableCell colSpan="5">No Previous Loans Available</TableCell>
                                                </TableRow> :
                                                // applications.membership_no === customers.membership_no ?
                                                applications.map((application) => (
                                                    application.customers.map((customer) => (
                                                        customers.map((thisCustomer) => (
                                                            application.applicationNo != LoanApps.applicationNo ?
                                                                thisCustomer.membership_no === customer.membership_no ?
                                                                    <StyledTableRow key={application.id}>
                                                                        <StyledTableCell align="left">
                                                                            {application.applicationNo}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {application.createdDate}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="left">{application.loanAmount}</StyledTableCell>
                                                                        <StyledTableCell align="left">{application.loanStatus.type}</StyledTableCell>
                                                                    </StyledTableRow>
                                                                    : null
                                                                : null
                                                        ))
                                                    ))
                                                ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}> <b>Manager Approvals for Loan: </b> </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                        <StyledTableCell align="left">Amount</StyledTableCell>
                                        <StyledTableCell align="left">Date</StyledTableCell>
                                        <StyledTableCell align="left">Status</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {directorResponses.length === 0 ?
                                        <TableRow align="center">
                                            <TableCell colSpan="5">No Manager Approvals</TableCell>
                                        </TableRow> :
                                        directorResponses.map((row) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell align="left">{row.acceptedAmount}</StyledTableCell>
                                                <StyledTableCell align="left">{row.createdDate}</StyledTableCell>
                                                <StyledTableCell align="left">{row.loanStatus.type}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}> <b>Director Approvals for Loan: </b> </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                        <StyledTableCell align="left">Amount</StyledTableCell>
                                        <StyledTableCell align="left">Date</StyledTableCell>
                                        <StyledTableCell align="left">Status</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {responses.length === 0 ?
                                        <TableRow align="center">
                                            <TableCell colSpan="5">No Director Approvals</TableCell>
                                        </TableRow> :
                                        responses.map((row) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell align="left">{row.acceptedAmount}</StyledTableCell>
                                                <StyledTableCell align="left">{row.createdDate}</StyledTableCell>
                                                <StyledTableCell align="left">{row.loanStatus.type}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
                <br/>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => history.goBack()}
                >
                    Back
                </Button>
            </div>

        </AppTemplate>
    );

}