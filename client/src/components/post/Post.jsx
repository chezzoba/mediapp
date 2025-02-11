import React, { Fragment, useEffect } from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getPost } from "../../actions/post";
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ getPost, post, loading, match }) => {
    useEffect(() => {
        getPost(match.params.id);
    }, [getPost, match.params.id]);

  return loading || post === null ? <Spinner/> : (
  <Fragment>
      <Link to="/posts" className="btn">Back to Posts</Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
          {post.comments.map(cm => (
              <CommentItem key={cm._id} comment={cm} postId={post._id}/>
          ))}
      </div>
  </Fragment>)
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  post: state.post.post,
  loading: state.post.loading
});

export default connect(mapStateToProps, { getPost })(Post);
