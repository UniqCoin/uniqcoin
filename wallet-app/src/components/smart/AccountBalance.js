import React, { Component } from 'react'
import { Container, Row } from 'reactstrap'
import BalanceView from '../dumb/BalanceView'
import TransactionList from '../dumb/TransactionList'
import nodeServices from '../../nodeServices.js'

class AccountBalance extends Component {
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
      this.setState({ balances: balances.data, transactions: transactions.data })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { balances, transactions } = this.state
    const { confirmedBalance, pendingBalance } = balances
    return (
      <Container>
        <div style={{paddingTop: '5%'}}>
          <BalanceView
            confirmedBalance={confirmedBalance}
            pendingBalance={pendingBalance}
          />
        </div>
        <TransactionList
          transactions={transactions}
        />
      </Container>
    )
  }
}

export default AccountBalance