import React, { Component } from 'react'
import { Container, Row, Col, Card, CardImg, CardText, Fade,
  CardBody, CardTitle, CardSubtitle, Button, InputGroup, Alert,
  InputGroupText, InputGroupAddon, Input, Jumbotron } from 'reactstrap'
import app from './../../helpers/app'

class Faucet extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.testApi = this.testApi.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  async testApi() {
    const { nodeURL, minerAddress } = this.state

    try {
      const response = await app.service('/api/coins').get({
        nodeURL,
        minerAddress,
      })
      console.log('response')
      console.log(response)
    } catch (err) {
      console.log('api error', err)
    }
  }

  handleInputChange(property) {
    return (event) => {
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
                Balance: 0
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
                <Button color="primary" onClick={this.testApi} block>Send</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="faucet-form-submit-result d-flex align-items-center">
          <Col className="d-flex justify-content-center">
            <Fade>
            <Alert color="primary" className="half-width word-wrap">
            Response
            </Alert>
          </Fade>
          </Col>
        </Row>
        <Row className="footer d-flex align-items-center">
          <Col>
            <h4>Donate?</h4>
            <h5>Faucet Address: hardcoded</h5>
            <h6>Balance: 0</h6>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Faucet
