import React, { Fragment, useState } from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';
import PropTypes from 'prop-types';

function Register({ setAlert, register }) {
    const [formdata, changeform] = useState({
        name:'',
        email:'',
        password:'',
        password2: ''
    });

    const {name, email, password , password2} = formdata;

    const onChange = e => changeform({...formdata, [e.target.name]: e.target.value}); 

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) setAlert('Passwords dont match', 'danger');
        else {
            // const User = {
            //     name, email, password
            // };
            // try {
            //     const config = {
            //         headers: {'Content-Type': 'application/json'}
            //     };

            //     const body = JSON.stringify(User);

            //     const res = await axios.post('/api/users', body, config);
            //     console.log(res.data);
            // } catch (err) {
            //     console.error(err);
            // }
            register({ name, email, password });
        }
    };

    return (
    <Fragment>
         <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" onChange={onChange} value={email} name="email" />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
)};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired
};

export default connect(null, {setAlert, register})(Register);