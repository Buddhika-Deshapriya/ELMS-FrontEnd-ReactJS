import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
    Button, ButtonGroup, Grid, TextField,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { useHistory } from "react-router-dom";

import PageviewIcon from '@material-ui/icons/Pageview';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import { Pageview } from '@material-ui/icons';
import Branch from '../Branches/Branches';
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
}));

export default function ViewLoanApplication(props) {

    const history = useHistory();

    const classes = useStyles();
    const [LoanApps, ViewLoanApplication] = useState([]);
    const [rentalType, ViewRentalType] = useState([]);
    const [loanType, ViewLoanType] = useState([]);
    const [loanStatus, viewLoanStatus] = useState([]);
    const [branch, viewBranchName] = useState([]);

    const loanApplicationId = props.match.params.id;

    const fetchLoanApplicationData = async (loanApplicationId) => {

        axios.get(`${baseUrl}/loanapplication/list/` + loanApplicationId)
            .then(response => {
                console.log('response', response);
                ViewLoanApplication(response.data);
                ViewRentalType(response.data.rentalTypeId);
                ViewLoanType(response.data.loanTypeId);
                viewLoanStatus(response.data.loanStatus);
                viewBranchName(response.data.branch)
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
                                        helperText="Loan Status"
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
                                        helperText="Branch Name"
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
                        <Typography className={classes.heading}>Accordion 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
          </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}>Accordion 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
          </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}>Accordion 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget.
          </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>

        </AppTemplate>
    );

}