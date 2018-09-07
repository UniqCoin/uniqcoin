import React, { Component } from 'react'
import { Container, Row, Col, Form, InputGroup, InputGroupAddon, InputGroupText, Button, Label, Input } from 'reactstrap';
import Wallet from '../../models/Wallet'

import SendTransactionForm from '../dumb/forms/SendTransactionForm'

class SendTransaction extends Component {
	constructor() {
		super()
		this.state = {
      signedTransaction: null,
      transactionHash: null,
    }
    this.signTransaction = this.sendTransaction.bind(this)
    this.sendTransaction = this.sendTransaction.bind(this)
    this.renderSignedTransaction = this.renderSignedTransaction.bind(this)
    this.renderSentTransaction = this.renderSentTransaction.bind(this)
  }
  
  signTransaction() {

  }

  sendTransaction() {

  }

  renderSignedTransaction(signedTransaction) {
    return (
      <Row>
        <Input type="textarea" value={JSON.stringify(signedTransaction)} />
        <Button onClick={this.sendTransaction}>Send Transaction</Button>
      </Row>
    )
  }

  renderSentTransaction(transactionHash) {
    const value = `Transaction successfully sent!\nTransaction hash:\n${transactionHash}`
    return (
      <Input type="textarea" value={value}/>
    )
  }

	render() {
    const { signedTransaction, transactionHash } = this.state
		return(
			<Container>
				<Row>
					<h1>Send Transaction</h1>
				</Row>
				<Row>
          <SendTransactionForm
          />
          <Button onClick={this.signTransaction}>Sign Transaction</Button>
				</Row>
        { signedTransaction ? this.renderSignedTransaction(signedTransaction) : null}
        { transactionHash ? this.renderSentTransaction(transactionHash) : null }
      </Container>
		)
	}
}

export default SendTransaction