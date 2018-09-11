import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { BrowserRouter as Router, Route, Switch,Redirect } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navigator from './components/Navigator'
import Home from './components/smart/Home'
import OpenWallet from './components/smart/OpenWallet'
import Account from './components/smart/Account'
import Balance from './components/smart/Balance'
import SendTransaction from './components/smart/SendTransaction'
import CreateWallet from './components/smart/WalletCreation'
import RecoverWallet from './components/smart/RecoverWallet'

import PrivateRoute from './components/ProtectedRoute'
import ModifiedRoute from './components/ModifiedRoute'


class App extends Component {
  
  render() {
    const wallet = window.sessionStorage.getItem('wallet')
    return (
      <Router>
        <div>
          <Navigator/>
          <Switch>
            <Route exact path='/' component={Home} />
            <ModifiedRoute path='/open-existing-wallet' component={OpenWallet}/>
            <PrivateRoute path='/account' component={Account}/>
            <PrivateRoute path='/balance' component={Balance}/>
            <PrivateRoute path='/send-transaction' component={SendTransaction}/>
            <ModifiedRoute path='/create-wallet' component={CreateWallet}/>
            <ModifiedRoute path='/recover-wallet' component={RecoverWallet}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
