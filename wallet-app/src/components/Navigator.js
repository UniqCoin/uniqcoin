import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
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
  }
}

class Navigator extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem style={style.linkItem}>
                 <Link to='/' style={style.link}>Home</Link>
              </NavItem>
              <NavItem style={style.linkItem}>
                 <Link to='/create-wallet' style={style.link}>Create New Wallet</Link>
              </NavItem>
              <NavItem style={style.linkItem}>
                 <Link to='/' style={style.link}>Recover Wallet</Link>
              </NavItem>
              <NavItem style={style.linkItem}>
                 <Link to='/' style={style.link}>Export Wallet</Link>
              </NavItem>
              <NavItem style={style.linkItem}>
                 <Link to='/open-existing-wallet' style={style.link}>Open existing wallet</Link>
              </NavItem>
              <NavItem style={style.linkItem}>
                 <Link to='/account' style={style.link}>Account</Link>
              </NavItem>
              <NavItem style={style.linkItem}>
                 <Link to='/balance' style={style.link}>Balance</Link>
              </NavItem>
              <NavItem style={style.linkItem}>
                 <Link to='/send-transaction' style={style.link}>Send Transaction</Link>
              </NavItem>
              <NavItem style={style.linkItem}>
                 <Link to='/' style={style.link}>Logout</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Navigator