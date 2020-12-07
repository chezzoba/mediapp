import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount, getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashForm from "./DashBoardForm";
import ListExperience from "./ListExperience";
import ListEducation from "./ListEducation";

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(getCurrentProfile, []); // eslint-disable-line

  var content = '';

  if (profile && !loading) {
    content = (
      <Fragment>
        <DashForm />
        <ListExperience experience={profile.experience} />
        <ListEducation education={profile.education} />
      </Fragment>
    );
  } else if (!loading) {
    content = (
        <Fragment>
          <p>You have not created a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      );
  }

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {content}
      <div className="my-2">
          <button className="btn btn-danger" onClick={deleteAccount}>
              <i className="fas fa-user-minus"></i>{' '} Delete My Account
          </button>
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
