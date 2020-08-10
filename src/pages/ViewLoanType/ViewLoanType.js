import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
const { baseUrl } = appConfig;



const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 16,
    },

    pos: {
        marginBottom: 12,
    },
});

export default function ViewLoanType(props) {

    const classes = useStyles();
    const [LoanType, ViewLoanType] = useState([]);
    const [status, ViewStatus] = useState([]);
    //console.log('Loan Types', LoanType);
    // console.log('props', props);
    const loanTypeId = props.match.params.id;

    const fetchLoanTypeData = async (loanTypeId) => {

        axios.get(`${baseUrl}/loantype/list/` + loanTypeId)
            .then(response => {
                // console.log('response', response);
                ViewLoanType(response.data);
                ViewStatus(response.data.status);
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
        fetchLoanTypeData(loanTypeId);
    }, []);

    return (
        <AppTemplate>
            <div className="order-view">
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Loan Type is:
                     </Typography>
                    <Typography variant="h5" component="h2">
                        {LoanType.loanType} Loan
                     </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Description of the loan type:
                     </Typography>
                    <Typography variant="body1" component="p">
                        {LoanType.description}
                    </Typography>
                    <br />
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Status:
                     </Typography>
                    <Typography variant="h6" component="h6">
                    {/* {
                          LoanType.map((row) => (
                            row.status.type
                          ))
                    } */}
                    {status.type == "active" ? <ThumbUpIcon /> : <ThumbDownIcon /> }
                    </Typography>
                </CardContent>
            </Card>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Loan Type is:
                     </Typography>
                    <Typography variant="h5" component="h2">
                        
                     </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Description of the loan type:
                     </Typography>
                    <Typography variant="body2" component="p">
                       
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Status:
                     </Typography>
                    <Typography variant="h6" component="h6">
                        
                    </Typography>
                </CardContent>
            </Card>
            </div>

        </AppTemplate>
    );

}