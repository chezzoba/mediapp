import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import ProfileGithub from './ProfileGithub'

const Profile = ({
  match,
  getProfiles,
  profile: { profile, loading },
  auth,
}) => {
  useEffect(() => {
    getProfiles(match.params.id);
  }, [getProfiles, match.params.id]);
  var content = "";

  if (loading || !profile) {
    content = <Spinner />;
  } else {
    content = (
      <Fragment>
        <Link to="/profiles" className="btn btn-light">
          Back to Profiles
        </Link>
        {auth.isAuthenticated &&
          auth.loading === false &&
          auth.user._id === profile.user._id && (
            <Link to="/edit-profile" className="btn btn-dark">
              Edit Profile
            </Link>
          )}
        <div className="profile-grid my-1">
          <ProfileTop profile={profile} />
          <ProfileAbout profile={profile} />
          <div className="profile-exp bg-white p-2">
            <h2 className="text-primary">Experience</h2>
            {profile.experience.length === 0 ? <h4>No experience credentials</h4> : (
                <Fragment>
                    {profile.experience.map(ex => (
                       <ProfileExperience key={ex._id} experience={ex}/>
                    ))}
                </Fragment>
            )}
          </div>
          <div className="profile-edu bg-white p-2">
            <h2 className="text-primary">Education</h2>
            {profile.education.length === 0 ? <h4>No education credentials</h4> : (
                <Fragment>
                    {profile.education.map(ex => (
                       <ProfileEducation key={ex._id} education={ex}/>
                    ))}
                </Fragment>
            )}
          </div>
          {profile.githubusername && <ProfileGithub username={profile.githubusername}/>}
        </div>
      </Fragment>
    );
  }

  return <div>{content}</div>;
};

Profile.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfiles })(Profile);
