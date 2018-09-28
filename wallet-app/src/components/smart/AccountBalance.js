import React, { Component } from 'react'
import { Container, Row } from 'reactstrap'
import BalanceView from '../dumb/BalanceView'
import TransactionList from '../dumb/TransactionList'
import nodeServices from '../../nodeServices.js'
import moment from 'moment';
// import moment from ''
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
    let exactTransaction = []
    if (transactions.transactions) {
      exactTransaction = transactions.transactions.sort((a, b) => moment(a.dateCreated).unix() < moment(b.dateCreated).unix())
    }
    
    return (
      <Container>
        <div style={{ paddingTop: '5%' }}>
          <BalanceView
            confirmedBalance={confirmedBalance}
            pendingBalance={pendingBalance}
          />
        </div>
        <h5 style={{ paddingTop: '2%' }}>Transactions</h5>
        <TransactionList
          address={transactions.address || ''}
          transactions={exactTransaction}
        />
      </Container>
    )
  }
}

export default AccountBalance