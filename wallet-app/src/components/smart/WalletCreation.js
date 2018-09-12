import React, { Component } from 'react'
import { Container, Alert, Row, Col, Form, InputGroup, InputGroupAddon, InputGroupText, Button, Label, Input } from 'reactstrap';
import Wallet from '../../models/Wallet'
import { withRouter } from "react-router-dom";
import WalletDataForm from '../dumb/forms/WalletDataForm'

const styles = {
  notificationAlert: {
    padding: '8px'
  }
}
class CreateWallet extends Component {
  constructor() {
    super()
    this.state = {
      wallet: null,
      generated: false,
    }
  }

  generateWallet() {
    const wallet = new Wallet()
    sessionStorage.setItem('wallet', JSON.stringify(wallet))
    this.setState({ wallet, generated: true })
  }

  navigateToHome() {
    this.props.history.push('/')
  }

  renderNotification() {
    return (
      <div>
        <Alert color="warning">
          <h4>Warning!</h4>
          <p> Make sure you save your private key in a safeplace. </p>
          <hr />
          <h6>Note!</h6>
          <p>
            Private key cannot be restored!.

					  <Button color='link' onClick={() => this.navigateToHome()}>
              Click here to redirect to your wallet
            </Button>
            <p>

            </p>
          </p>
        </Alert>
      </div>
    )
  }

  renderGeneratedMessage() {
    if (!this.state.generated) {
      return (<h2>Create new Wallet</h2>)
    }
    return (<h2>Generated Wallet</h2>)
  }

  render() {
    const { wallet } = this.state
    return (
      <Container style={{ paddingTop: '2%', wordWrap: 'break-world' }}>
        <Row>
          <Col>
            {this.renderGeneratedMessage()}
          </Col>
        </Row>
        {!this.state.generated &&
          <Row>
            <Col>
              <Button onClick={this.generateWallet.bind(this)}>Generate Wallet</Button>
            </Col>
          </Row>
        }
        {
          wallet ?
            <WalletDataForm
              privateKey={wallet.privateKey}
              publicKey={wallet.publicKey}
              address={wallet.address}
            /> : null
        }
        {this.state.generated &&
          this.renderNotification()
        }
      </Container>
    )
  }
}

export default withRouter(CreateWallet)