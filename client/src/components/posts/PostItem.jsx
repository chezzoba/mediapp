import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { updateLikes, deletePost } from "../../actions/post";

const PostItem = ({
  auth,
  post,
  updateLikes,
  deletePost,
  showActions,
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={"/profile/" + post.user}>
          <img className="round-img" src={post.avatar} alt="" />
          <h4>{post.name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{post.text}</p>
        <p className="post-date">
          Posted on <Moment format="YYYY-MM-DD">{post.date}</Moment>
        </p>
        {showActions && (
          <Fragment>
            <button
              onClick={(e) => updateLikes(post._id, "like")}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-up"></i>{" "}
              <span>{post.likes.length}</span>
            </button>
            <button
              onClick={(e) => updateLikes(post._id, "unlike")}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-down"></i>
            </button>
            <Link to={`/post/${post._id}`} className="btn btn-primary">
              Discussion{" "}
              {post.comments.length > 0 && (
                <span className="comment-count">{post.comments.length}</span>
              )}
            </Link>
            {!auth.loading && post.user === auth.user._id && (
              <button
                onClick={(e) => deletePost(post._id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps ={
    showActions: true
}

PostItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updateLikes, deletePost })(PostItem);
