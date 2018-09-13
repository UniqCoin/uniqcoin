import React, { Component } from 'react'
import CryptoJS from 'crypto-js'
import elliptic from 'elliptic'
import { Container, Row, Col, Form, InputGroup, InputGroupAddon, InputGroupText, Button, Label, Input } from 'reactstrap'
import { transactionFee } from '../../config.js'
import nodeServices from '../../nodeServices';
import Wallet from '../../models/Wallet'

import SendTransactionForm from '../dumb/forms/SendTransactionForm'

const secp256k1 = new elliptic.ec('secp256k1')


class SendTransaction extends Component {
	constructor() {
		super()
		this.state = {
      signedTransaction: null,
      transactionHash: null,
      transactionData: {},
      errorMsg: '',
    }
    this.signTransaction = this.signTransaction.bind(this)
    this.sendTransaction = this.sendTransaction.bind(this)
    this.renderSignedTransaction = this.renderSignedTransaction.bind(this)
    this.renderSentTransaction = this.renderSentTransaction.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(evt) {
    const { id, value } = evt.target
    const { transactionData } = this.state
    transactionData[id] = value
    this.setState({ transactionData })
  }

  componentDidMount() {
    const wallet = JSON.parse(sessionStorage.getItem('wallet'))
    if (wallet) {
      const transactionData = {
        from: wallet.address,
        to: '',
        value: '',
        fee: transactionFee,
        dateCreated: null,
        data: null,
        senderPubKey: wallet.publicKey,
      }
      this.setState({ transactionData })
    }
  }
  
  signTransaction() {
    const { transactionData } = this.state
    const { from, to, value, fee, data, senderPubKey } = transactionData
    const transaction = {
      from,
      to,
      value: parseInt(value),
      fee,
      dateCreated: new Date().toISOString(),
      data,
      senderPubKey
    }
    if (!data) delete transaction.data
    const wallet = JSON.parse(sessionStorage.getItem('wallet'))
    const transactionJSON = JSON.stringify(transaction)
    const transactionDataHash = CryptoJS.SHA256(transactionJSON).toString()
    const senderSignature = this.signData(transactionDataHash, wallet.privateKey)
    const signedTransaction = Object.assign(transaction, { transactionDataHash, senderSignature })
    this.setState({ signedTransaction })
  }

  signData(transactionHash, privateKey) {
    const keyPair = secp256k1.keyFromPrivate(privateKey)
    const signature = keyPair.sign(transactionHash)
    return [signature.r.toString(16), signature.s.toString(16)]
  }

  async sendTransaction() {
    const { signedTransaction } = this.state
    signedTransaction.value = parseInt(signedTransaction.value)
    try {
      const response = await nodeServices.sendSignedTransaction(signedTransaction)
      this.setState({ transactionHash: response.data })
    } catch (error) {
      // TODO: add showing of error
      console.log(error.response.data.message)
    }
  }

  renderSignedTransaction(signedTransaction) {
    return (
      <Row>
        <Input type="textarea" value={JSON.stringify(signedTransaction)} readOnly/>
        <Button onClick={this.sendTransaction}>Send Transaction</Button>
      </Row>
    )
  }

  renderSentTransaction(transactionHash) {
    const value = `Transaction successfully sent!\nTransaction hash:\n${transactionHash}`
    return (
      <Input type="textarea" value={value} readOnly/>
    )
  }

	render() {
    const { signedTransaction, transactionHash, transactionData } = this.state
		return (
			<Container>
				<Row>
					<h1>Send Transaction</h1>
				</Row>
				<Row>
          <SendTransactionForm
            handleInputChange={this.handleInputChange}
            transactionData={transactionData}
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