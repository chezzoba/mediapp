import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addEducation } from '../../actions/profile'
import { Link, withRouter } from 'react-router-dom'

const initialState = {
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
}

const AddEducation = ({ addEducation, history }) => {
    const [fd, setfd] = useState(initialState);
    const [toDateDisabled, toggleDisable] = useState(false);

    const {school, degree, fieldofstudy, to, from, current, description} = fd;

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
       Add Education
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any School you have attended
      </p>
      <small>* = required field</small>
      <form class="form" onSubmit={e => {
          e.preventDefault();
          addEducation(fd, history);
      }}>
        <div class="form-group">
          <input type="text" placeholder="* Degree" name="degree" required value={degree} onChange={changefd}/>
        </div>
        <div class="form-group">
          <input type="text" placeholder="* School" name="school" required value={school} onChange={changefd}/>
        </div>
        <div class="form-group">
          <input type="text" placeholder="Field of Study" name="fieldofstudy" value={fieldofstudy} onChange={changefd}/>
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={changefd}/>
        </div>
         <div class="form-group">
    <p><input type="checkbox" name="current" value={current} checked={current} onChange={changefd}/>{' '}Current School</p>
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
            placeholder="Degree Description"
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

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired
}

export default connect(null, { addEducation })(withRouter(AddEducation));
