import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
    TableHead, TableRow, TableCell, TableContainer, Table, TableBody, Card, CardContent, Typography, CardActionArea, Paper, Grid, ListItem, ListItemAvatar, Avatar, ListItemText
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import EmailIcon from '@material-ui/icons/Email';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import CallIcon from '@material-ui/icons/Call';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PersonIcon from '@material-ui/icons/Person';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
const { baseUrl } = appConfig;

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#8bc34a',
        color: theme.palette.common.black,
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
        width: 500,
    },
    width: {
        '& > *': {
            margin: theme.spacing(1),
            maxWidth: 300,
        },
    },
    button: {
        margin: theme.spacing(1, 1, 1, 1),
    },
    title: {
        fontSize: 16,
    },
    card: {
        width: 800,
    },
}));

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
});

export default function ViewSystemUser(props) {

    const history = useHistory();

    const classes = useStyles();
    const [user, ViewUser] = useState([]);
    const [roles, ViewUserRoles] = useState([]);

    const systemUserId = props.match.params.id;

    const fetchSystemUserData = async (systemUserId) => {

        axios.get(`${baseUrl}/user/list/` + systemUserId)
            .then(response => {
                console.log('response', response);
                ViewUser(response.data);
                ViewUserRoles(response.data.roles)
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
        fetchSystemUserData(systemUserId);
    }, []);

    return (
        <AppTemplate>
            <div className="view-system-user">
                <Card variant="outlined" className={classes.card}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <CardContent>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <AccountCircleIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={user.firstName + " " + user.middleName + " " + user.lastName} secondary="Full Name" />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <EmailIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={user.email} secondary="Email Address" />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <CallIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={user.mobile} secondary="Mobile No" />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={user.username} secondary="User Name" />
                                </ListItem>
                            </CardContent>
                        </Grid>
                        <Grid item xs={6}>
                            <CardContent>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <LocationOnIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={user.address} secondary="Address" />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PermIdentityIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={user.nic} secondary="NIC" />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <CalendarTodayIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={user.dob} secondary="Date of Birth" />
                                </ListItem>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
                <br />
                <Grid>
                    <TableContainer component={Paper} className={classes.root}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow style={{ backgroundColor: 'green', color: 'black' }} variant="head">
                                    <StyledTableCell align="left">Role No</StyledTableCell>
                                    <StyledTableCell align="left">Role</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles.length === 0 ?
                                    <TableRow align="center">
                                        <TableCell colSpan="5">No Roles Available</TableCell>
                                    </TableRow> :
                                    roles.map((row) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell align="left">{row.id}</StyledTableCell>
                                            <StyledTableCell align="left">{row.name}</StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <br />
                <Grid>
                    <Paper className={classes.root}>
                        <div>
                            <ButtonGroup disableFocusRipple className={classes.button}>
                                <Link to={"/edit-user/" + systemUserId.id} >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                    >
                                        <EditIcon fontSize="small" />
                            Edit
                            </Button>
                                </Link>
                            </ButtonGroup>
                            {" "}
                            <ButtonGroup>
                                <Link >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        onClick={() => history.goBack()}
                                    >
                                        <ArrowBackIosIcon fontSize="small" />
                                        Back
                                    </Button>
                                </Link>
                            </ButtonGroup>
                        </div>
                    </Paper>
                </Grid>
            </div>

        </AppTemplate>
    );

}