import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

function Navbar({ auth: { isAuthenticated, loading }, logout}) {
  const authLinks = (
    <ul>
      <li><a href="#!" onClick={logout}>
        <i className="fas fa-sign-out-alt"></i>{' '}
        <span className="hide-sm">Sign Out</span>
      </a></li>
    </ul>
  );
  
  const guestLinks = (
    <ul>
    <li><a href="#!">Developers</a></li>
    <li><Link to="/register">Register</Link></li>
    <li><Link to="/login">Login</Link></li>
  </ul>
  );
  
  return (
    <div>
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
      </h1>
      {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
    </nav>
    </div>)
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,

});

export default connect(mapStateToProps, { logout })(Navbar);