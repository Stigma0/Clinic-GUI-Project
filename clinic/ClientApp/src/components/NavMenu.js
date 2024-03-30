import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import UserContext from './UserContext';

export class NavMenu extends Component {
  static contextType = UserContext; // Set contextType to use this.context

  constructor (props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  handleLogout = () => {
    window.location.reload();
  };

  render() {
    const { userRole, getRoleName } = this.context; // Access userRole and getRoleName from context

    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to="/">clinic</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
              </NavItem>
              {/* Conditional Rendering Based on User Role */}
              {userRole === 2 && ( // Assuming 2 is the role for 'Manager'
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/manage-patients">Manage Patients</NavLink>
                </NavItem>
              )}
              {userRole === 2 && ( // Assuming 2 is the role for 'Manager'
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/manage-doctors">Manage Doctors</NavLink>
                </NavItem>
              )}
              {(userRole === 2 || userRole === 0)&& ( // Assuming 2 and 0 are the roles for 'Manager' and 'Doctor'
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/manage-schedules">Manage Schedules</NavLink>
                </NavItem>
              )}
              {userRole === 1 && ( // Assuming 2 and 0 are the roles for 'Manager' and 'Doctor'
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/schedule-patient">Patient Schedule</NavLink>
                </NavItem>
              )}
              {/* More conditional items can be added based on roles */}
              <button onClick={this.handleLogout}>Logout</button>
            </ul>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
