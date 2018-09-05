import React, { Component } from 'react'
import { Redirect, Route} from 'react-router-dom'

class PrivateRoute extends Component {
  render() {
    const existingWallet = window.localStorage.getItem('jsonWallet')
    if (existingWallet) return <Route {...this.props} />
    return <Redirect to="/" />
  }
}

export default PrivateRoute