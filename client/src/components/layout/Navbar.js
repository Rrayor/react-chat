import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: {isAuthenticated, loading}, logout}) => {
    const authLinks = (
        <Fragment>
            <Link to="/dashboard/messages"><button>Dashboard</button></Link>
            <button onClick={ logout }>Logout</button>
        </Fragment>
    );

    const guestLinks  = (
        <Fragment>
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/register">
                <button>Register</button>
            </Link>
        </Fragment>
    );

    return (
        <nav className="nav-bar">
            { !loading && (isAuthenticated ? authLinks : guestLinks) }
        </nav>
    );
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
