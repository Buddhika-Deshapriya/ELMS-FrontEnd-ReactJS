import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
    Button, ButtonGroup,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid, Container
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import EditIcon from '@material-ui/icons/Edit';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import './LoanApplicationList.css'


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

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
    title: {
        fontSize: 16,
    },
});

export default function LoanApplicationList() {

    const [LoanApplication, setLoanApplications] = useState([]);
    const [CustomerData, setCustomerData] = useState([]);


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
                setCustomerData(response.data[0].customers);

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
            <div className="loan-application-list">
                <Link to={"/new-loan-application"} >
                    <Button
                        variant="contained"
                        color="secondary"
                        className="new-loan-application-add-button"
                        startIcon={<CloudUploadIcon />}

                    >
                        New application
                    </Button>
                </Link>
                <br /><br /><br />
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                <StyledTableCell>Application No</StyledTableCell>
                                <StyledTableCell align="left">Amount</StyledTableCell>
                                <StyledTableCell align="left">Date</StyledTableCell>
                                <StyledTableCell align="left">Status</StyledTableCell>
                                <StyledTableCell align="left">Description</StyledTableCell>
                                <StyledTableCell align="left">Approved Amount</StyledTableCell>
                                <StyledTableCell>See Customers</StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                LoanApplication.length === 0 ?
                                    <TableRow align="center">
                                        <TableCell colSpan="5">No Loan Applications Available</TableCell>
                                    </TableRow> :

                                    LoanApplication.map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell align="left">{row.applicationNo}</StyledTableCell>
                                            <StyledTableCell align="left">{row.loanAmount}</StyledTableCell>
                                            <StyledTableCell align="left">{row.createdDate}</StyledTableCell>
                                            <StyledTableCell align="left">{}</StyledTableCell>
                                            <StyledTableCell align="left">{row.description}</StyledTableCell>
                                            <StyledTableCell align="left">{}</StyledTableCell>

                                            <StyledTableCell align="left">
                                              <Link to={"loan-application-customer-data/" + row.id} >
                                                        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                                                    <SupervisorAccountIcon />
                                                </Button>
                                                </Link>
                                            </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    <ButtonGroup>
                                                        <Link to={"/edit-loan-application/" + row.id} >
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                        >
                                                            <HtmlTooltip
                                                                title={
                                                                    <React.Fragment>
                                                                        <Typography color="inherit">Edit Application</Typography>
                                                                    </React.Fragment>
                                                                }
                                                            >
                                                                <EditIcon />

                                                            </HtmlTooltip>
                                                        </Button>

                                                        </Link>
                                                    </ButtonGroup>
                                                    {"|"}
                                                    <ButtonGroup>
                                                        {/* <Link to={"view-customer/" + row.id} > */}
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                        >
                                                            <HtmlTooltip
                                                                title={
                                                                    <React.Fragment>
                                                                        <Typography color="inherit">View Application</Typography>
                                                                    </React.Fragment>
                                                                }
                                                            >
                                                                <FolderOpenIcon />
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