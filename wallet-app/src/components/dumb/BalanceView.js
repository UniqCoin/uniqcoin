import React from 'react'
import { Label, Row } from 'reactstrap'
const BalanceView = (props) => {
    const { confirmedBalance, pendingBalance } = props
    return (
        <div>
            <Row>
                <Label>Confirmed balance: {confirmedBalance}</Label>
            </Row>
            <Row>
                <Label>Pending balance: {pendingBalance}</Label>
            </Row>    
        </div>
    )
}

export default BalanceView