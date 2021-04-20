import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { makeStyles, withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { green, purple } from '@material-ui/core/colors';

import {
    Button, Paper, Grid, InputLabel, Select, FormControl, TextField, Typography,
    FormHelperText, MenuItem, Card, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, ButtonGroup,

} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import SendIcon from '@material-ui/icons/Send';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
import SystemUser from "../../helper/user";

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
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing(1, 1, 1, 1),
    },

    formControl: {
        margin: theme.spacing(1),
        width: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    margin: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 1000,
    },
    width: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: 700,
    },
    spacing: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    Typography: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    table: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
        maxWidth: 1200,
    },

}));
const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}))(Button);

const BootstrapButton = withStyles({
    root: {
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#0063cc',
        borderColor: '#0063cc',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
    },
})(Button);

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

export default function LoanCashRelease(props) {

    const history = useHistory();

    const loanApplicationId = props.match.params.id

    const classes = useStyles();
    const [loanStatus, setLoanStatus] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());
    const [userId, setUserID] = useState([]);

    const [loanApplication, ViewLoanApplication] = useState([]);
    const [applicationResponse, ViewLoanApplicationResponse] = useState([]);
    const [directorResponse, ViewDirectorResponse] = useState([]);

    const [genVoucherNo, setVoucherNo] = useState([]);

    const fetchLoanApplicationData = async (loanApplicationId) => {
        axios.get(`${baseUrl}/loanapplication/list/` + loanApplicationId)
            .then(response => {
                console.log('response', response);
                ViewLoanApplication(response.data);
                ViewLoanApplicationResponse(response.data.loanApplicationResponses);
                ViewDirectorResponse(response.data.loanApplicationDirectorResponses);    

            })
    };

    //Setup initial State
    const initCash = {
        releaseAmount: null,
        description: null,
        voucherNo: null,
    }
    const onChange = (e) => {
        //  e.persist();
        setCashRelease({ ...cashRelease, [e.target.name]: e.target.value });
    }

    //Get Common Status
    const fetchLoanStatus = async () => {
        axios.get(`${baseUrl}/loanstatus/list`)
            .then(response => {
                console.log('status', response);
                setLoanStatus(response.data);
            })
    };

    //Get Logged in user id
    const getCurrentUser = async () => {
        //console.log(SystemUser.get())
        setUserID(SystemUser.get().id);
    };

    //Get Loan cash release voucher generated id
  const fetchLoanCashReleaseGenVoucherNo = async () => {
    axios.get(`${baseUrl}/loancashreleasevoucheridgen/takeid`)
      .then(response => {
        console.log('Generated No', response);
        setVoucherNo(response.data[0]);
      })
  }

    const [cashRelease, setCashRelease] = useState(initCash);
    const resetData = () => {
        setCashRelease(initCash)
    }

    //Error Handling
    const initErrors = {
        voucherNo: '',
        releaseAmount: '',
        description: '',
    }

    const [errors, setErrors] = useState(initErrors);
    const resetError = () => {
        setErrors(initErrors)
    }

    const SubmitNewCashRelease = (e) => {
        e.preventDefault();
        const data = {
            voucherNo: genVoucherNo.voucherNo,
            description: cashRelease.description,
            loanStatus: {
                id: cashRelease.loanStatus,
            },
            releaseAmount: cashRelease.releaseAmount    ,
            loanApplicationsList: [
                {
                    id: loanApplicationId,
                }
            ],
            createdDate: dateTime,
            createdUser: {
                id: userId,
            },
        };

        console.log('data-set', data);
        axios.post(`${baseUrl}/loancashrelease/add`, data)
            .then(function (response) {
                console.log(response)
                utils.showSuccess("Transaction Completed Successfully.");
            })
            .catch(_errors => {
                //console.log('_errors',_errors);
                if (_errors.response) {
                    //console.log('Test');
                    const _sErrors = _errors.response.data.errors;
                    const _error = _errors.response.data.error;
                    if (_sErrors !== undefined) {
                        let errorsObj = {}
                        _sErrors.forEach(error => {
                            const { defaultMessage, field } = error
                            errorsObj[field] = defaultMessage;
                        })
                        setErrors({ ...errors, ...errorsObj });
                    }
                    else {
                        utils.showError(_error)
                    }
                }
            });
    };

    //This is same as componentdidmount()
    useEffect(() => {
        fetchLoanCashReleaseGenVoucherNo();
        fetchLoanStatus();
        getCurrentUser();
        fetchLoanApplicationData(loanApplicationId);
    }, []);

    return (
        <AppTemplate>
            <div className="cash-release">
                <Paper variant="outlined">
                    <Typography variant="H2" component="H2" className={classes.Typography}>
                        LOAN APPLICATION DETAILS
                            </Typography>
                    <br />
                    <Grid container spacing={5} className={classes.spacing}>
                        <Grid item xs={2}>
                            <TextField
                                name="applicationNo"
                                value={loanApplication.applicationNo}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Application No"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                name="calculationNo"
                                value={loanApplication.calculationNo}
                                className={classes.textField}
                                id="outlined-full-width"
                                helperText="Calculation No"
                                size="medium"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <br />
                <Paper variant="outlined" >
                    <Typography variant="H2" component="H2" className={classes.Typography}>
                        MANAGER RESPONSE DETAILS
                            </Typography>
                    <br />
                    <Grid>
                        <TableContainer className={classes.spacing} >
                            <Table className={classes.table} aria-label="customized table" >
                                <TableHead>
                                    <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                        <StyledTableCell>Loan Status</StyledTableCell>
                                        <StyledTableCell>Accepted Amount</StyledTableCell>
                                        <StyledTableCell align="left">Description</StyledTableCell>
                                        <StyledTableCell align="left">Responsed Date</StyledTableCell>
                                        <StyledTableCell align="left">Manager Name</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        applicationResponse.length === 0 ?
                                            <TableRow align="center">
                                                <TableCell colSpan="5">No Manager Approvals</TableCell>
                                            </TableRow> :
                                            applicationResponse.map((row) => (
                                                <StyledTableRow key={row.id}>
                                                    <StyledTableCell align="left">{row.loanStatus.type}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.acceptedAmount}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.description}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.createdDate}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">
                                                        {row.createdUser.firstName}{" "}{row.createdUser.middleName}{" "}{row.createdUser.lastName}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Paper>
                <br />
                <Paper variant="outlined" >
                    <Typography variant="H2" component="H2" className={classes.Typography}>
                        Director RESPONSE DETAILS
                            </Typography>
                    <br />
                    <Grid>
                        <TableContainer className={classes.spacing} >
                            <Table className={classes.table} aria-label="customized table" >
                                <TableHead>
                                    <TableRow style={{ backgroundColor: '#2196f3', color: '#fafafa' }} variant="head">
                                        <StyledTableCell>Loan Status</StyledTableCell>
                                        <StyledTableCell>Accepted Amount</StyledTableCell>
                                        <StyledTableCell align="left">Description</StyledTableCell>
                                        <StyledTableCell align="left">Responsed Date</StyledTableCell>
                                        <StyledTableCell align="left">Director Name</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        directorResponse.length === 0 ?
                                            <TableRow align="center">
                                                <TableCell colSpan="5">No Director Approvals</TableCell>
                                            </TableRow> :
                                            directorResponse.map((row) => (
                                                row.loanStatus.type == "Released" ?
                                                <StyledTableRow key={row.id}>
                                                    <StyledTableCell align="left">{row.loanStatus.type}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.acceptedAmount}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.description}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.createdDate}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">
                                                        {row.createdUser.firstName}{" "}{row.createdUser.middleName}{" "}{row.createdUser.lastName}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                                :
                                                null
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Paper>
                <br />
                <form autoComplete="off" onSubmit={SubmitNewCashRelease}>
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Paper variant="outlined" >
                                <Card width="500">
                                    <Card width="500">
                                    <TextField
                                            name="voucherNo"
                                            id="outlined-helperText"
                                            label="Voucher No"
                                            variant="outlined"
                                            value = {genVoucherNo.voucherNo}
                                            helperText={errors.voucherNo}
                                            error={errors.voucherNo ? 'error' : ''}
                                            style={{ margin: 8 }}
                                            size="small"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <br/>
                                        <TextField
                                            name="releaseAmount"
                                            id="outlined-helperText"
                                            label="Release Amount"
                                            placeholder="Enter Amount"
                                            variant="outlined"
                                            helperText={errors.releaseAmount}
                                            error={errors.releaseAmount ? 'error' : ''}
                                            style={{ margin: 8 }}
                                            size="small"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={onChange}
                                        />
                                        <br />
                                        <TextField
                                            name="description"
                                            id="outlined-multiline-static"
                                            label="Description"
                                            placeholder="Enter Description"
                                            helperText={errors.description}
                                            error={errors.description ? 'error' : ''}
                                            multiline
                                            rows={4}
                                            className={classes.width}
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={onChange}
                                        />
                                    </Card>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink >
                                            Status
                                     </InputLabel>
                                        <FormHelperText>{errors.loanStatus}</FormHelperText>
                                        <Select
                                            name="loanStatus"
                                            variant="outlined"
                                            displayEmpty
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            error={errors.loanStatus ? 'error' : ''}
                                            onChange={onChange}
                                        >
                                            <MenuItem value="" disabled>

                                            </MenuItem>
                                            {
                                                loanStatus.map((eachRow, index) => {
                                                    if (eachRow.id == 1 && eachRow.id == 4 ){ 
                                                        return (
                                                            <MenuItem display="none" value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                        );
                                                    }else{
                                                        return (
                                                            <MenuItem display="none" value={eachRow.id} key={eachRow.id}>{eachRow.type}</MenuItem>
                                                        );
                                                    } 
                                                })
                                                
                                            }
                                        </Select>
                                    </FormControl>
                                </Card>
                            </Paper>
                            <br />
                            <Paper variant="outlined" className={classes.width}  >
                                <div>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        endIcon={<SendIcon />}
                                    >
                                        Transfer
                                    </Button>
                                    <ColorButton variant="contained" color="secondary" type="reset" startIcon={<RotateLeftIcon />} onClick={resetError}>
                                        <b>Reset</b>
                                    </ColorButton>
                                    {" "}
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        onClick={() => history.goBack()}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </AppTemplate>
    )
}