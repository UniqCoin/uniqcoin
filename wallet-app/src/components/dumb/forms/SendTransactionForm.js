import React from 'react'
import { Form, FormGroup, Label, Input } from 'reactstrap';

const SendTransactionForm = (props) => {
  const { from, to, value, data } = props.transactionData
  return (
    <Form>
      <FormGroup>
        <Label for="sender address">Sender</Label>
        <Input type="text" value={from} onChange={props.handleInputChange} id="from" disabled/>
      </FormGroup>
      <FormGroup>
        <Label for="recipient address">Recipient</Label>
        <Input type="text" value={to} onChange={props.handleInputChange} id="to"/>
      </FormGroup>
      <FormGroup>
        <Label for="transaction value">Value</Label>
        <Input type="text" value={value} onChange={props.handleInputChange} id="value"/>
      </FormGroup>
      <FormGroup>
        <Label for="data">Data</Label>
        <Input type="text" value={data} onChange={props.handleInputChange} id="data" placeholder="Optional"/>
      </FormGroup>
    </Form>
  )
}

export default SendTransactionForm
