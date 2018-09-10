import React, { Component } from 'react'
import CryptoJS from 'crypto-js'
const EC = require('elliptic').ec
import { Container, Row, Col, Form, InputGroup, InputGroupAddon, InputGroupText, Button, Label, Input } from 'reactstrap'
import { miningFee } from '../../../../config.js'
import Wallet from '../../models/Wallet'
const secp256k1 = new EC('secp256k1')

import SendTransactionForm from '../dumb/forms/SendTransactionForm'

class SendTransaction extends Component {
	constructor() {
		super()
		this.state = {
      signedTransaction: null,
      transactionHash: null,
      transactionData: {},
    }
    this.signTransaction = this.sendTransaction.bind(this)
    this.sendTransaction = this.sendTransaction.bind(this)
    this.renderSignedTransaction = this.renderSignedTransaction.bind(this)
    this.renderSentTransaction = this.renderSentTransaction.bind(this)
  }

  componentDidMount() {
    const wallet = JSON.parse(sessionStorage.getItem('wallet'))
    const transactionData = {
      from: wallet.address,
      to: '',
      value: '',
      fee: miningFee,
      dateCreated: null,
      data: '',
      senderPubkey: wallet.publicKey,
    }
    this.setState({ transactionData })
  }
  
  signTransaction() {
    const { transactionData } = this.state
    const wallet = JSON.parse(sessionStorage.getItem('wallet'))
    transactionJSON = JSON.stringify(transactionData)
    const transactionDataHash = CryptoJS.SHA256(transactionData).toString()
    const senderSignature = this.signData(transactionDataHash, wallet.privateKey)
    const signedTransaction = Object.assign(transactionData, { transactionDataHash, senderSignature })
    this.setState({ signedTransaction })
  }

  signData(transactionHash, privateKey) {
    const keyPair = secp256k1.keyFromPrivate(privateKey)
    const signature = keyPair.sign(transactionHash)
    return [signature.r.toString(16), signature.s.toString(16)]
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
				</Row>
        <Row>
          <Button onClick={this.signTransaction}>Sign Transaction</Button>
        </Row>
        { signedTransaction ? this.renderSignedTransaction(signedTransaction) : null}
        { transactionHash ? this.renderSentTransaction(transactionHash) : null }
      </Container>
		)
	}
}

export default SendTransaction