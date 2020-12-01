import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const { username, password }  = formData;

    const onChange = event => setFormData({ ...formData, [event.target.name]: event.target.value });
    const onSubmit = async event => {
        event.preventDefault();
        register({ username, password });
    };

    if(isAuthenticated){
        return <Redirect to="/dashboard" />;
    }

    return (
        <Fragment>
            <form onSubmit={ event => onSubmit(event) }>
                <h1>Register</h1>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" value={username} onChange={ event => onChange(event) }/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" value={password} onChange={ event => onChange(event) }/>
                </div>
                <div className="form-group">
                    <button type="submit">Register</button>
                </div>
            </form>
        </Fragment>
    );
};

Register.propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register })(Register);
