import React, { Component } from 'react'
import { Container, Row, Col, Form, InputGroup, InputGroupAddon, InputGroupText, Button, Label, Input } from 'reactstrap';
import Wallet from '../../models/Wallet'
import { withRouter } from "react-router-dom";
import WalletDataForm from '../dumb/forms/WalletDataForm'

class CreateWallet extends Component {
	constructor() {
		super()
		this.state = {
				wallet: null
		}
	}

	generateWallet() {
		const wallet = new Wallet()
		sessionStorage.setItem('wallet', JSON.stringify(wallet))
		sessionStorage.setItem('createdWallet', true)
		this.setState({ wallet })
	}

	navigateToHome() {
		this.props.history.push('/')
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
						<WalletDataForm
							privateKey={wallet.privateKey}
							publicKey={wallet.publicKey}
							address={wallet.address}
						/> : null
					}
				</Row>
				<Button onClick={() => this.navigateToHome()}> click me</Button>
			</Container>
		)
	}
}

export default withRouter(CreateWallet)