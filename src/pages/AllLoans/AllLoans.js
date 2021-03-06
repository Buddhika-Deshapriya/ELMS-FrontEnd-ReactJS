import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
    Button, ButtonGroup,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import PageviewIcon from '@material-ui/icons/Pageview';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import { Pageview } from '@material-ui/icons';
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
}));

export default function AllLoans() {

    const [LoanApps, setLoanApplications] = useState([]);
    // const [loanStatus, setLoanStatus] = useState([]);
    // const LoanStatus = useState({
    //     dataSet: 'Status',
    //     rowLength: 100,
    //     maxColumns: 10,
    // });

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = async () => {
        axios.get(`${baseUrl}/loanapplication/list`)
            .then(response => {
                console.log('response', response);
                setLoanApplications(response.data);
                // setLoanStatus(response.data.loanStatus);

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
    const classes = useStyles();

    return (
        <AppTemplate>
            <div className="all-loans-list">
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
                            {
                                LoanApps.length === 0 ?
                                    <TableRow align="center">
                                        <TableCell colSpan="5">No Loan Applications Available</TableCell>
                                    </TableRow> :
                                    LoanApps.map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell align="left">{row.applicationNo}</StyledTableCell>
                                            <StyledTableCell align="left">{row.calculationNo}</StyledTableCell>
                                            <StyledTableCell align="left">{row.loanAmount}</StyledTableCell>
                                            <StyledTableCell align="left">{row.createdDate}</StyledTableCell>
                                            <StyledTableCell align="left">{row.loanStatus.type}</StyledTableCell>
                                            <StyledTableCell align="left">
                                                <ButtonGroup>
                                                    <Link to={"all-data/" + row.id} >
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                        >
                                                            <HtmlTooltip
                                                                title={
                                                                    <React.Fragment>
                                                                        <Typography color="inherit">All data</Typography>
                                                                    </React.Fragment>
                                                                }>
                                                                <PageviewIcon />
                                                            </HtmlTooltip>
                                                        </Button>
                                                    </Link>
                                                </ButtonGroup>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </AppTemplate>
    )
}