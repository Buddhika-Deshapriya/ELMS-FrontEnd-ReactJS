import React, { useState, useEffect } from "react"; 
import { makeStyles } from "@material-ui/core/styles";
import { Router, Switch, Route, useHistory } from 'react-router-dom';  
import 'react-toastify/dist/ReactToastify.css'; 

import LoadingSpinner from './Components/LoadingSpinner/LoadingSpinner';
import { interceptor } from './interceptor'; 
import utils from './helper/utils'; 

import HomePage from './pages/HomePage/HomePage';
import ErrorPage from './pages/ErrorPage/ErrorPage'; 
import SignIn from './pages/SignIn/SignIn';
import Profile from './pages/Profile/Profile';
import CustomerList from './pages/CustomerList/CustomerList';
import NewCustomer from './pages/NewCustomer/NewCustomer';
import LoanType from './pages/LoanType/LoanType';
import NewLoanType from './pages/NewLoanType/NewLoanType';
import EditLoanType from './pages/EditLoanType/EditLoanType';
import ViewLoanType from './pages/ViewLoanType/ViewLoanType';
import ViewCustomer from './pages/ViewCustomer/ViewCustomer';
import NewAsset from './pages/NewAsset/NewAsset';
import EditAsset from './pages/EditAsset/EditAsset';
import EditCustomer from './pages/EditCustomer/EditCustomer';
import LoanApplicationList from './pages/LoanApplicationList/LoanApplicationList';
import ViewLoanCustomerData from "./pages/CustomersOfLoan/CustomersOfLoan";
import SubmitNewApplication from "./pages/NewLoanApplication/NewLoanApplication";
import EditLoanApplication from "./pages/EditLoanApplication/EditLoanApplication";
import ViewLoanApplication from "./pages/ViewLoanApplication/ViewLoanApplication";
import Branch from './pages/Branches/Branches';
import NewBranch from './pages/NewBranch/NewBranch';
import EditBranch from './pages/EditBranch/EditBranch';
import PendingLoans from './pages/PendingLoans/PendingLoans';
import LoanResponse from './pages/LoanResponse/LoanResponse';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },   
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  
}));



export default function App (props) {
  const history = useHistory();
  const [isHideSpinner, setIsHideSpinner] = useState(0);  
  const authExList = [
    'api/user/login',
    'api/user/',
  ]; 
  
  interceptor(authExList, (authData)=>{ 
    const {loaderIsHide, redirectTo} = authData;
    setIsHideSpinner(loaderIsHide);    
    if(redirectTo!=''){
      history.push(redirectTo);
    }
  });
  
  // this way equal to componentDidMount()
  useEffect(() => {  
    setIsHideSpinner(true); 
  },[]);
  
  const { window } = props;
  const classes = useStyles();   

  const container = window !== undefined ? () => window().document.body : undefined;

  return ( 
    <Router history={history}>
      <Switch> 
        <Route exact path="/signin" component={SignIn} />
        <Route path="/" exact component={HomePage} />
        <Route path="/customer-list" exact component={CustomerList} />
        <Route path="/new-customer" exact component={NewCustomer} />
        <Route path="/loantype-list" exact component={LoanType} />
        <Route path="/new-loan-type" exact component={NewLoanType} />
        <Route path="/edit-loan-type/:id" exact component={EditLoanType} />
        <Route path="/view-loan-type/:id" exact component={ViewLoanType} />
        <Route path="/view-customer/:id" exact component={ViewCustomer} />
        <Route path="/new-asset" exact component={NewAsset} />
        <Route path="/edit-asset/:id" exact component={EditAsset} />
        <Route path="/edit-customer/:id" exact component={EditCustomer} />
        <Route path="/loan-application-list" exact component={LoanApplicationList} />
        <Route path="/new-loan-application" exact component={SubmitNewApplication} />
        <Route path="/loan-application-customer-data/:id" exact component={ViewLoanCustomerData} />
        <Route path="/edit-loan-application/:id" exact component={EditLoanApplication} />
        <Route path="/view-loan-application/:id" exact component={ViewLoanApplication} />
        <Route path="/branch-list" exact component={Branch} />
        <Route path="/edit-branch/:id" exact component={EditBranch} />
        <Route path="/new-branch" exact component={NewBranch} />
        <Route path="/pending-loan-list" exact component={PendingLoans} />
        <Route path="/new-response/:id" exact component={LoanResponse} />

        <Route component={ErrorPage} />
      </Switch>
      {isHideSpinner?'':<LoadingSpinner />}
    </Router>  
  );
}