import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addExperience } from '../../actions/profile'
import { Link, withRouter } from 'react-router-dom'

const initialState = {
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
}

const AddExperience = ({ addExperience, history }) => {
    const [fd, setfd] = useState(initialState);
    const [toDateDisabled, toggleDisable] = useState(false);

    const {company, title, location, to, from, current, description} = fd;

    const changefd = e => {
        if (e.target.name === 'current') {
            setfd({...fd, current: !current});
            toggleDisable(!toDateDisabled);
        } else {
            setfd({...fd, [e.target.name]: e.target.value})
        }
    };

    return (
        <Fragment>
            <h1 class="large text-primary">
       Add An Experience
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form class="form" onSubmit={e => {
          e.preventDefault();
          addExperience(fd, history);
      }}>
        <div class="form-group">
          <input type="text" placeholder="* Job Title" name="title" required value={title} onChange={changefd}/>
        </div>
        <div class="form-group">
          <input type="text" placeholder="* Company" name="company" required value={company} onChange={changefd}/>
        </div>
        <div class="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={changefd}/>
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={changefd}/>
        </div>
         <div class="form-group">
    <p><input type="checkbox" name="current" value={current} checked={current} onChange={changefd}/>{' '}Current Job</p>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} disabled={toDateDisabled ? 'disabled': ''} onChange={changefd}/>
        </div>
        <div class="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
            value={description} 
            onChange={changefd}
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <Link class="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
        </Fragment>
    )
}

AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired
}

export default connect(null, { addExperience })(withRouter(AddExperience));
