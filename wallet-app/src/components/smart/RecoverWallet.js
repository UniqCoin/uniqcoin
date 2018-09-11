import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap';
import RecoverWalletForm from '../dumb/forms/RecoverWalletForm'
import Wallet from '../../models/Wallet'
import WalletDataForm from '../dumb/forms/WalletDataForm'



class RecoverWallet extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.changeKey = this.changeKey.bind(this)
    this.recoverWallet = this.recoverWallet.bind(this)
  }

  changeKey(val) {
    this.setState({ privateKey: val })
  }

  recoverWallet() {
    if (this.state.privateKey.length === 64) {
      const wallet = new Wallet(this.state.privateKey)
      sessionStorage.setItem('wallet', JSON.stringify(wallet))
      this.setState({ wallet, recovered: true })
    }
  }

  render() {
    return (
      <Container>
        <div>
          <RecoverWalletForm
            privateKey={this.state.privateKey}
            recoverWallet={this.recoverWallet}
            changeKey={this.changeKey}
          />
          {this.state.recovered &&
            < WalletDataForm
              privateKey={this.state.wallet.privateKey}
              publicKey={this.state.wallet.publicKey}
              address={this.state.wallet.address}
            />
          }
        </div>
      </Container>
    )
  }
}

export default RecoverWallet