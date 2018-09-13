import React, { Component } from 'react'
import axios from 'axios'
import { Container, Row, Col, Card, CardImg, CardText, Fade,
  CardBody, CardTitle, CardSubtitle, Button, InputGroup, Alert,
  InputGroupText, InputGroupAddon, Input, Jumbotron } from 'reactstrap'
import app from './../../helpers/app'

class Faucet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      responseAlertIsVisible: false,
      faucetBalance: 0,
    }
    this.getCoins = this.getCoins.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  async getCoins() {
    const { nodeURL, minerAddress } = this.state

    let getCoinsResponse
    try {
      const response = await app.service('/api/coins').get({
        nodeURL,
        minerAddress,
      })
      
      getCoinsResponse = response.message
    } catch (err) {
      getCoinsResponse = `Error establishing connection to ${nodeURL}`
    }

    this.setState({
      responseAlertIsVisible: true,
      getCoinsResponse,
    })
  }

  handleInputChange(property) {
    return async (event) => {
      if (property === 'nodeURL') {
        let nodeURL = event.target.value
        nodeURL = nodeURL.endsWith('/') ? nodeURL : nodeURL + '/'
        const response = await axios.get(`${nodeURL}balances`)
      
        this.setState({
          [property]: nodeURL,
          faucetBalance: response.data['454a32d21ca64de48126e11129b3a9172e073720'],
        })
      }

      this.setState({
        [property]: event.target.value,
      })
    }
  }

  render() {
    return (
      <Container>
        <Row className="header d-flex align-items-center">
          <Col>UniqCoin Faucet</Col>
        </Row>
        <Row className="faucet-form d-flex align-items-start">
          <Col className="d-flex justify-content-center">
            <Card className="half-width">
              <CardBody>
                <CardTitle>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Node URL</InputGroupText>
                    </InputGroupAddon>
                  <Input onChange={this.handleInputChange('nodeURL')} />
                  </InputGroup>
                </CardTitle>
                <CardSubtitle className="d-flex justify-content-start">
                Balance: {this.state.faucetBalance}
                </CardSubtitle>
                <br/>
                <CardText>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Miner Address</InputGroupText>
                    </InputGroupAddon>
                    <Input onChange={this.handleInputChange('minerAddress')} />
                  </InputGroup>
                </CardText>
                <Button color="primary" onClick={this.getCoins} block>Send</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="faucet-form-submit-result d-flex align-items-center">
          <Col className="d-flex justify-content-center">
            <Fade in={this.state.responseAlertIsVisible}>
              <Alert color="primary" className="text-left word-wrap">
              {this.state.getCoinsResponse}
              </Alert>
            </Fade>
          </Col>
        </Row>
        <Row className="footer d-flex align-items-center">
          <Col>
            <h4>Donate?</h4>
            <h5>Faucet Address: 454a32d21ca64de48126e11129b3a9172e073720</h5>
            <h6>Balance: {this.state.faucetBalance}</h6>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Faucet
