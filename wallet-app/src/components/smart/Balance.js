import React, { Component } from 'react'
import { Container, Row } from 'reactstrap'
import BalanceView from '../dumb/BalanceView'
import TransactionList from '../dumb/TransactionList'
import nodeServices from '../../nodeServices.js'

class Balance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      balances: {},
      transactions: [],
    }
  }

  async componentDidMount() {
    let { balances, transactions } = this.state
    const wallet = JSON.parse(sessionStorage.getItem('wallet'))
    try {
      balances = await nodeServices.getBalances(wallet.address)
      transactions = await nodeServices.getTransactions(wallet.address)
      this.setState({ balances, transactions })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { balances, transactions } = this.state
    const { confirmedBalance, pendingBalance } = balances
    return (
      <Container>
        <h1>Account Balance</h1>
        <Row>
          <BalanceView
            confirmedBalance={confirmedBalance}
            pendingBalance={pendingBalance}
          />
        </Row>
        <h3>Recent Activity</h3>
        <Row>
          <TransactionList
            transactions={transactions}
          />
        </Row>
      </Container>
    )
  }
}

export default Balance