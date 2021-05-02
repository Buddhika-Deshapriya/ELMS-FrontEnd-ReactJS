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

export default function SystemUserList() {

    const [user, setUsers] = useState([]);


    const fetchData = async () => {
        axios.get(`${baseUrl}/user/list`)
            .then(response => {
                console.log('users', response);
                setUsers(response.data);
                
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
            <div className="user-list">
                <Link to={"new-system-user"} >
                    <Button
                        variant="contained"
                        color="secondary"
                        className="new-user-add-button"
                        startIcon={<CloudUploadIcon />}

                    >
                        New User
                    </Button>
                </Link>
                <br /><br /><br />
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Mobile No</StyledTableCell>
                                <StyledTableCell align="left">NIC No</StyledTableCell>
                                <StyledTableCell align="left">Email</StyledTableCell>
                                <StyledTableCell align="left">User Name</StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                user.length === 0 ?
                                    <TableRow align="center">
                                        <TableCell colSpan="5">No Users Available</TableCell>
                                    </TableRow> :
                                    
                                        user.map((row) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.firstName}{" "}{row.middleName}{" "}{row.lastName}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{row.mobile}</StyledTableCell>
                                                <StyledTableCell align="left">{row.nic}</StyledTableCell>
                                                <StyledTableCell align="left">{row.email}</StyledTableCell>
                                                <StyledTableCell align="left">{row.userName}</StyledTableCell>
                                                <StyledTableCell align="left">
                                                <ButtonGroup>
                                                    <Link to={"edit-user/" + row.id} >
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                        >
                                                            <HtmlTooltip
                                                                title={
                                                                    <React.Fragment>
                                                                        <Typography color="inherit">Edit User</Typography>
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
                                                <Link to={"view-system-user/" + row.id} >
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                        >
                                                            <HtmlTooltip
                                                                title={
                                                                    <React.Fragment>
                                                                        <Typography color="inherit">View User Profile</Typography>
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
                                        ))
                                    }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </AppTemplate>
    )
}