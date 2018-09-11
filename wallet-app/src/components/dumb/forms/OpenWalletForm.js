import React from 'react'
import { Input, InputGroup, Button,InputGroupAddon ,Form} from 'reactstrap';

const OpenWalletForm = (props) => (
  <Form>
     <InputGroup>
      <Input name="privateKey" id="privateKey" value={props.privateKey} onChange={(event) => props.changeKey(event.target.value)}/>
      <InputGroupAddon addonType="append">
        <Button onClick={() => props.openWallet()}>Open Wallet</Button>
      </InputGroupAddon>
    </InputGroup>
  </Form>
)

export default OpenWalletForm
