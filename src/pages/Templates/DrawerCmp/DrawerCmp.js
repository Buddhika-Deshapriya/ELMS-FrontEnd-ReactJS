import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer, List, ListItem,
  ListItemIcon, ListItemText,
  Hidden, Divider
} from '@material-ui/core';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Link } from "react-router-dom";

import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import MoneyIcon from '@material-ui/icons/Money';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AssessmentIcon from '@material-ui/icons/Assessment';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Axios from 'axios';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawerPaper: {
    width: drawerWidth
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,

}));


export default function DrawerCmp(props) {

  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  const classes = useStyles();

  const theme = props.theme;

  useEffect(() => {
  }, []);

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <Link to="/" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItem>
        </Link>
        <Divider />
        <Link to="/loan-application-list" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <FormatAlignJustifyIcon />
            </ListItemIcon>
            <ListItemText primary={"New Loan"} />
          </ListItem>
        </Link>

        <Divider />
        <Link to="/loantype-list" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <MoneyIcon />
            </ListItemIcon>
            <ListItemText primary={"Loan Types"} />
          </ListItem>
        </Link>

        <Link to="/customer-list" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={"Customer"} />
          </ListItem>
        </Link>
        <Divider />
        <ListSubheader inset>Loan applications</ListSubheader>
        <Divider />
        <Link to="/pending-loan-list" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <ThumbsUpDownIcon />
            </ListItemIcon>
            <ListItemText primary={"Pending loans"} />
          </ListItem>
        </Link>
        <Link to="/approved-loan-list" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <CheckCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Approved loans"} />
          </ListItem>
        </Link>
        <Link to="/to-cash-release-list" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary={"Cash Release"} />
          </ListItem>
        </Link>
        <Link to="/all-loans-list" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary={"All Loans"} />
          </ListItem>
        </Link>
        <Divider />
        <ListSubheader inset>System settings</ListSubheader>
        <Link to="/branch-list" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary={"Branches"} />
          </ListItem>
        </Link>
        <Link to="/order" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"System Users"} />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <ListSubheader inset>Saved reports</ListSubheader>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <TrendingUpIcon />
        </ListItemIcon>
        <ListItemText primary="Year-end Income" />
      </ListItem>
    </div>
  );

  const handleDrawerToggle = () => {
    props.toggleDrawerHandler();
  };

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={props.open}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}