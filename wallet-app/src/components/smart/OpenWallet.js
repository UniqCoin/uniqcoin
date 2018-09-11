import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap';
import OpenWalletForm from '../dumb/forms/OpenWalletForm'
import Wallet from '../../models/Wallet'
import WalletDataForm from '../dumb/forms/WalletDataForm'
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirect: 'column',
    
    height: '100%',
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

  openWallet() {
    if (this.state.privateKey.length === 64) {
      const wallet = new Wallet(this.state.privateKey)
      sessionStorage.setItem('wallet', JSON.stringify(wallet))
      this.setState({ wallet, recovered: true })
      this.props.history.push('/')
    }
  }

  render() {
    return (
      <div style={styles.container}>
        <Container>
          <OpenWalletForm
            privateKey={this.state.privateKey}
            openWallet={this.openWallet}
            changeKey={this.changeKey}
          />
          <div style={{ paddingTop: '8px' }}>
            {this.state.recovered &&
              < WalletDataForm
                privateKey={this.state.wallet.privateKey}
                publicKey={this.state.wallet.publicKey}
                address={this.state.wallet.address}
              />
            }
          </div>
        </Container>
      </div>
    )
  }
}

export default withRouter(OpenWallet)