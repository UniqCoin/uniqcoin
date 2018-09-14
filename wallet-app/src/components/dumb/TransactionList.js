import React from 'react'
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Label, Row, Col } from 'reactstrap'
import moment from 'moment'
import TransactionItem from './TransactionItem'

const styles = {
  noRecentActivity: {
    backgroundColor: `#EEEEEE`,
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
 }

const TransactionList = (props) => {
  const { transactions } = props
  return (
    <div style={{ paddingTop: '2%', flexGrow: 1, overflowY: 'auto', height: '60vh' }}>
      <ListGroup flush>
        {
          transactions.length <= 0 ? (
            <ListGroupItem style={styles.noRecentActivity}> No recent activity</ListGroupItem>
          ) : (
              transactions.map((transaction, i) => {
                const odd = ((i + 1) % 2) === 0
                return (<TransactionItem
                  color={odd ? '' : '#F5F5F5'}
                  to={transaction.to}
                  from={transaction.from}
                  value={transaction.value}
                  dateCreated={transaction.dateCreated}
                />)
              }
              )
            )
        }
      </ListGroup>
    </div>
  )
}

export default TransactionList