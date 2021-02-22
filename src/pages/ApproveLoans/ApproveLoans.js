import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
    Button, ButtonGroup,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import EditIcon from '@material-ui/icons/Edit';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

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

export default function PendingLoanList() {

    const [pendingLoan, setPendingLoans] = useState([]);
    console.log('Pending Loans', pendingLoan);

    const fetchData = async () => {
        axios.get(`${baseUrl}/loanapplication/list`)
            .then(response => {
                console.log('response', response);
                setPendingLoans(response.data);
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
        fetchData();
    }, []);

    const useStyles = makeStyles({
        table: {
            minWidth: 700,
        },
    });
    const classes = useStyles();

    return (
        <AppTemplate>
            <div className="pending-loan-list">
                {/* <Link to={"new-customer"} >
                    <Button
                        variant="contained"
                        color="secondary"
                        className="new-customer-add-button"
                        startIcon={<CloudUploadIcon />}
                    >
                        New Customer
                    </Button>
                </Link> */}
                <br /><br /><br />
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                <StyledTableCell>Application No</StyledTableCell>
                                <StyledTableCell>Calculation No</StyledTableCell>
                                <StyledTableCell align="left">Amount</StyledTableCell>
                                <StyledTableCell align="left">Date</StyledTableCell>
                                <StyledTableCell align="left">Status</StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingLoan.length === 0 ?
                                <TableRow align="center">
                                    <TableCell colSpan="5">No Pending Loans Available</TableCell>
                                </TableRow> :
                                pendingLoan.map((row) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell align="left">{row.applicationNo}</StyledTableCell>
                                        <StyledTableCell align="left">{row.calculationNo}</StyledTableCell>
                                        <StyledTableCell align="left">{row.loanAmount}</StyledTableCell>
                                        <StyledTableCell align="left">{row.createdDate}</StyledTableCell>
                                        <StyledTableCell align="left" sortDirection={row.loanStatus.type == "pending"? row.loanStatus.type:"pending"}></StyledTableCell>
                                        <StyledTableCell align="left">
                                            <ButtonGroup>
                                                {/* <Link to={"edit-customer/" + row.id} > */}
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                >
                                                    <HtmlTooltip
                                                        title={
                                                            <React.Fragment>
                                                                <Typography color="inherit">To Approve</Typography>
                                                            </React.Fragment>
                                                        }>
                                                        <ThumbUpIcon />
                                                    </HtmlTooltip>
                                                </Button>
                                                {/* </Link> */}
                                            </ButtonGroup>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </AppTemplate>
    )
}