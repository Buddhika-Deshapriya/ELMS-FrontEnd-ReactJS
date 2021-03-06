import React, { Component } from "react";
import {
  Card, CardActions, CardContent, Container

} from '@material-ui/core';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SystemUser from "../../helper/user";

import AppTemplate from "../Templates/AppTemplate/AppTemplate";
import { appConfig } from '../../configs/app.config';
import utils from '../../helper/utils';
const { baseUrl } = appConfig;

export default class OrderView extends Component {
  constructor(props) {

    super(props);
    this.state = {

    };

  }
  componentDidMount() {
    this.getUserDetails();

  }

  getUserDetails() {
    console.log(SystemUser.get())
    if (SystemUser.get() != null) {
      this.setState({
        id: SystemUser.get().id,
        firstName: SystemUser.get().firstName,
        middleName: SystemUser.get().middleName,
        lastName: SystemUser.get().lastName,
        email: SystemUser.get().email,
        username: SystemUser.get().username,


      });

    }

  };

  render() {
    const { firstName, middleName, lastName, email, username } = this.state;
    return (
      <AppTemplate >
        <Container maxWidth="sm" style={{ float: "left" }}>
          <Card variant="outlined">
            <CardContent>
              <List >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={firstName + " " + middleName + " " + lastName} secondary="Full Name" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={email} secondary="Email Address" />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PermIdentityIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={username} secondary="User Name" />
                </ListItem>
              </List>
            </CardContent>
            <CardActions>

            </CardActions>
          </Card>
        </Container>

      </AppTemplate>
    )
  }
}