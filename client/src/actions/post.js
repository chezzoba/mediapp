import axios from 'axios';
import { setAlert } from './alert';

// Types: GET_POSTS, POST_ERROR, UPDATE_LIKES, GET_POST

export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');
        dispatch({
            type: 'GET_POSTS',
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: 'POST_ERROR',
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}

export const getPost = (id) => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({
            type: 'GET_POST',
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: 'POST_ERROR',
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}

export const updateLikes = (postId, option='like') => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/${option}/${postId}`);
        dispatch({
            type: 'UPDATE_LIKES',
            payload: {postId, likes: res.data}
        });
    } catch (err) {
        console.log(err);
        dispatch({
            type: 'POST_ERROR',
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}

export const deletePost = (postId) => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postId}`);
        dispatch({
            type: 'DELETE_POST',
            payload: postId
        });
        dispatch(setAlert('Post Removed!', 'success'));
    } catch (err) {
        dispatch({
            type: 'POST_ERROR',
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}

export const addPost = (data) => async dispatch => {
    const config = {
        headers: {"Content-Type": "application/json"}
    }
    try {
        const res = await axios.post(`/api/posts/`, data, config);
        dispatch({
            type: 'ADD_POST',
            payload: res.data
        });
        dispatch(setAlert('Posted!', 'success'));
    } catch (err) {
        dispatch({
            type: 'POST_ERROR',
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}

export const addComment = (postId, data) => async dispatch => {
    const config = {
        headers: {"Content-Type": "application/json"}
    }
    try {
        const res = await axios.post(`/api/posts/comment/${postId}/`, data, config);
        dispatch({
            type: 'ADD_COMMENT',
            payload: res.data
        });
        dispatch(setAlert('Comment added!', 'success'));
    } catch (err) {
        dispatch({
            type: 'POST_ERROR',
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}

export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
        dispatch({
            type: 'DELETE_COMMENT',
            payload: commentId
        });
        dispatch(setAlert('Comment Removed', 'success'));
    } catch (err) {
        dispatch({
            type: 'POST_ERROR',
            payload: { msg: err.response.statusText, status: err.response.status },
          });
    }
}