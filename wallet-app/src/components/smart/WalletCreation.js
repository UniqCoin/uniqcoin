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
		sessionStorage.setItem('confirmationPending', true)
		this.setState({ wallet, generated: true })
	}

	navigateToHome() {
		this.props.history.push('/')
	}

	render() {
		const { wallet } = this.state
		return (
			<Container>
				<Row>
					<h1>Create new Wallet</h1>
				</Row>
				{!this.state.generated &&
					<Row>
						<Button onClick={this.generateWallet.bind(this)}>Generate Wallet</Button>
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
					<div style={styles.notificationAlert}>
						<Alert color="warning">
							<h4>Warning!</h4>
							<p>
								Please save your private key in a safeplace.
							</p>
							<hr />
							<h6>
								Note!
							</h6>
							<p>
								Private key cannot be restored!.
					  		    <Button color='link' onClick={() => this.navigateToHome()}> Click here if you have save it! </Button>
							</p>
						</Alert>
					</div>
				}
			</Container>
		)
	}
}

export default withRouter(CreateWallet)