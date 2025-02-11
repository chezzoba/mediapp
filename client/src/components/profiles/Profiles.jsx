import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getProfiles } from '../../actions/profile'
import ProfileItem from './ProfileItem'

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
    useEffect(getProfiles, []); // eslint-disable-line

    return loading || !profiles ? <Spinner/> : (
    <Fragment>
        <h1 className="large text-primary">Developers</h1>
        <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with developers
        </p>
        <div className="profiles">
            {profiles.map(pf => (
                <ProfileItem profile={pf} />
            ))}
        </div>
    </Fragment>);
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({profile: state.profile});

export default connect(mapStateToProps, { getProfiles })(Profiles);
