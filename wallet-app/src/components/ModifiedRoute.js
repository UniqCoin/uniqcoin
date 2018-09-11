import React, { Component } from 'react'
import { Redirect, Route } from 'react-router-dom'

class ModifiedRoute extends Component {
  render() {
    const wallet = window.sessionStorage.getItem('wallet')
    return (
      <Route path={`${this.props.path}`} component={() => {
        if (wallet) {
          return (<Redirect to="/" />)
        }
        return <Route {...this.props} />
      }} />
    )
  }
}

export default ModifiedRoute