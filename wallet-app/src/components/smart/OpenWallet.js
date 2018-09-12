import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap';
import OpenWalletForm from '../dumb/forms/OpenWalletForm'
import Wallet from '../../models/Wallet'
import WalletDataForm from '../dumb/forms/WalletDataForm'
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";

const styles = {
  container: {
    height: '100%',
    paddingTop: '10%'
  }
}

class OpenWallet extends Component {
  constructor(props) {
    super(props)
    this.state = { privateKey: ''}
    this.changeKey = this.changeKey.bind(this)
    this.openWallet = this.openWallet.bind(this)
  }

  changeKey(val) {
    this.setState({ privateKey: val })
  }

  setSessionItem(field, item) {
    sessionStorage.setItem(field, item)
  }

  openWallet() {
    if (this.state.privateKey.length === 64) {
      const wallet = new Wallet(this.state.privateKey)
      this.setSessionItem('wallet', JSON.stringify(wallet))
      this.setState({ wallet, recovered: true })
      this.props.history.push('/')
    }
  }

  render() {
    return (
      <div style={styles.container}>
        <Container>
          <div style={{flex: 'display', justifyContent: 'center', alignItems: 'center'}}>
            <h3>Enter your private key here </h3>
          </div>
          <OpenWalletForm
            privateKey={this.state.privateKey}
            openWallet={this.openWallet}
            changeKey={this.changeKey}
          />
        </Container>
      </div>
    )
  }
}

export default withRouter(OpenWallet)