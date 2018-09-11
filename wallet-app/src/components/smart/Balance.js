import React, { Component } from 'react'
import { Container } from 'reactstrap'
import BalanceForm from '../dumb/forms/BalanceForm'
import BalanceView from '../dumb/BalanceView'
import nodeServices from '../../nodeServices.js'

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
    let { balances, transactions, address } = this.state
    try {
      balances = await nodeServices.getBalances('sdsd')
      transactions = await nodeServices.getTransactions(address)
      this.setState({ balances, transactions })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { confirmedBalance, pendingBalance } = this.state.balances
    return (
      <Container>
        <BalanceForm />
        <BalanceView
          confirmedBalance={confirmedBalance}
          pendingBalance={pendingBalance}
        />
      </Container>
    )
  }
}

export default Balance