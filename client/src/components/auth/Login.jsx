import React, {Fragment, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

function Login({ login, isAuthenticated }) {
    const [formdata, changeform] = useState({
        email:'',
        password:''
    });

    const {email, password} = formdata;

    const onChange = e => changeform({...formdata, [e.target.name]: e.target.value}); 

    const onSubmit = async e => {
        e.preventDefault();
        login(email, password);
    };

    if (isAuthenticated) {
        return <Redirect to="/dashboard"/>
    }

    return (
    <Fragment>
            <h1 className="large text-primary">Sign In</h1>
        <p className="lead"><i className="fas fa-user"></i> Login to Your Account</p>
        <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
            <input type="email" placeholder="Email Address" onChange={onChange} value={email} name="email" />
        </div>
        <div className="form-group">
            <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={onChange}
            />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
        Don't have an account? <Link to="/register">Register</Link>
        </p>
    </Fragment>
)}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({isAuthenticated: state.auth.isAuthenticated});

export default connect(mapStateToProps, { login })(Login);