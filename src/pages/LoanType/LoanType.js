
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Button, ButtonGroup,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid,Typography
} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import EditIcon from '@material-ui/icons/Edit';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

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



const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 700,
    },
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));


export default function LoanType() {
    const classes = useStyles();
    const [LoanTypes, setLoanTypes] = useState([]);

    console.log('Loan Types', LoanTypes);

    const fetchData = async () => {

        axios.get(`${baseUrl}/loantype/list`)
            .then(response => {
                console.log('response', response);
                setLoanTypes(response.data);
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
            }
        );

    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AppTemplate>
            <div className="loanType-list">
                <Link to={"new-loan-type"} >
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        className="new-loan-type-add-button"
                        startIcon={<CloudUploadIcon />}

                    >
                        New Loan Type
            </Button>
                </Link>
                <br /><br />
                <Grid item xs={12} sm={10}>
                    <Paper>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Loan Type</StyledTableCell>
                                        <StyledTableCell align="left">Maximum Amount</StyledTableCell>
                                        <StyledTableCell align="left">Minimum Amount</StyledTableCell>
                                        <StyledTableCell align="left">Maximum Interest Rate</StyledTableCell>
                                        <StyledTableCell align="left">Minimum Interest Rate</StyledTableCell>
                                        <StyledTableCell align="left"></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {LoanTypes.map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell align="left">{row.loanType}</StyledTableCell>
                                            <StyledTableCell align="left">{row.maxAmount}</StyledTableCell>
                                            <StyledTableCell align="left">{row.minAmount}</StyledTableCell>
                                            <StyledTableCell align="left">{row.maxInterestRate}</StyledTableCell>
                                            <StyledTableCell align="left">{row.minInterestRate}</StyledTableCell>
                                            <StyledTableCell align="left">
                                                <ButtonGroup>
                                                    <Link to={"edit-loan-type/" + row.id} >
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                      
                                                        >
                                                        {/* 
                                                        mouse hover message to edit Button           */}
                                                            <HtmlTooltip
                                                            title={
                                                                <React.Fragment>
                                                                    <Typography color="inherit">Edit Loan Type</Typography>
                                                                </React.Fragment>
                                                            }
                                                        ><EditIcon />
                                                        </HtmlTooltip>
                                                        </Button>
                                                        </Link>
                                                </ButtonGroup>
                                                {"|"}
                                                <ButtonGroup>
                                                <Link to={"view-loan-type/" + row.id} >
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                        >
                                                    {/* 
                                                    mouse hover message to view button        */}
                                                        <HtmlTooltip
                                                                title={
                                                                    <React.Fragment>
                                                                        <Typography color="inherit">View Loan Type</Typography>
                                                                    </React.Fragment>
                                                                }
                                                            >
                                                        <FolderOpenIcon />
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

                    </Paper>
                </Grid>
            </div>
        </AppTemplate>
    )
}