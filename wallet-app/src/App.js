import React, { Component } from 'react';
import { Button, Container } from 'reactstrap'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navigator from './components/Navigator'
import Home from './components/smart/Home'
import AccountBalance from './components/smart/AccountBalance'
import SendTransaction from './components/smart/SendTransaction'
import CreateWallet from './components/smart/WalletCreation'
import OpenWallet from './components/smart/OpenWallet'

import PrivateRoute from './components/ProtectedRoute'
import ModifiedRoute from './components/ModifiedRoute'


class App extends Component {

  render() {
    const wallet = window.sessionStorage.getItem('wallet')
    return (
      <Router>
        <div>
          <Navigator />
          <div style={{ height: '98vh'}}>
            <Switch>
              <Route exact path='/' component={Home} />
              <ModifiedRoute path='/open-existing-wallet' component={OpenWallet} />
              <PrivateRoute path='/account-balance' component={AccountBalance} />
              <PrivateRoute path='/send-transaction' component={SendTransaction} />
              <ModifiedRoute path='/create-wallet' component={CreateWallet} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
