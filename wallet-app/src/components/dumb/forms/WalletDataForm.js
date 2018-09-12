import React from 'react'
import { Form, InputGroup, InputGroupAddon, InputGroupText, Input, Row, Col, Button } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const styles = {
  p: { wordWrap: 'break-word' },
  clip: {
    height: '2px',
    backgroundColor: 'green',
    padding: '2px',
    borderRadius: '2px ',
    margin: '2px',
    color: 'white',
    cursor: 'pointer',
  }
}
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
          {!props.copied ?
            <CopyToClipboard text={props.privateKey} onCopy={() => props.copy()}>
              <FontAwesomeIcon
                icon='copy'
                style={{
                  cursor: 'pointer',
                  marginLeft: '5px'
                }}
              />
            </CopyToClipboard> :
            <CopyToClipboard text={props.privateKey} onCopy={() => props.copy()}>
              <span style={styles.clip}>copied</span>
          </CopyToClipboard>
          }
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
