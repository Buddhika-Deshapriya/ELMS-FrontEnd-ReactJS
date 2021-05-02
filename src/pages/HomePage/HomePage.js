import React, { useEffect } from 'react';

import AppTemplate from '../Templates/AppTemplate/AppTemplate';
import { appConfig } from '../../configs/app.config';

import {
  Button, Paper, Grid, TextField, InputLabel, Select, FormControl,
  FormHelperText, MenuItem
} from '@material-ui/core';

import logo from './coop test2.jpg';
import utils from '../../helper/utils';
import { Height } from '@material-ui/icons';
const { baseUrl } = appConfig;


export default function HomePage(props) {
  return (
      <AppTemplate>
        <div className="home-page">
        {/* <h1> Home page.</h1> */}
        <Grid>
          <img src={logo} width="1400" />
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            
          </Grid>
        </Grid>
        </div>
      </AppTemplate>
  )
}