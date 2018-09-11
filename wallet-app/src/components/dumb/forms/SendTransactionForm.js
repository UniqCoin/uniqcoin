import React from 'react'
import { Form, FormGroup, Label, Input } from 'reactstrap';

const SendTransactionForm = (props) => (
  <Form>
    <FormGroup>
      <Label for="sender address">Sender</Label>
      <Input type="text"/>
    </FormGroup>
    <FormGroup>
      <Label for="recipient address">Recipient</Label>
      <Input type="text"/>
    </FormGroup>
    <FormGroup>
      <Label for="transaction value">Value</Label>
      <Input type="text"/>
    </FormGroup>
  </Form>
)

export default SendTransactionForm
