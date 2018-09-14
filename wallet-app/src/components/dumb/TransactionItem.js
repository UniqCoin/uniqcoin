import React from 'react'
import { ListGroup, ListGroupItem, ListGroupI, Label, Row, Col } from 'reactstrap'
import moment from 'moment'
const styles = {
  itemWrap: {
    wordWrap: 'break-word'
  }
}

const TransactionItem = (props) => (
  <ListGroupItem style={{ backgroundColor: `${props.color}` }}>
    <Row>
      <Col lg='2' md='3' sm='3' xs='12'>
        {props.address === props.to ? 'Transferred': 'Received'} Value: {props.value} UC
        </Col>
      <Col lg='4' md='6' sm='6' xs='12' >
        <p style={styles.itemWrap}>
          to: {props.to}
        </p>
      </Col>
      <Col lg='4' md='6' sm='6' xs='12'>
        <p style={styles.itemWrap}>
          from: {props.from}
        </p>
      </Col>
      <Col lg='2' md='6' sm='6' xs='12'>
        <p style={styles.itemWrap}>
        <Label>{moment(props.dateCreated).format('MMM DD, YYYY hh:mm:ss a')}</Label>
        </p>
      </Col>
    </Row>
  </ListGroupItem>
)

export default TransactionItem
