import React from 'react'
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap'

const TransactionList = (props) => {
    const { transactions } = props
    return (
        <ListGroup>
            {
                transactions.map(transaction => (
                      <ListGroupItem>
                          <ListGroupItemHeading>{transaction.value}</ListGroupItemHeading>
                          <ListGroupItemText>
                              {transaction.dateCreated}
                          </ListGroupItemText>
                      </ListGroupItem>
                  ))  
            }
        </ListGroup>
    )
}

export default TransactionList