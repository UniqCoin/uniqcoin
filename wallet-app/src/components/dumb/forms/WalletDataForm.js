import React from 'react'
import { Form, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Col } from 'reactstrap';
const styles = { p: { wordWrap: 'break-word' } }
const WalletDataForm = (props) => (
  <Form>
    <Row>
      <Col xs='auto'>
        <h6>Blockchain Address: </h6>
      </Col>
      <Col>
        <p style={styles.p}>
          {props.address}
        </p>
      </Col>
    </Row>
    <Row>
      <Col xs='auto'>
        <h6>Privakey Address: </h6>
      </Col>
      <Col>
        <p style={styles.p}>
          {props.privateKey}
        </p>
      </Col>
    </Row>
    <Row>
      <Col xs='auto'>
        <h6>Public Key: </h6>
      </Col>
      <Col>
        <p style={styles.p}>
          {props.publicKey}
        </p>
      </Col>
    </Row>
  </Form>
)

export default WalletDataForm
