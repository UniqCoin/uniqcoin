import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const style = {
  link: {
    color: 'black',
  },
  linkItem: {
    padding: '5px'
  },
  dropdownItem: {
    padding: '5px',
  }
}

class Navigator extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  navigateToHome() {
    this.props.history.push('/')
  }

  render() {
    const wallet = window.sessionStorage.getItem('wallet')

    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand>UNIQCOIN WALLET</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem style={style.linkItem}>
                <Link to='/' style={style.link}>Home</Link>
              </NavItem>
              {wallet &&
                <NavItem style={style.linkItem}>
                  <Link to='/account-balance' style={style.link}>Account Balance</Link>
                </NavItem>
              }
              {wallet &&
                <NavItem style={style.linkItem}>
                  <Link to='/send-transaction' style={style.link}>Send Transaction</Link>
                </NavItem>
              }
              {
                !wallet &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle style={style.dropdownItem} nav caret>
                    Wallet
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <Link to='/create-wallet' style={style.link}>Create New Wallet</Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link to='/open-existing-wallet' style={style.link}>Open Wallet</Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link to='/export-wallet' style={style.link}>Export Wallet</Link>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              }
              <NavItem style={style.linkItem}>
                {wallet && <Link to='/' style={style.link} onClick={() => window.sessionStorage.clear()}> Logout</Link>}
                {!wallet && <Link to='/' style={style.link} onClick={() => { }}> Login</Link>}
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(Navigator)