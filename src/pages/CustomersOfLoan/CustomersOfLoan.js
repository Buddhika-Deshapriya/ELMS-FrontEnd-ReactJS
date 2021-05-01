import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Tooltip, Button,
} from '@material-ui/core';
import { Grid, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { ThemeProvider } from '@material-ui/styles';

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
    root: {
        maxWidth: 450,
    },
    width: {
        width: 350,
    },
    title: {
        fontSize: 16,
    },
    pos: {
        marginBottom: 12,
    },
    table: {
        maxWidth: 500,
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

export default function ViewLoanCustomerData(props) {

    const history = useHistory();

    const classes = useStyles();
    const [CustomersData, ViewCustomerData] = useState([]);
    const CustomerId = props.match.params.id;

    const fetchLoanCustomerData = async (CustomerId) => {

        axios.get(`${baseUrl}/loanapplication/list/` + CustomerId)
            .then(response => {
                console.log('response', response);
                ViewCustomerData(response.data.customers);
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
        fetchLoanCustomerData(CustomerId);
    }, []);

    return (
        <AppTemplate>
            <div className="loan-application-customer-data">
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                        <TableContainer component={Paper} className={classes.table}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                        <StyledTableCell>Membership No</StyledTableCell>
                                        <StyledTableCell align="left">Customer Name</StyledTableCell>
                                        <StyledTableCell align="left">NIC No</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        CustomersData.length === 0 ?
                                            <TableRow align="center">
                                                <TableCell colSpan="5">No Customers Available</TableCell>
                                            </TableRow> :

                                            CustomersData.map((row) => (
                                                <StyledTableRow key={row.id}>
                                                    <StyledTableCell>
                                                        <Link to={"/view-customer/" + row.id}>
                                                            <ThemeProvider theme={theme}>
                                                                <Typography color="primary">
                                                                    {row.membership_no}
                                                                </Typography>
                                                            </ThemeProvider>

                                                        </Link>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">{row.first_name}{" "} {row.middle_name}{" "}{row.last_name}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.nic}</StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br />
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={() => history.goBack()}
                        >
                            Back
                         </Button>
                    </Grid>
                </Grid>
            </div>

        </AppTemplate>
    );

}