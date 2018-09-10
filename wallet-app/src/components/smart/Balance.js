import React, { Component } from 'react'
import { Input, Label, Button, Container } from 'reactstrap'

class Balance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      balances: {},
      transactions: {},
      address: null,
    }
  }

  async componentDidMount() {
    let { balances, transactions } = this.state
    
  }

  render() {
    return (
      <Container>
        <h3>View Account Balance</h3>
        <Label>Address</Label>
        <Input type="text"></Input>
        <Button style={{ marginTop: 10}}>Display</Button>
        <div>
            
        </div>
      </Container>
    )
  }
}

export default Balance