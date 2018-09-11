import React from 'react'
import { Form, Label, Input, Button } from 'reactstrap';

const BalanceForm = (props) => {
    return (
        <Form>
            <h3>View Account Balance</h3>
            <Label>Address</Label>
            <Input type="text"></Input>
            <Button style={{ marginTop: 10}}>Display</Button>        
        </Form>
    )
}
export default BalanceForm
