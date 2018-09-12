import React from 'react'
import { Label } from 'reactstrap'
import { Card, Button, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap';

const BalanceView = (props) => {
  const { confirmedBalance, pendingBalance } = props
  return (
    <Card>
      <CardBody style={{ backgroundColor: '#E0E0E0'}}>
        <CardTitle>Account Balance</CardTitle>
      </CardBody>
      <CardBody>
        <Row>
          <Col>
            <Row>
              <Col>
                Confirmed Balance:
                        </Col>
              <Col>
                <h6>
                  {confirmedBalance || 0} UC
                </h6>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>
                Pending Balance:
              </Col>
              <Col>
                <h6>
                  {pendingBalance || 0} UC
                </h6>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default BalanceView