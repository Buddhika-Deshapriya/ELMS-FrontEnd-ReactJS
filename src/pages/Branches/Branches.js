
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
    Button, ButtonGroup,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Grid, Container, Popover, Typography
} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import EditIcon from '@material-ui/icons/Edit';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

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
        Width: 1200,
    },
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));


export default function Branch() {
    const classes = useStyles();
    const [Branch, setBranch] = useState([]);

    console.log('Branches', Branch);

    const fetchData = async () => {

        axios.get(`${baseUrl}/branch/list`)
            .then(response => {
                console.log('response', response);
                setBranch(response.data);
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
            <div className="branch-list">
                <Link to={"new-branch"} >
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        className="new-branch-add-button"
                        startIcon={<CloudUploadIcon />}

                    >
                        New Branch
            </Button>
                </Link>
                <br /><br />
                <Grid item xs={12} >
                    <Paper>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Branch Code</StyledTableCell>
                                        <StyledTableCell align="left">Branch Name</StyledTableCell>
                                        <StyledTableCell align="left">Branch Address</StyledTableCell>
                                        <StyledTableCell align="left">Status</StyledTableCell>
                                        <StyledTableCell align="left"></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Branch.map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell align="left">{row.branchCode}</StyledTableCell>
                                            <StyledTableCell align="left">{row.branchName}</StyledTableCell>
                                            <StyledTableCell align="left">{row.branchAddress}</StyledTableCell>
                                            <StyledTableCell align="left">{row.branchStatus.type == "ACTIVE" ? <ThumbUpIcon color="primary" /> : <ThumbDownIcon color="secondary" />}</StyledTableCell>
                                            <StyledTableCell align="left">
                                                <ButtonGroup>
                                                    <Link to={"edit-branch/" + row.id} >
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"

                                                        >
                                                            {/* 
                                                        mouse hover message to edit Button           */}
                                                            <HtmlTooltip
                                                                title={
                                                                    <React.Fragment>
                                                                        <Typography color="inherit">Edit Details</Typography>
                                                                    </React.Fragment>
                                                                }
                                                            ><EditIcon />
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