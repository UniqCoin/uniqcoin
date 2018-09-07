import React, { Component } from 'react'
import { Container, Row, Col, Form, InputGroup, InputGroupAddon, InputGroupText, Button, Label, Input } from 'reactstrap';
import Wallet from '../../models/Wallet'

import WalletData from '../dumb/forms/WalletData'

class CreateWallet extends Component {
	constructor() {
		super()
		this.state = {
				wallet: null
		}
	}

	generateWallet() {
		const wallet = new Wallet()
		this.setState({ wallet })
	}

	render() {
		const { wallet } = this.state
		return(
			<Container>
				<Row>
					<h1>Create new Wallet</h1>
				</Row>
				<Row>
					<Button onClick={this.generateWallet.bind(this)}>Generate Wallet</Button>
				</Row>
				<Row>
					{
						wallet ?
						<WalletData
							privateKey={wallet.privateKey}
							publicKey={wallet.publicKey}
							address={wallet.address}
						/> : null
					}
				</Row>
			</Container>
		)
	}
}

export default CreateWallet