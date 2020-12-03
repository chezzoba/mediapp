import React, {Fragment, useState} from 'react';
import { Link } from 'react-router-dom';

function Login() {
    const [formdata, changeform] = useState({
        email:'',
        password:''
    });

    const {email, password} = formdata;

    const onChange = e => changeform({...formdata, [e.target.name]: e.target.value}); 

    const onSubmit = async e => {
        e.preventDefault();
        console.log('Success!');
    };

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

export default Login;