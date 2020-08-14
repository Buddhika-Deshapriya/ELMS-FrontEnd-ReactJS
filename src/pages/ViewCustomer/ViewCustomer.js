import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import BackupIcon from '@material-ui/icons/Backup';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PhotoCamera from '@material-ui/icons/PhotoCamera';



import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import { Grid, Paper, Box, Table, TableBody } from '@material-ui/core';
const { baseUrl } = appConfig;



const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1000,
    },
    width: {
        '& > *': {
            margin: theme.spacing(1),
            maxWidth: 300,
        }
    },
    title: {
        fontSize: 16,
    },
    pos: {
        marginBottom: 12,
    },
    input: {
        display: 'none',
    }
}));

export default function ViewCustomer(props) {


    const classes = useStyles();
    const [Customer, ViewCustomer] = useState([]);
    const [status, ViewStatus] = useState([]);
    const [user, ViewUser] = useState([]);
    const [membershiptype, ViewMembershipType] = useState([]);
    const [title, ViewTitle] = useState([]);
    const [gender, ViewGender] = useState([]);
    const [marriedStatus, ViewMarriedStatus] = useState([]);
    const [familyType, ViewFamilyType] = useState([]);

    const customerId = props.match.params.id;

    const fecthCustomerData = async (customerId) => {

        axios.get(`${baseUrl}/customer/list/` + customerId)
            .then(response => {
                // console.log('response', response);
                ViewCustomer(response.data);
                ViewStatus(response.data.customerStatus);
                ViewUser(response.data.createdUser);
                ViewMembershipType(response.data.membershipType);
                ViewTitle(response.data.title);
                ViewGender(response.data.gender);
                ViewMarriedStatus(response.data.marriedStatus);
                ViewFamilyType(response.data.familyType);
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
        fecthCustomerData(customerId);
    }, []);

    return (
        <AppTemplate>
            <div className="customer-view">
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Box className={classes.width}>
                            <Card className={classes.width} variant="outlined">
                                <CardContent>
                                    <Typography>
                                        "Scanned images of NIC card"
                                    </Typography>
                                    <Typography>

                                    </Typography>

                                </CardContent>
                            </Card>
                            <br />
                            {/* 
                        upload link to inndividual customer NIC images in both sides              */}
                            <Card className={classes.width} variant="outlined">
                                <CardContent>
                                    <Typography>
                                        <input
                                            accept="image/*"
                                            className={classes.input}
                                            id="contained-button-file"
                                            multiple
                                            type="file"
                                        />
                                        <label htmlFor="contained-button-file">
                                            <br />
                                        </label>
                                        <input accept="image/*" className={classes.width} id="icon-button-file" type="file" />
                                        <input accept="image/*" className={classes.width} id="icon-button-file" type="file" />
                                        <label htmlFor="icon-button-file">
                                            <br />
                                            <Button variant="contained" color="primary" component="span">
                                                <BackupIcon fontSize="small" />
                                            Upload
                                            </Button>
                                        </label>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper className={classes.root}>
                            {/* 
                            Customer name, address and email details             */}
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="H5" component="h2" >
                                                {title.type}{". "}
                                                {Customer.first_name}{" "}
                                                {Customer.middle_name}{" "}
                                                {Customer.last_name}
                                            </Typography>
                                            <br />
                                            <Typography variant="h6" component="h2">
                                                from : {Customer.address}
                                            </Typography>
                                            <Typography variant="h6" component="h2" >
                                                email: {Customer.email}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                {/* 
                                Created user and created         */}
                                <Grid item xs={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                Created By:
                                            </Typography>
                                            <Typography variant="h5" component="h2">
                                                {user.firstName} {" "}
                                                {user.middleName} {" "}
                                                {user.lastName}
                                            </Typography>
                                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                Created Date:
                                            </Typography>
                                            <Typography variant="body1" component="p">
                                                {Customer.createdDate}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            {/* 
                            Membership details card            */}
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Box className={classes.width} >
                                        <Card className={classes.width} variant="outlined">
                                            <CardContent>
                                                <Box>
                                                    <Typography variant="H6" component="h2" color="secondary">
                                                        Membership Details :
                                            </Typography>
                                                    <br />
                                                </Box>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    Membership No:
                                        </Typography>
                                                <Typography variant="h5" component="h2">
                                                    {Customer.membership_no}
                                                </Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    Membership Type:
                                        </Typography>
                                                <Typography variant="h5" component="h2">
                                                    {membershiptype.type}
                                                </Typography>
                                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                    Status:
                                        </Typography>
                                                <Typography variant="body1" component="p">
                                                    {status.type == "ACTIVE" ? <ThumbUpIcon color="primary" /> : <ThumbDownIcon color="secondary" />}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Grid>
                                {/* 
                                Personal details table of a customer */}
                                <Grid item xs={8}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Gender:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {gender.type}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        NIC No:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {Customer.nic}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Date of birth:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {Customer.dob}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Mobile No:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {Customer.mobile}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Telephone No:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {Customer.telephone}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Married Status:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {marriedStatus.type}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Family Type:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {familyType.type}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Total Members:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {Customer.total_members}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Customer Income:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {Customer.income}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Family income:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {Customer.familyIncome}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                        Passport No:
                                                    </Typography>
                                                    <Typography variant="body1" component="h2">
                                                        {Customer.passport}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </Paper>
                        <br />
                        {/* 
                        Edit button and back button */}
                        <Grid>
                            <Paper className={classes.width}>
                                <ButtonGroup>
                                    <Link>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}

                                        >
                                            <EditIcon fontSize="small" />
                                        Edit
                                        </Button>
                                        {" "}
                                        <ButtonGroup>
                                            <Link to={"/customer-list"} >
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    className={classes.button}

                                                >
                                                    <ArrowBackIosIcon fontSize="small" />
                                        Back
                                    </Button>
                                            </Link>
                                        </ButtonGroup>
                                    </Link>
                                </ButtonGroup>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>

        </AppTemplate >
    );

}