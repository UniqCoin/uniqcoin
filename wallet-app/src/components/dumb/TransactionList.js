import React from 'react'
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Label, Row, Col } from 'reactstrap'
import moment from 'moment'

const TransactionList = (props) => {
    const { transactions } = props
    return (
        <ListGroup>
            {
                transactions.length === 0 ? (
                    <Label>No recent activity</Label>
                ) :(
                    transactions.map(transaction => (
                        <ListGroupItem>
                            <ListGroupItemHeading>{transaction.value} UC</ListGroupItemHeading>
                            <ListGroupItemText>
                                <Row>
                                    <Col>
                                      <Label>Date: {moment(transaction.dateCreated).format('MMM DD, YYYY hh:mm:ss a')}</Label>
                                    </Col>
                                    <Col>
                                      <Label>to: {transaction.to}</Label>
                                    </Col>
                                     <Col>
                                      <Label>from: {transaction.from}</Label>
                                    </Col>
                                </Row>
                            </ListGroupItemText>
                        </ListGroupItem>
                    ))
                )
            }
        </ListGroup>
    )
}

export default TransactionList