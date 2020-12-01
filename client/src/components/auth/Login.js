import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    const {username, password} = formData;

    const onChange = event => setFormData({
        ...formData,
        [event.target.name]: event.target.value
    });

    const onSubmit = async event => {
        event.preventDefault();
        login(username, password);
    };

    if(isAuthenticated){
        return <Redirect to="/dashboard/messages" />;
    }

    return (
        <Fragment>
            <form onSubmit={ event => onSubmit(event) }>
                <h1>Login</h1>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" onChange={onChange} value={username} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" onChange={onChange} value={password} />
                </div>
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
            </form>
        </Fragment>
    )
}

Login.propTypes ={
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
