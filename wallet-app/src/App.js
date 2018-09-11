import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navigator from './components/Navigator'
import Home from './components/smart/Home'
import OpenWallet from './components/smart/OpenWallet'
import Account from './components/smart/Account'
import Balance from './components/smart/Balance'
import SendTransaction from './components/smart/SendTransaction'
import CreateWallet from './components/smart/WalletCreation'
import PrivateRoute from './components/ProtectedRoute'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigator/>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/open-existing-wallet' component={OpenWallet}/>
            <PrivateRoute path='/account' component={Account}/>
            <PrivateRoute path='/balance' component={Balance}/>
            <Route path='/send-transaction' component={SendTransaction}/>
            <Route path='/create-wallet' component={CreateWallet}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
