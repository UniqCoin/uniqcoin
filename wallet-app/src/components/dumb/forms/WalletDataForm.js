import React from 'react'
import { Form, InputGroup, InputGroupAddon, InputGroupText, Input,Row } from 'reactstrap';

const WalletDataForm = (props) => (
  <Form>
    <Row>
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>Generated private key: </InputGroupText>
      </InputGroupAddon>
      <Input name="privateKey" id="privateKey" value={props.privateKey} disabled />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>Extracted public key: </InputGroupText>
      </InputGroupAddon>
      <Input name="publicKey" id="publicKey" value={props.publicKey} disabled />
    </InputGroup>
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>Extracted blockchain address: </InputGroupText>
      </InputGroupAddon>
      <Input name="address" id="address" value={props.address} disabled />
    </InputGroup>
    </Row>
  </Form>
)

export default WalletDataForm
