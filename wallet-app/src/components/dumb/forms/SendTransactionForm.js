import React from 'react'
import { Form, FormGroup, Label, Input } from 'reactstrap';

const styles = {
  h6: {
    wordWrap: 'break-word',
    margin: '5px',
    borderRadius: '3px',
  }
}
const SendTransactionForm = (props) => {
  const { from, to, value, data } = props.transactionData
  return (
    <Form>
      <FormGroup>
        <Label for="sender address">Sender</Label>
        <h6 style={styles.h6}>
          {from}
        </h6>
      </FormGroup>
      <FormGroup>
        <Label for="recipient address">Recipient</Label>
        <Input type="text" value={to} onChange={props.handleInputChange} id="to"/>
      </FormGroup>
      <FormGroup>
        <Label for="transaction value">Value</Label>
        <Input type="number" value={value} onChange={props.handleInputChange} id="value"/>
      </FormGroup>
      <FormGroup>
        <Label for="data">Data</Label>
        <Input type="text" value={!data ? '' : data} onChange={props.handleInputChange} id="data" placeholder="Optional"/>
      </FormGroup>
    </Form>
  )
}

export default SendTransactionForm
